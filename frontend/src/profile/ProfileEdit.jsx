import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Save, User, MapPin, Briefcase, GraduationCap,
  Code, Globe, Plus, Trash2, Loader2, Linkedin, Github, Twitter,
  Layout, Award
} from "lucide-react";
import { getProfile, updateProfile } from "../services/profileApi";

/* ===========================
   ✅ SAFE DEFAULT PROFILE
=========================== */
const EMPTY_PROFILE = {
  userId: "",
  displayName: "",
  bio: "",
  profilePhoto: "",
  location: "",
  currentWorking: {
    status: "STUDENT",
    role: "",
    organization: "",
    startDate: "",
    description: "",
  },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: [],
  socialLinks: {
    linkedin: "",
    github: "",
    portfolio: "",
    twitter: "",
  },
};

/* ===========================
   ✅ TABS CONFIG
=========================== */
const TABS = [
  { id: "basic", label: "Basic Info", icon: User },
  { id: "social", label: "Social Links", icon: Globe },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: Layout },
  { id: "skills", label: "Skills", icon: Code },
  // 👇 ADDED THESE
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "achievements", label: "Achievements", icon: Award },
];

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [profile, setProfile] = useState(EMPTY_PROFILE);

  /* ===========================
     ✅ FETCH + NORMALIZE
  =========================== */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getProfile();
      const data = res?.data ?? {};

      const arr = (v) => (Array.isArray(v) ? v : []);
      const obj = (v) => (v && typeof v === "object" ? v : {});

      setProfile((prev) => ({
        ...prev,
        ...data,
        experiences: arr(data.experiences),
        education: arr(data.education),
        projects: arr(data.projects),
        certifications: arr(data.certifications),
        achievements: arr(data.achievements),
        skills: arr(data.skills).map((s) =>
          typeof s === "string" ? { name: s, level: "Beginner" } : s
        ),
        currentWorking: { ...prev.currentWorking, ...obj(data.currentWorking) },
        socialLinks: { ...prev.socialLinks, ...obj(data.socialLinks) },
      }));
    } catch (err) {
      console.error("Profile load failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     ✅ HANDLERS
  =========================== */
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleNestedChange = (parent, field, value) => {
    setProfile({
      ...profile,
      [parent]: { ...(profile[parent] ?? {}), [field]: value },
    });
  };

  const handleArrayChange = (arrName, index, field, value) => {
    const copy = [...(profile[arrName] ?? [])];
    copy[index] = { ...(copy[index] ?? {}), [field]: value };
    setProfile({ ...profile, [arrName]: copy });
  };

  const addItem = (arrName, template) => {
    setProfile({
      ...profile,
      [arrName]: [...(profile[arrName] ?? []), template],
    });
  };

  const removeItem = (arrName, index) => {
    setProfile({
      ...profile,
      [arrName]: (profile[arrName] ?? []).filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log("Saving profile", profile);
      await updateProfile(profile);
      navigate("/profile");
    } catch {
      alert("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-indigo-500 w-10 h-10" />
      </div>
    );
  }

  /* ===========================
     ✅ RENDER CONTENT
  =========================== */
  const renderContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <div className="space-y-6 animate-in fade-in duration-300">

            {/* --- 1. PERSONAL INFO --- */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <Input
                  label="Display Name"
                  name="displayName"
                  value={profile.displayName}
                  onChange={handleChange}
                />
                <Input
                  label="Location"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  icon={<MapPin size={16} />}
                />
                <Input
                  label="Profile Photo URL"
                  name="profilePhoto"
                  value={profile.profilePhoto}
                  onChange={handleChange}
                />
              </div>

              {/* Photo Preview */}
              <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 flex-shrink-0 mx-auto md:mx-0">
                {profile.profilePhoto ? (
                  <img src={profile.profilePhoto} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <User size={32} />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Professional Bio</label>
              <textarea
                name="bio"
                value={profile.bio || ""}
                onChange={handleChange}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-100 outline-none focus:border-indigo-500"
                placeholder="Short bio about yourself..."
              />
            </div>

            <hr className="border-slate-800 my-2" />

            {/* --- 2. CURRENT WORKING STATUS (Mapped to your JSON) --- */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Briefcase size={20} className="text-indigo-400" />
                Current Status
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Matches: role */}
                <Input
                  label="Current Role"
                  value={profile.currentWorking.role}
                  onChange={(e) => handleNestedChange("currentWorking", "role", e.target.value)}
                />

                {/* Matches: organization */}
                <Input
                  label="Organization / Company"
                  value={profile.currentWorking.organization}
                  onChange={(e) => handleNestedChange("currentWorking", "organization", e.target.value)}
                />

                {/* Matches: status */}
                <div className="space-y-1.5 w-full">
                  <label className="text-xs font-medium text-slate-400">Work Status</label>
                  <select
                    value={profile.currentWorking.status}
                    onChange={(e) => handleNestedChange("currentWorking", "status", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 text-sm outline-none focus:border-indigo-500"
                  >
                    <option value="OPEN_TO_WORK">Open to Work</option>
                    <option value="HIRED">Employed / Hired</option>
                    <option value="STUDENT">Student</option>
                    <option value="FREELANCER">Freelancer</option>
                    <option value="NOT_INTERESTED">Not Looking</option>
                  </select>
                </div>

                {/* Matches: startDate */}
                <Input
                  label="Started Since"
                  type="date"
                  value={profile.currentWorking.startDate}
                  onChange={(e) => handleNestedChange("currentWorking", "startDate", e.target.value)}
                />
              </div>

              {/* Matches: description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Current Role Description</label>
                <textarea
                  value={profile.currentWorking.description || ""}
                  onChange={(e) => handleNestedChange("currentWorking", "description", e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-100 outline-none focus:border-indigo-500 placeholder:text-slate-600"
                  placeholder="Describe your current responsibilities or what kind of work you are looking for..."
                />
              </div>
            </div>

          </div>
        );

      case "social":
        return (
          <div className="space-y-5 animate-in fade-in duration-300">
            <h3 className="text-lg font-semibold text-white mb-4">Connect your Accounts</h3>
            <Input label="LinkedIn Profile" value={profile.socialLinks.linkedin} onChange={e => handleNestedChange("socialLinks", "linkedin", e.target.value)} icon={<Linkedin size={16} />} />
            <Input label="GitHub Profile" value={profile.socialLinks.github} onChange={e => handleNestedChange("socialLinks", "github", e.target.value)} icon={<Github size={16} />} />
            <Input label="Twitter / X" value={profile.socialLinks.twitter} onChange={e => handleNestedChange("socialLinks", "twitter", e.target.value)} icon={<Twitter size={16} />} />
            <Input label="Portfolio Website" value={profile.socialLinks.portfolio} onChange={e => handleNestedChange("socialLinks", "portfolio", e.target.value)} icon={<Globe size={16} />} />
          </div>
        );

      case "experience":
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            {profile.experiences.map((exp, idx) => (
              <div key={idx} className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg relative group">
                <button onClick={() => removeItem("experiences", idx)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Job Title" value={exp.role} onChange={(e) => handleArrayChange("experiences", idx, "role", e.target.value)} />
                  <Input label="Company" value={exp.company} onChange={(e) => handleArrayChange("experiences", idx, "company", e.target.value)} />
                  <Input label="Start Date" type="date" value={exp.startDate} onChange={(e) => handleArrayChange("experiences", idx, "startDate", e.target.value)} />
                  <Input label="End Date" type="date" value={exp.endDate} onChange={(e) => handleArrayChange("experiences", idx, "endDate", e.target.value)} />
                </div>
                <div className="mt-4 space-y-2">
                  <label className="text-xs font-medium text-slate-400">Description</label>
                  <textarea
                    value={exp.description || ""}
                    onChange={(e) => handleArrayChange("experiences", idx, "description", e.target.value)}
                    className="w-full bg-slate-950 p-2 rounded border border-slate-700 text-slate-200 outline-none"
                  />
                </div>
              </div>
            ))}
            <AddItemButton label="Add Experience" onClick={() => addItem("experiences", { role: "", company: "", startDate: "", endDate: "", description: "" })} />
          </div>
        );

      case "education":
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            {profile.education.map((edu, idx) => (
              <div key={idx} className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg relative group">
                <button onClick={() => removeItem("education", idx)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Degree / Course" value={edu.degree} onChange={(e) => handleArrayChange("education", idx, "degree", e.target.value)} />
                  <Input label="Institution" value={edu.institution} onChange={(e) => handleArrayChange("education", idx, "institution", e.target.value)} />
                  <Input label="Start Date" type="date" value={edu.startDate} onChange={(e) => handleArrayChange("education", idx, "startDate", e.target.value)} />
                  <Input label="End Date" type="date" value={edu.endDate} onChange={(e) => handleArrayChange("education", idx, "endDate", e.target.value)} />
                </div>
                {/* ADDED DESCRIPTION FIELD */}
                <div className="mt-4 space-y-2">
                  <label className="text-xs font-medium text-slate-400">Description (Optional)</label>
                  <textarea
                    value={edu.description || ""}
                    onChange={(e) => handleArrayChange("education", idx, "description", e.target.value)}
                    className="w-full bg-slate-950 p-2 rounded border border-slate-700 text-slate-200 outline-none"
                  />
                </div>
              </div>
            ))}
            <AddItemButton label="Add Education" onClick={() => addItem("education", { degree: "", institution: "", startDate: "", endDate: "", description: "" })} />
          </div>
        );

      case "projects":
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            {profile.projects.map((proj, idx) => (
              <div key={idx} className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg relative">
                <button onClick={() => removeItem("projects", idx)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400"><Trash2 size={18} /></button>
                <div className="space-y-4">
                  <Input label="Project Title" value={proj.title} onChange={(e) => handleArrayChange("projects", idx, "title", e.target.value)} />
                  {/* CHANGED: Split Link into LiveURL and RepoURL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Live URL" value={proj.liveUrl} onChange={(e) => handleArrayChange("projects", idx, "liveUrl", e.target.value)} />
                    <Input label="Repo URL" value={proj.repoUrl} onChange={(e) => handleArrayChange("projects", idx, "repoUrl", e.target.value)} />
                  </div>
                  {/* ADDED: Tech Stack */}
                  <Input label="Tech Stack (comma separated)" value={proj.techStack} onChange={(e) => handleArrayChange("projects", idx, "techStack", e.target.value)} />

                  <div className="space-y-1">
                    <label className="text-sm text-slate-400">Description</label>
                    <textarea
                      value={proj.description || ""}
                      onChange={(e) => handleArrayChange("projects", idx, "description", e.target.value)}
                      className="w-full bg-slate-950 p-2 rounded border border-slate-700 text-slate-200 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
            {/* Updated template to match fields */}
            <AddItemButton label="Add Project" onClick={() => addItem("projects", { title: "", liveUrl: "", repoUrl: "", techStack: "", description: "" })} />
          </div>
        );

      case "skills":
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.skills.map((skill, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-slate-900/50 p-3 rounded border border-slate-700">
                  <div className="flex-1">
                    <Input label="Skill Name" value={skill.name} onChange={(e) => handleArrayChange("skills", idx, "name", e.target.value)} />
                  </div>
                  <div className="w-1/3">
                    <label className="text-xs text-slate-500 mb-1 block">Level</label>
                    <select
                      value={skill.level}
                      onChange={(e) => handleArrayChange("skills", idx, "level", e.target.value)}
                      className="w-full bg-slate-950 p-2 rounded border border-slate-700 text-slate-200 text-sm focus:border-indigo-500 outline-none"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Expert</option>
                    </select>
                  </div>
                  <button onClick={() => removeItem("skills", idx)} className="mt-5 text-slate-500 hover:text-red-400 p-2"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
            <AddItemButton label="Add Skill" onClick={() => addItem("skills", { name: "", level: "Beginner" })} />
          </div>
        );

      /* --- NEW SECTIONS --- */

      case "certifications":
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            {profile.certifications.map((cert, idx) => (
              <div key={idx} className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg relative group">
                <button onClick={() => removeItem("certifications", idx)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400"><Trash2 size={18} /></button>
                <div className="space-y-4">
                  <Input label="Certification Name" value={cert.name} onChange={(e) => handleArrayChange("certifications", idx, "name", e.target.value)} />
                  <Input label="Issuer / Organization" value={cert.issuer} onChange={(e) => handleArrayChange("certifications", idx, "issuer", e.target.value)} />
                  <Input label="Date" type="date" value={cert.date} onChange={(e) => handleArrayChange("certifications", idx, "date", e.target.value)} />
                  <Input label="Credential URL" value={cert.link} onChange={(e) => handleArrayChange("certifications", idx, "link", e.target.value)} />
                </div>
              </div>
            ))}
            <AddItemButton label="Add Certification" onClick={() => addItem("certifications", { name: "", issuer: "", date: "", link: "" })} />
          </div>
        );

      case "achievements":
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            {profile.achievements.map((ach, idx) => (
              <div key={idx} className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg relative group">
                <button onClick={() => removeItem("achievements", idx)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400"><Trash2 size={18} /></button>
                <div className="space-y-4">
                  <Input label="Achievement Title" value={ach.title} onChange={(e) => handleArrayChange("achievements", idx, "title", e.target.value)} />
                  <div className="space-y-1">
                    <label className="text-sm text-slate-400">Description</label>
                    <textarea
                      value={ach.description || ""}
                      onChange={(e) => handleArrayChange("achievements", idx, "description", e.target.value)}
                      className="w-full bg-slate-950 p-2 rounded border border-slate-700 text-slate-200 focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
            <AddItemButton label="Add Achievement" onClick={() => addItem("achievements", { title: "", description: "" })} />
          </div>
        );

      default:
        return null;
    }
  };

  /* ===========================
     ✅ MAIN UI
  =========================== */
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 bg-slate-900 rounded-full hover:bg-slate-800 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
              <p className="text-slate-400 text-sm">Update your personal details and professional portfolio</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span>Save Changes</span>
          </button>
        </header>

        {/* LAYOUT: SIDEBAR + CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* SIDEBAR TABS */}
          <aside className="lg:col-span-1 space-y-1">
            <div className="sticky top-8">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                      ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}
            </div>
          </aside>

          {/* MAIN CONTENT FORM */}
          <main className="lg:col-span-3">
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 md:p-8 shadow-sm">
              {renderContent()}
            </div>
          </main>
        </div>

      </div>
    </div>
  );
}

function AddItemButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 border border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-slate-900/50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
    >
      <Plus size={16} />
      {label}
    </button>
  );
}

/* ===========================
   ✅ REUSABLE COMPONENTS
=========================== */

function Input({ label, value, onChange, name, icon, type = "text" }) {
  // 🛑 FIX IS HERE:
  // If value is undefined or null, default to "" immediately.
  const safeValue = value ?? "";

  return (
    <div className="space-y-1.5 w-full">
      <label className="text-xs font-medium text-slate-400 flex items-center gap-2">
        {icon} {label}
      </label>
      <input
        type={type}
        name={name}
        value={safeValue}
        onChange={onChange}
        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
      />
    </div>
  );
}
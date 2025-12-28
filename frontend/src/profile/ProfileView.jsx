import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Edit3, Loader2, MapPin,
  Briefcase, GraduationCap, Code2,
  Award, Globe, ExternalLink, Calendar,
  Github, Linkedin, Twitter, Trophy
} from "lucide-react";
import { getProfile, getPublicUserProfile } from "../services/profileApi"; // Ensure both are imported

export default function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // 1. Capture userId from URL params
  const { userId } = useParams();

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        let res;
        
        // 2. Logic: If userId exists, fetch public profile. Otherwise, fetch "my" profile.
        if (userId) {
          console.log("Fetching public profile for:", userId);
          res = await getPublicUserProfile(userId);
        } else {
          console.log("Fetching my profile");
          res = await getProfile();
        }

        // Safety check: ensure response has data
        if (res && res.data) {
          setProfile(res.data);
        } else {
          console.error("No data received from profile API");
          setProfile(null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        // If public profile not found, maybe show a 404 state or toast
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate, userId]); // Re-run if userId changes

  // Helper: Date Formatter
  const formatDate = (dateString, isEndDate = false) => {
    if (!dateString) return isEndDate ? "Present" : ""; 
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch (e) {
      return dateString;
    }
  };

  // Helper: Check if array has valid data
  const hasData = (arr) => Array.isArray(arr) && arr.length > 0;

  // Helper: Social Icons
  const getSocialIcon = (key) => {
    switch (key.toLowerCase()) {
      case 'github': return <Github size={18} />;
      case 'linkedin': return <Linkedin size={18} />;
      case 'twitter': case 'x': return <Twitter size={18} />;
      default: return <Globe size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  // Handle case where profile is not found
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-50 flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-slate-400">User not found</h2>
        <button onClick={() => navigate(-1)} className="text-indigo-400 hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* === TOP NAVIGATION === */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)} // Changed to go back history
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          {/* 3. Logic: Only show Edit button if NO userId is present (meaning it's 'me') */}
          {!userId && (
            <button
              onClick={() => navigate("/profile/edit")}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
          )}
        </div>

        {/* === HERO SECTION === */}
        <div className="bg-slate-900/50 border border-white/10 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl mb-8">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 opacity-90 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          </div>
          
          <div className="px-8 pb-10 relative">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              
              {/* Profile Photo */}
              <div className="relative -mt-16 shrink-0">
                <img
                  src={profile.profilePhoto || `https://ui-avatars.com/api/?name=${profile.displayName || 'User'}&background=6366f1&color=fff`}
                  alt={profile.displayName}
                  className="w-32 h-32 rounded-3xl object-cover border-4 border-[#0f172a] shadow-2xl bg-slate-800"
                />
                {/* Only show status if it exists */}
                {profile.currentWorking?.status === "OPEN_TO_WORK" && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap border-2 border-[#0f172a] shadow-lg">
                    OPEN TO WORK
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="pt-4 flex-1 w-full">
                <h1 className="text-3xl font-bold tracking-tight">{profile.displayName || "Anonymous User"}</h1>
                
                {/* Current Role Display - Conditional Rendering */}
                {profile.currentWorking?.role && (
                  <p className="text-slate-300 text-lg flex flex-wrap items-center gap-2 mt-1 font-medium">
                    <Briefcase size={16} className="text-indigo-400 shrink-0" />
                    {profile.currentWorking.role}
                    {profile.currentWorking.organization && (
                      <span className="text-slate-500">at {profile.currentWorking.organization}</span>
                    )}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-400">
                  {profile.location && (
                    <span className="flex items-center gap-1 hover:text-white transition-colors">
                      <MapPin size={14} className="text-pink-500" /> {profile.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Social Links - Conditional Rendering */}
              {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
                <div className="pt-4 flex gap-2">
                  {Object.entries(profile.socialLinks).map(([key, url]) => {
                    if (!url) return null;
                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-slate-300 hover:text-white hover:scale-110 transition-all"
                        title={key}
                      >
                        {getSocialIcon(key)}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bio - Conditional Rendering */}
            {profile.bio && (
              <div className="mt-8 p-5 bg-white/5 rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                <h3 className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">About Me</h3>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {profile.bio}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* === LEFT COLUMN (Skills, Certs, Achievements) === */}
          <div className="space-y-6">
            
            {/* Skills */}
            {hasData(profile.skills) && (
              <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-6 h-fit">
                <div className="flex items-center gap-3 mb-4 text-indigo-400">
                  <Code2 size={20} />
                  <h2 className="font-bold text-lg text-slate-200">Skills</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full hover:bg-indigo-500/20 transition-colors cursor-default">
                      {typeof skill === 'object' ? skill.name : skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {hasData(profile.certifications) && (
              <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-6">
                <div className="flex items-center gap-3 mb-4 text-emerald-400">
                  <Award size={20} />
                  <h2 className="font-bold text-lg text-slate-200">Certifications</h2>
                </div>
                <ul className="space-y-4">
                  {profile.certifications.map((cert, i) => (
                    <li key={i} className="flex flex-col border-l-2 border-emerald-500/30 pl-3">
                      <span className="text-slate-200 font-medium text-sm">{cert.name}</span>
                      {(cert.issuedBy || cert.organization || cert.year) && (
                        <span className="text-slate-500 text-xs mt-0.5">
                           {[cert.issuedBy || cert.organization, cert.year].filter(Boolean).join(" • ")}
                        </span>
                      )}
                      {cert.credentialUrl && (
                        <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-[10px] text-emerald-400 hover:underline mt-1 w-fit">View Credential</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Achievements */}
            {hasData(profile.achievements) && (
              <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-6">
                <div className="flex items-center gap-3 mb-4 text-yellow-400">
                  <Trophy size={20} />
                  <h2 className="font-bold text-lg text-slate-200">Achievements</h2>
                </div>
                <ul className="space-y-3">
                  {profile.achievements.map((ach, i) => (
                    <li key={i} className="text-sm text-slate-300 pl-2 border-l border-yellow-500/30">
                      {typeof ach === 'string' ? ach : ach.title || ach.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* === RIGHT COLUMN (Experience, Projects, Education) === */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Work History */}
            {hasData(profile.experiences) && (
              <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-6">
                <div className="flex items-center gap-3 mb-6 text-blue-400">
                  <Briefcase size={20} />
                  <h2 className="font-bold text-lg text-slate-200">Work History</h2>
                </div>
                <div className="space-y-8 relative border-l-2 border-white/5 ml-3 pl-8 pb-2">
                  {profile.experiences.map((exp, i) => (
                    <div key={i} className="relative group">
                      <div className="absolute -left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-blue-500 group-hover:bg-blue-500 transition-colors shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                      <h3 className="font-bold text-slate-200 text-lg">{exp.role}</h3>
                      <p className="text-blue-400 text-sm font-medium mb-1">{exp.company}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 font-mono uppercase tracking-wide">
                        <Calendar size={12} />
                        <span>
                          {exp.startDate ? formatDate(exp.startDate) : "N/A"} — {formatDate(exp.endDate, true)}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {hasData(profile.projects) && (
              <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-6">
                <div className="flex items-center gap-3 mb-6 text-pink-400">
                  <Code2 size={20} />
                  <h2 className="font-bold text-lg text-slate-200">Projects</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.projects.map((proj, i) => (
                    <div key={i} className="group flex flex-col p-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all cursor-default h-full hover:-translate-y-1 hover:shadow-xl">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-200 group-hover:text-pink-400 transition-colors">{proj.title}</h3>
                        <div className="flex gap-2">
                          {proj.repoUrl && <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors"><Github size={16} /></a>}
                          {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors"><ExternalLink size={16} /></a>}
                        </div>
                      </div>
                      {proj.description && (
                        <p className="text-xs text-slate-400 line-clamp-3 mb-4 flex-grow">
                          {proj.description}
                        </p>
                      )}
                      {hasData(proj.techStack) && (
                        <div className="flex flex-wrap gap-1 mt-auto">
                          {proj.techStack.map((t, idx) => (
                            <span key={idx} className="text-[10px] bg-black/30 px-2 py-1 rounded-md text-slate-300 font-mono border border-white/5">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {hasData(profile.education) && (
              <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-6">
                <div className="flex items-center gap-3 mb-6 text-purple-400">
                  <GraduationCap size={20} />
                  <h2 className="font-bold text-lg text-slate-200">Education</h2>
                </div>
                <div className="space-y-4">
                  {profile.education.map((edu, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors">
                      <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 shrink-0">
                        <GraduationCap size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-200">{edu.institution}</h3>
                        <p className="text-sm text-purple-200/80">{edu.degree}</p>
                        <p className="text-xs text-slate-500 mt-1 font-mono">
                          {formatDate(edu.startDate)} — {formatDate(edu.endDate, true)}
                        </p>
                        {edu.description && (
                          <p className="text-xs text-slate-400 mt-2">{edu.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* === FOOTER === */}
        <div className="mt-12 mb-6 border-t border-white/10 pt-6 flex justify-center">
          <p className="text-xs text-slate-600 font-mono">
             {/* Fallback in case userId is hidden/missing */}
            User ID: {profile.userId || userId || "Unknown"}
          </p>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users as UsersIcon,
    Search,
    MessageCircle,
    UserPlus,
    UserMinus,
    Loader2,
    LayoutDashboard,
    Settings,
    User,
    LogOut,
    ExternalLink,
    Briefcase,
    Award,
    CheckCircle2
} from "lucide-react";
import api from "../services/api";

export default function Friends() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/users");
                if (res.data && Array.isArray(res.data)) {
                    setUsers(res.data);
                    console.log(res.data)
                } else {
                    setUsers([]);
                }
            } catch (err) {
                console.error("Failed to fetch users", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleFollowToggle = async (e, targetUser) => {
        e.stopPropagation();
        setActionLoading(targetUser.userId);

        const isFollowing = targetUser.isFollowing;

        try {
            if (isFollowing) {
                await api.delete(`/users/me/unfollow/${targetUser.userId}`);
            } else {
                await api.post(`/users/me/follow/${targetUser.userId}`);
            }

            setUsers(prev =>
                prev.map(u =>
                    u.userId === targetUser.userId
                        ? { ...u, isFollowing: !isFollowing }
                        : u
                )
            );

        } catch (err) {
            console.error("Follow action failed", err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleNavigateToProfile = (userId) => {
        navigate(`/profile/${userId}`);
    };

    // 🔹 HELPER: Detect "Mentor" or Senior roles for badges
    const getUserBadges = (user) => {
        const badges = [];
        const textToCheck = (user.currentWorking?.role + " " + user.bio).toLowerCase();

        if (textToCheck.includes("mentor") || textToCheck.includes("teacher") || textToCheck.includes("professor")) {
            badges.push({ label: "Mentor", icon: <Award size={10} />, color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" });
        } else if (textToCheck.includes("lead") || textToCheck.includes("senior") || textToCheck.includes("manager")) {
            badges.push({ label: "Leader", icon: <CheckCircle2 size={10} />, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" });
        }

        return badges;
    };

    const filteredUsers = users.filter(u =>
        u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-50 flex font-sans">
            {/* SIDEBAR */}
            <aside className="w-64 border-r border-white/5 bg-slate-900/50 backdrop-blur-md hidden md:flex flex-col p-6 sticky top-0 h-screen">
                <div className="flex items-center gap-2 mb-10 px-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
                    <div className="bg-indigo-600 p-1.5 rounded-lg">
                        <MessageCircle size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">ChatPeer</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarLink icon={<LayoutDashboard size={18} />} label="Dashboard" onClick={() => navigate("/dashboard")} />
                    <SidebarLink icon={<MessageCircle size={18} />} label="Messages" onClick={() => navigate("/messages")} />
                    <SidebarLink icon={<UsersIcon size={18} />} label="Discover" active onClick={() => navigate("/users")} />
                    <SidebarLink icon={<User size={18} />} label="Profile" onClick={() => navigate("/profile")} />
                    <SidebarLink icon={<Settings size={18} />} label="Settings" onClick={() => navigate("/settings")} />
                </nav>

                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all mt-auto">
                    <LogOut size={18} />
                    <span className="font-medium">Logout</span>
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                <div className="max-w-7xl mx-auto">

                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Discover Peers</h1>
                            <p className="text-slate-400 text-sm">Find mentors, colleagues, and friends.</p>
                        </div>

                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm shadow-sm"
                            />
                        </div>
                    </header>

                    {filteredUsers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredUsers.map((item) => {
                                const badges = getUserBadges(item);
                                const isOpenToWork = item.currentWorking?.status === "OPEN_TO_WORK";

                                return (
                                    <div
                                        key={item.userId}
                                        onClick={() => handleNavigateToProfile(item.userId)}
                                        className="bg-slate-900/40 border border-white/5 p-5 rounded-[2rem] hover:bg-slate-800/50 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col h-full shadow-xl shadow-black/20 relative overflow-hidden"
                                    >
                                        {/* Header: Avatar & Name */}
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="relative shrink-0">
                                                <img
                                                    src={item.profilePhoto || `https://ui-avatars.com/api/?name=${item.displayName}&background=6366f1&color=fff`}
                                                    className={`w-14 h-14 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300 ${isOpenToWork ? 'border-2 border-emerald-500 p-0.5' : 'border-2 border-slate-700'}`}
                                                    alt={item.displayName}
                                                />
                                                {isOpenToWork && (
                                                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-slate-900 border border-slate-900">
                                                        HIRE
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 pt-0.5">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <h3 className="font-bold text-base text-slate-200 truncate group-hover:text-indigo-400 transition-colors">
                                                        {item.displayName}
                                                    </h3>
                                                    {/* Render Badges */}
                                                    {badges.map((b, i) => (
                                                        <span key={i} className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${b.color}`}>
                                                            {b.icon} {b.label}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Role & Org */}
                                                {item.currentWorking?.role ? (
                                                    <div className="flex flex-col">
                                                        <p className="text-xs text-indigo-300 font-medium truncate flex items-center gap-1">
                                                            <Briefcase size={10} />
                                                            {item.currentWorking.role}
                                                        </p>
                                                        {item.currentWorking.organization && (
                                                            <p className="text-[10px] text-slate-500 truncate ml-3.5">
                                                                @ {item.currentWorking.organization}
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-slate-500 truncate italic">@{item.displayName?.toLowerCase().replace(/\s/g, '')}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Bio / Description */}
                                        <div className="mb-6 flex-grow">
                                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed h-[2.5em]">
                                                {item.bio || "No bio available."}
                                            </p>
                                        </div>

                                        {/* Actions Footer */}
                                        <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
                                            <button
                                                disabled={actionLoading === item.userId}
                                                onClick={(e) => handleFollowToggle(e, item)}
                                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all active:scale-95 ${item.isFollowing
                                                    ? "bg-slate-800 text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-slate-700"
                                                    : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
                                                    }`}
                                            >
                                                {actionLoading === item.userId ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : item.isFollowing ? (
                                                    <>
                                                        <UserMinus size={14} /> Unfollow
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus size={14} /> Follow
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/messages?user=${item.userId}`);
                                                }}
                                                className="p-2 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl text-slate-400 transition-colors border border-slate-700 group/btn"
                                                title="Message"
                                            >
                                                <MessageCircle size={18} className="group-hover/btn:scale-110 transition-transform" />
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleNavigateToProfile(item.userId);
                                                }}
                                                className="p-2 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl text-slate-400 transition-colors border border-slate-700 group/btn"
                                                title="View Profile"
                                            >
                                                <ExternalLink size={18} className="group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 border border-dashed border-white/10 rounded-[3rem]">
                            <div className="bg-slate-800/50 p-4 rounded-full mb-4">
                                <UsersIcon size={32} className="text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-300">No users found</h3>
                            <p className="text-slate-500 text-sm mt-1">Try adjusting your search terms</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function SidebarLink({ icon, label, active = false, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${active
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
        >
            {icon}
            {label}
        </button>
    );
}
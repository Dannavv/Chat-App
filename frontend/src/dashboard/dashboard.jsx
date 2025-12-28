import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import {
    User,
    Users,
    Mail,
    Settings,
    LogOut,
    MessageSquare,
    Edit3,
    Loader2,
    LayoutDashboard,
    BarChart3,
    MessageCircle
} from "lucide-react";
import api from "../services/api";

// Add this helper function inside Dashboard.js or a separate file
function SidebarLink({ icon, label, active = false, onClick, badges = [] }) {
    return (
        <button
            onClick={onClick}
            // 1. Changed 'items-center' to 'items-start' so the icon stays at the top
            // 2. Removed 'justify-between' so everything stays grouped to the left
            className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-all font-medium group ${
                active 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
        >
            {/* Icon Wrapper: Added mt-0.5 to align perfectly with the text on the first line */}
            <div className="mt-0.5 shrink-0">
                {icon}
            </div>

            {/* Content Wrapper: Flex Column puts Label on top and Badges below */}
            <div className="flex flex-col items-start text-left">
                <span className="leading-tight">{label}</span>
                
                {badges.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {badges.map((badge, index) => (
                            <span 
                                key={index} 
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                                    // If active, force white style, otherwise use the passed color
                                    active ? "bg-white/20 text-white border border-transparent" : badge.className
                                }`}
                            >
                                {badge.text}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </button>
    );
}

function StatCard({ label, value, icon }) {
    return (
        <div className="bg-slate-900/50 border border-white/10 p-6 rounded-3xl flex items-center justify-between transition-transform hover:scale-[1.02]">
            <div>
                <p className="text-sm text-slate-400 mb-1">{label}</p>
                <p className="text-3xl font-bold">{value || 0}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl">
                {icon}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const location = useLocation(); // Used to track active tab

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get("/dashboard");
                setDashboard(res.data);
            } catch (err) {
                const status = err.response?.status;
                if (status === 401 || status === 403) {
                    localStorage.removeItem("token");
                    navigate("/login");
                } else {
                    setError("Failed to load dashboard data");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        // Using navigate instead of window.location for a smoother SPA feel
        navigate("/");
        window.location.reload();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="animate-spin mb-4 text-indigo-500" size={40} />
                <p className="text-lg font-medium animate-pulse">Loading Workspace...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
                <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-red-400 text-center max-w-sm">
                    <p className="font-bold text-xl mb-2">Oops!</p>
                    <p className="text-sm opacity-80 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-all font-bold"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-50 flex">
            {/* SIDEBAR */}
            <aside className="w-64 border-r border-white/5 bg-slate-900/50 backdrop-blur-md hidden md:flex flex-col p-6 sticky top-0 h-screen">
                <div className="flex items-center gap-2 mb-10 px-2">
                    <div className="bg-indigo-600 p-1.5 rounded-lg">
                        <MessageSquare size={20} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">ChatPeer</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarLink
                        icon={<LayoutDashboard size={18} />}
                        label="Dashboard"
                        active={location.pathname === "/dashboard"}
                        onClick={() => navigate("/dashboard")}
                    />

                    <SidebarLink
                        icon={<MessageCircle size={18} />}
                        label="Messages"
                        active={location.pathname === "/messages"}
                        onClick={() => navigate("/messages")}
                        badges={[
                            {
                                text: `${dashboard.unreadChats || 0} Chat`,
                                className: "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            },
                            {
                                text: `${dashboard.unreadMessages || 0} Msg`,
                                className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }
                        ].filter(b => !b.text.startsWith("0"))}
                    />

                    <SidebarLink
                        icon={<Users size={18} />}
                        label="Discover"
                        active={location.pathname === "/friends"}
                        onClick={() => navigate("/friends")}
                    />
                    <SidebarLink
                        icon={<User size={18} />}
                        label="Profile"
                        active={location.pathname === "/profile"}
                        onClick={() => navigate("/profile")}
                    />
                    <SidebarLink
                        icon={<Settings size={18} />}
                        label="Settings"
                        active={location.pathname === "/settings"}
                        onClick={() => navigate("/settings")}
                    />
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all mt-auto border border-transparent hover:border-red-500/10"
                >
                    <LogOut size={18} />
                    <span className="font-medium">Logout</span>
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                <header className="max-w-5xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome back, {dashboard.displayName}!</h1>
                        <p className="text-slate-400 text-sm">Here is what’s happening with your account.</p>
                    </div>
                    <button
                        onClick={() => navigate("/profile/edit")}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-medium transition-all shadow-xl"
                    >
                        <Edit3 size={16} />
                        Edit Profile
                    </button>
                </header>

                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* USER INFO CARD */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-slate-900/80 border border-white/10 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[50px] rounded-full group-hover:bg-indigo-600/20 transition-all" />

                            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
                                <img
                                    src={dashboard.profilePhoto || `https://ui-avatars.com/api/?name=${dashboard.displayName}&background=6366f1&color=fff`}
                                    alt="avatar"
                                    className="w-28 h-28 rounded-3xl object-cover border-2 border-indigo-500/50 shadow-2xl"
                                />
                                <div className="space-y-4 flex-1">
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight">{dashboard.displayName}</h2>
                                        <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                                            <Mail size={14} className="text-indigo-400" />
                                            {dashboard.email}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1.5">Bio</p>
                                        <p className="text-slate-300 leading-relaxed italic text-sm">
                                            {dashboard.bio ? `"${dashboard.bio}"` : "No bio set yet. Tell your peers who you are!"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-8">
                            <h3 className="text-lg font-bold mb-6">Quick Actions</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <ActionCard
                                    title="Start New Chat"
                                    desc="Connect with a new peer"
                                    color="text-indigo-400"
                                    onClick={() => navigate('/messages')}
                                />
                                <ActionCard
                                    title="Join Group"
                                    desc="Browse active communities"
                                    color="text-purple-400"
                                    onClick={() => navigate('/friends')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* STATS SIDEBAR */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                            <BarChart3 size={16} /> Activity Stats
                        </h3>

                        <div className="grid grid-cols-1 gap-4">
                            <StatCard
                                label="Total Chats"
                                value={dashboard.totalChats}
                                icon={<MessageCircle className="text-blue-400" />}
                            />
                            <StatCard
                                label="Total Messages"
                                value={dashboard.totalMessages}
                                icon={<MessageSquare className="text-emerald-400" />}
                            />
                            <StatCard
                                label="Followers"
                                value={dashboard.totalFollowers}
                                icon={<Users className="text-purple-400" />}
                            />
                            <StatCard
                                label="Following"
                                value={dashboard.totalFollowing}
                                icon={<User className="text-orange-400" />}
                            />
                        </div>

                        <div className="p-6 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-3xl">
                            <h4 className="font-bold text-white mb-2 text-sm flex items-center gap-2">
                                💡 Pro Tip
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Regularly updating your bio helps peers find you based on shared interests and skills!
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Added a small internal helper for Quick Actions
function ActionCard({ title, desc, color, onClick }) {
    return (
        <div
            onClick={onClick}
            className="p-5 bg-slate-800/40 rounded-2xl border border-white/5 hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all cursor-pointer group"
        >
            <p className={`font-bold ${color} group-hover:translate-x-1 transition-transform inline-block`}>{title}</p>
            <p className="text-xs text-slate-500 mt-1">{desc}</p>
        </div>
    );
}
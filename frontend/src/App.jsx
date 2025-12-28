import { useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { MessageSquare, Shield, Zap, Users, ArrowRight, Github, Twitter, Linkedin, CheckCircle2 } from "lucide-react";

// Page Imports
import Register from "./auth/Register";
import ProfileView from "./profile/ProfileView";
import Login from "./auth/Login";
import ProfileEdit from "./profile/ProfileEdit";
import Dashboard from "./dashboard/dashboard";
import Friends from "./friends/Friends";
import Message from "./chat/Message";

function Landing() {
  const navigate = useNavigate();

  // 🔄 1. AUTO REDIRECT LOGIC
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("userId"); // or 'user' depending on what you save
    
    if (token && user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 selection:bg-indigo-500/30 font-sans">
      
      {/* 2. MODERN BACKGROUND (Gradient + Grid Pattern) */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-[#0f172a] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>
        <div className="absolute right-0 bottom-0 -z-10 h-[310px] w-[310px] rounded-full bg-purple-500 opacity-20 blur-[100px]"></div>
      </div>

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 backdrop-blur-md sticky top-0 z-50 border-b border-white/5 bg-slate-900/50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
            <MessageSquare size={22} className="text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Chat<span className="text-indigo-400">Peer</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/login" className="hidden md:block text-sm font-medium text-slate-300 hover:text-white transition">
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 bg-white text-slate-900 hover:bg-indigo-50 rounded-full text-sm font-bold transition-all shadow-xl shadow-white/5 active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT CONTENT */}
          <div className="text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-8 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              v2.0 is now live for everyone
            </div>

            <h2 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
              Connect globally. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Chat privately.
              </span>
            </h2>

            <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Experience the next evolution of team communication. 
              End-to-end encryption, sub-millisecond latency, and a design you'll actually love using.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="group px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                Start Chatting Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-white/10 rounded-2xl font-bold text-lg text-slate-200 transition-all flex items-center justify-center gap-2">
                View Demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center gap-6 text-sm text-slate-500">
                <span>Trusted by developers at:</span>
                <div className="flex gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-1"><Github size={18}/> GitHub</div>
                    <div className="flex items-center gap-1"><Zap size={18}/> Vercel</div>
                    <div className="flex items-center gap-1"><Shield size={18}/> Auth0</div>
                </div>
            </div>
          </div>

          {/* RIGHT CONTENT - APP MOCKUP */}
          <div className="relative group perspective-1000">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            
            {/* Main Card */}
            <div className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden">
                
                {/* Mock Header */}
                <div className="flex items-center justify-between mb-8 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500" />
                        <div>
                            <div className="h-2.5 w-24 bg-slate-700 rounded-full mb-1.5" />
                            <div className="h-2 w-16 bg-slate-800 rounded-full" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                    </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8">
                    <FeatureItem icon={<Zap className="text-yellow-400" />} title="Instant Sync" desc="Real-time WebSocket engine" />
                    <FeatureItem icon={<Shield className="text-emerald-400" />} title="Secure Vault" desc="AES-256 Encryption standard" />
                    <FeatureItem icon={<Users className="text-blue-400" />} title="Team Channels" desc="Unlimited workspace creation" />
                </div>

                {/* Chat Simulation */}
                <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5 space-y-3">
                    <div className="flex gap-3 animate-pulse">
                        <div className="w-8 h-8 rounded-full bg-slate-700 shrink-0" />
                        <div className="bg-slate-800 rounded-2xl rounded-tl-none p-3 text-sm text-slate-300 w-3/4">
                            Preparing the deployment...
                        </div>
                    </div>
                     <div className="flex gap-3 justify-end">
                        <div className="bg-indigo-600 rounded-2xl rounded-tr-none p-3 text-sm text-white shadow-lg shadow-indigo-500/20">
                            Build success! 🚀 v2.0 is live.
                        </div>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-slate-500 text-sm">
                  © 2024 ChatPeer Inc. All rights reserved.
              </div>
              <div className="flex gap-6">
                  <a href="#" className="text-slate-500 hover:text-indigo-400 transition"><Twitter size={20} /></a>
                  <a href="#" className="text-slate-500 hover:text-indigo-400 transition"><Github size={20} /></a>
                  <a href="#" className="text-slate-500 hover:text-indigo-400 transition"><Linkedin size={20} /></a>
              </div>
          </div>
      </footer>
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default">
      <div className="p-2.5 bg-slate-800 rounded-lg border border-white/5 shadow-sm">{icon}</div>
      <div>
        <h4 className="font-semibold text-white text-sm">{title}</h4>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
      <CheckCircle2 size={16} className="ml-auto text-indigo-500/50" />
    </div>
  );
}

// MAIN APP COMPONENT
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<ProfileView />} />
      <Route path="/profile/edit" element={<ProfileEdit />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="/messages" element={<Message />} />
      <Route path="/profile/:userId" element={<ProfileView />} />
      <Route
        path="*"
        element={<div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white p-10">404 - Page Not Found</div>}
      />
    </Routes>
  );
}
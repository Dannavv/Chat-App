import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google"; // 1. Import GoogleLogin
import axios from "axios"; // 2. Import Axios for the Google request
import { registerUser, loginUser } from "../services/authApi";

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    // 🔐 3. GOOGLE LOGIN HANDLER (Same as Login.jsx)
    const googleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post(
                "http://localhost:8080/auth/google",
                { token: credentialResponse.credential }
            );

            // Save token and user ID
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.userId);
            
            // Optional: If your backend returns a full user object on Google auth, save it too
            if (res.data.user) {
                localStorage.setItem("user", JSON.stringify(res.data.user));
            }

            window.location.href = "/dashboard";
        } catch (err) {
            console.error("Google Auth Error:", err);
            setError("Google signup failed ❌");
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // 🔹 Client-side validation
        if (!form.name || !form.email || !form.password) {
            setError("All fields are required");
            setLoading(false);
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            // 1️⃣ Register user
            await registerUser({
                name: form.name,
                email: form.email,
                password: form.password,
            });

            // 2️⃣ Login user → get JWT
            const loginRes = await loginUser({
                email: form.email,
                password: form.password,
            });

            // 3️⃣ Save JWT
            localStorage.setItem("token", loginRes.data.token);
            if (loginRes.data.user) {
                localStorage.setItem("user", JSON.stringify(loginRes.data.user));
                localStorage.setItem("userId", loginRes.data.user._id || loginRes.data.user.id);
            }

            // 4️⃣ Redirect
            window.location.href = "/dashboard";

        } catch (err) {
            const backendMsg =
                err.response?.data?.message ||
                err.message ||
                "Something went wrong";

            setError(backendMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />

            <div className="w-full max-w-md z-10">
                {/* Brand/Logo Area */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block text-2xl font-bold text-white mb-2">
                        Chat<span className="text-indigo-400">Peer</span>
                    </Link>
                    <p className="text-slate-400">Create your account to start chatting</p>
                </div>

                {/* Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <form onSubmit={submit} className="space-y-5">

                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input
                                    disabled={loading}
                                    required
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    onChange={handleChange}
                                    className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input
                                    disabled={loading}
                                    required
                                    name="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    onChange={handleChange}
                                    className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input
                                    disabled={loading}
                                    required
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                    className="w-full bg-slate-800/50 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                                {error}
                            </div>
                        )}
                    </form>

                    {/* 4. DIVIDER */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-slate-700" />
                        <span className="text-slate-400 text-sm">OR</span>
                        <div className="flex-1 h-px bg-slate-700" />
                    </div>

                    {/* 5. GOOGLE LOGIN BUTTON */}
                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={googleSuccess}
                            onError={() => setError("Google Signup Failed")}
                        />
                    </div>

                    {/* Footer Link */}
                    <p className="text-center text-slate-400 text-sm mt-8">
                        Already have an account?{" "}
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline-offset-4 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
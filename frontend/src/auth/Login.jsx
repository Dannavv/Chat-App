import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { loginUser } from "../services/authApi";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔐 EMAIL + PASSWORD LOGIN
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      window.location.href = "/dashboard";
    } catch {
      alert("Invalid credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 GOOGLE LOGIN
  const googleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/auth/google",
        { token: credentialResponse.credential }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      window.location.href = "/dashboard";
    } catch {
      alert("Google login failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/60 backdrop-blur border border-white/10 p-8 rounded-3xl shadow-xl">

          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Welcome Back
          </h2>

          {/* EMAIL LOGIN */}
          <form onSubmit={submit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                required
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                required
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Sign In <LogIn size={18} />
                </>
              )}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-slate-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {/* GOOGLE LOGIN */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={googleSuccess}
              onError={() => alert("Google login failed")}
            />
          </div>

          {/* FOOTER */}
          <p className="text-center text-slate-400 text-sm mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-400 underline">
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

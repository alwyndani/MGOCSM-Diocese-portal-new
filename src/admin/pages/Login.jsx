import React, { useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/LOGO.png";
import { motion } from "framer-motion";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all credentials.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#090d16] px-6 py-12 overflow-hidden font-sans">
      {/* Background Glow Blobs */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(219,45,11,0.12),transparent_70%)] blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(198,167,94,0.12),transparent_70%)] blur-3xl rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src={logo} alt="MGOCSM Logo" className="w-36 mx-auto hover:scale-105 transition duration-300" />
          </Link>
          <h2 className="text-2xl md:text-3xl font-serif text-white font-medium mt-4 tracking-wide">
            Administrative Access
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            MGOCSM Diocese of Thumpamon CMS Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-200 text-sm p-4 rounded-xl mb-6 flex items-center gap-2"
            >
              <span>⚠️</span>
              <p>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-base placeholder-slate-500 outline-none focus:border-[#C6A75E] focus:ring-1 focus:ring-[#C6A75E] transition duration-300"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-base placeholder-slate-500 outline-none focus:border-[#C6A75E] focus:ring-1 focus:ring-[#C6A75E] transition duration-300"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 mt-2 bg-gradient-to-r from-[#DB2D0B] to-[#ffb6a0] hover:from-[#c2280a] hover:to-[#e6a38f] text-white font-semibold rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                "Log In"
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-slate-500 hover:text-slate-300 text-sm transition">
            ← Back to Public Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

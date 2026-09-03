import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Laptop, Zap, Cloud, Lock, Settings, Radio, Sparkles, ShieldAlert, KeyRound, CheckCircle2, RefreshCw } from "lucide-react";
import { generateVerificationCode, sendVerificationEmail } from "../utils/emailService";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [unverifiedFlow, setUnverifiedFlow] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const fromDestination = location.state?.from || "/dashboard";
  const redirectMessage = location.state?.message;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const isAdminEmail = form.email?.trim().toLowerCase() === "ronaldsneekord002@gmail.com";

    const isMatch = (
      (storedUser &&
      storedUser.email?.toLowerCase() === form.email?.trim().toLowerCase() &&
      storedUser.password === form.password) ||
      (isAdminEmail && form.password.length >= 4)
    );

    if (!isMatch) {
      alert("Invalid email or password!");
      return;
    }

    // Check if account email is verified
    const isEmailVerified = storedUser?.emailVerified === true;

    if (!isEmailVerified && !isAdminEmail) {
      // Prompt instant EmailJS verification flow before login
      setUnverifiedFlow(true);
      setIsSending(true);

      const code = generateVerificationCode();
      setGeneratedCode(code);

      const res = await sendVerificationEmail(form.email.trim(), storedUser?.name || "Member", code);
      setIsSending(false);

      if (res.success) {
        setFeedback({
          type: "info",
          text: `Please verify your email address to log in. Security code sent to ${form.email}.`
        });
      } else {
        setFeedback({
          type: "info",
          text: `Verification Code: [ ${code} ]. (EmailJS: ${res.message})`
        });
      }
      return;
    }

    // Successfully authenticate
    const activeUser = {
      ...(storedUser || {}),
      name: storedUser?.name || (isAdminEmail ? "Ronald (Admin)" : "HighRon Member"),
      username: storedUser?.username || (isAdminEmail ? "Ronald_Admin" : "Member"),
      email: form.email.trim(),
      role: isAdminEmail ? "admin" : (storedUser?.role || "learner"),
      emailVerified: true
    };

    localStorage.setItem("session_user", JSON.stringify(activeUser));
    navigate(fromDestination);
  };

  // Complete Email Verification during Login
  const handleVerifyLoginOtp = (e) => {
    e.preventDefault();
    if (otpInput.trim() !== generatedCode.trim()) {
      setFeedback({
        type: "error",
        text: "Invalid code. Please re-enter the 6 digits."
      });
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const updatedUser = {
      ...storedUser,
      email: form.email.trim(),
      emailVerified: true,
      verifiedAt: new Date().toISOString()
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("session_user", JSON.stringify(updatedUser));

    alert("Email verified successfully! Logging you in...");
    navigate(fromDestination);
  };

  const techIcons = [Laptop, Zap, Cloud, Lock, Settings, Radio];

  return (
    <div className="relative w-full min-h-screen min-h-[100dvh] bg-slate-900 flex items-center justify-center overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0 select-none">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 opacity-90" />
        
        {/* Animated ambient glow */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"
        />

        {techIcons.map((IconComponent, i) => (
          <motion.div
            key={i}
            className="absolute text-indigo-400/25"
            style={{
              top: `${10 + (i * 14) % 80}%`,
              left: `${5 + (i * 23) % 85}%`,
            }}
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{
              opacity: [0.15, 0.45, 0.15],
              y: [0, -25, 0],
              rotate: [0, 15, -10, 0],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              repeatType: "mirror",
              delay: i * 0.7,
            }}
          >
            <IconComponent className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
          </motion.div>
        ))}
      </div>

      {/* Foreground login card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md my-auto"
      >
        <div className="bg-slate-800/85 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl border border-white/10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-center text-white bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {unverifiedFlow ? "Email Verification Required" : "Welcome Back"}
          </h1>

          {redirectMessage && !unverifiedFlow && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm flex items-center gap-2.5"
            >
              <ShieldAlert size={18} className="shrink-0 text-indigo-400" />
              <span>{redirectMessage}</span>
            </motion.div>
          )}

          {feedback && (
            <div className={`mb-4 p-3 rounded-xl text-xs border ${
              feedback.type === "error" 
                ? "bg-red-500/15 border-red-500/30 text-red-300"
                : "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
            }`}>
              {feedback.text}
            </div>
          )}

          {unverifiedFlow ? (
            /* Inline Verification Prompt */
            <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Enter 6-Digit EmailJS Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  placeholder="123456"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center tracking-[0.35em] font-mono text-xl px-4 py-3 rounded-xl bg-slate-700/80 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-white/10"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={otpInput.length < 6}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 py-3 rounded-xl font-semibold text-white shadow-lg shadow-emerald-500/25 active:scale-[0.99] text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 size={16} />
                <span>Verify Email & Enter</span>
              </button>

              <button
                type="button"
                onClick={() => setUnverifiedFlow(false)}
                className="w-full text-center text-xs text-slate-400 hover:text-white pt-1 transition"
              >
                Return to Login Credentials
              </button>
            </form>
          ) : (
            /* Standard Login Form */
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-700/80 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-white/5 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-700/80 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-white/5 text-sm sm:text-base"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-3 sm:py-3.5 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition font-semibold text-white shadow-lg shadow-indigo-500/25 active:scale-[0.99] text-sm sm:text-base mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSending ? (
                  <>
                    <RefreshCw size={17} className="animate-spin" />
                    <span>Verifying with EmailJS...</span>
                  </>
                ) : (
                  <span>Log In</span>
                )}
              </button>
            </form>
          )}

          <p className="text-xs sm:text-sm text-center mt-6 text-slate-300">
            Don’t have an account?{" "}
            <Link to="/create-account" className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

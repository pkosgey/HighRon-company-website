// CreateAccount.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Cloud, Shield, Code, Database, UserPlus, CheckCircle2, AlertCircle, RefreshCw, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { sendRegistrationNotification } from "../utils/emailService";

export default function CreateAccount() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error' | 'info', text: '' }
  const [isRegistered, setIsRegistered] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    const emailTrimmed = form.email.trim();
    const nameTrimmed = form.name.trim();

    const isAdmin = emailTrimmed.toLowerCase() === "ronaldsneekord002@gmail.com";
    const userToSave = {
      name: nameTrimmed,
      email: emailTrimmed,
      password: form.password,
      role: isAdmin ? "admin" : "learner",
      emailVerified: true,
      registeredAt: new Date().toISOString()
    };

    // Save user directly to local storage (no verification barrier)
    localStorage.setItem("user", JSON.stringify(userToSave));

    // Dispatch welcome notification email via EmailJS
    let emailStatusMsg = "";
    try {
      const emailResult = await sendRegistrationNotification(emailTrimmed, nameTrimmed);
      if (emailResult.success) {
        emailStatusMsg = `A welcome confirmation has been sent to ${emailTrimmed}.`;
      } else {
        emailStatusMsg = `Account created. Note: Notification email delivery returned: ${emailResult.message}`;
      }
    } catch (err) {
      console.warn("Notification email error:", err);
      emailStatusMsg = "Account created successfully!";
    }

    setIsSubmitting(false);
    setIsRegistered(true);
    setFeedback({
      type: "success",
      text: `Welcome aboard, ${nameTrimmed}! ${emailStatusMsg}`
    });

    // Automatically navigate to login after 2.5 seconds
    setTimeout(() => {
      navigate("/login", { 
        state: { 
          message: `Registration complete! Please log in with your credentials.` 
        } 
      });
    }, 2500);
  };

  return (
    <div className="relative w-full min-h-screen min-h-[100dvh] flex items-center justify-center overflow-x-hidden overflow-y-auto bg-slate-900 text-white p-4 sm:p-6 lg:p-8">
      {/* Fullscreen Background Gradient */}
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-indigo-600/30 via-slate-800/40 to-pink-600/30 pointer-events-none" />

      {/* Animated Tech Icons */}
      {[Cpu, Cloud, Shield, Code, Database].map((Icon, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none select-none"
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{
            opacity: [0.15, 0.45, 0.15],
            y: [0, -30, 0],
            scale: [0.9, 1.05, 0.9],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: i * 2,
          }}
          style={{
            top: `${15 + i * 16}%`,
            left: `${8 + (i % 3) * 32}%`,
          }}
        >
          <Icon className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-indigo-300/30" />
        </motion.div>
      ))}

      {/* Glowing Orb Effect */}
      <motion.div
        className="fixed w-72 h-72 sm:w-[450px] sm:h-[450px] rounded-full bg-indigo-500/15 blur-3xl pointer-events-none"
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Foreground Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-slate-800/85 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md my-auto border border-white/10"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/20">
            <UserPlus size={22} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Join HighRon Tech. A confirmation email will be sent upon registration.
          </p>
        </div>

        {/* Status Feedback Notice */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-3 rounded-xl text-xs mb-4 flex items-start gap-2 border ${
                feedback.type === "success" 
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                  : feedback.type === "error"
                  ? "bg-red-500/15 border-red-500/30 text-red-300"
                  : "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 size={16} className="shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed break-words">{feedback.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {isRegistered ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Registration Successful!</h2>
              <p className="text-xs text-slate-400 mt-1">
                Redirecting to login page...
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition font-semibold text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>Go to Login Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Alex Morgan"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-700/80 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-white/5 text-sm sm:text-base"
                required
              />
            </div>

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
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-3 sm:py-3.5 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition font-semibold text-white shadow-lg shadow-indigo-500/25 active:scale-[0.99] text-sm sm:text-base mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={17} className="animate-spin" />
                  <span>Registering & Notifying...</span>
                </>
              ) : (
                <span>Register Account</span>
              )}
            </button>
          </form>
        )}

        <p className="text-xs sm:text-sm text-center mt-6 text-slate-300">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

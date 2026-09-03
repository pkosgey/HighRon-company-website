// CreateAccount.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Cloud, Shield, Code, Database, Mail, KeyRound, CheckCircle2, AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { generateVerificationCode, sendVerificationEmail } from "../utils/emailService";

export default function CreateAccount() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [step, setStep] = useState("form"); // "form" | "verify"
  const [otpInput, setOtpInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text: '' }
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Step 1: Initiate verification via EmailJS
  const handleInitiateSignup = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setIsSending(true);

    const code = generateVerificationCode();
    setGeneratedCode(code);

    const result = await sendVerificationEmail(form.email.trim(), form.name.trim(), code);
    setIsSending(false);

    if (result.success) {
      setStep("verify");
      setFeedback({
        type: "success",
        text: `Security code dispatched to ${form.email}. Please check your inbox (and spam folder).`
      });
      // Start 60s resend timer
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // If EmailJS has network or configuration warning, allow proceeding with verification code shown for testing
      setStep("verify");
      setFeedback({
        type: "info",
        text: `Verification Code: [ ${code} ]. (EmailJS message: ${result.message})`
      });
    }
  };

  // Resend OTP Code
  const handleResendCode = async () => {
    if (countdown > 0) return;
    setIsSending(true);
    setFeedback(null);

    const code = generateVerificationCode();
    setGeneratedCode(code);

    const result = await sendVerificationEmail(form.email.trim(), form.name.trim(), code);
    setIsSending(false);

    if (result.success) {
      setFeedback({
        type: "success",
        text: `New verification code dispatched to ${form.email}.`
      });
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setFeedback({
        type: "info",
        text: `New Code: [ ${code} ]. Please enter to complete verification.`
      });
    }
  };

  // Step 2: Confirm OTP & Finalize Account Registration
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setFeedback(null);

    if (otpInput.trim() !== generatedCode.trim()) {
      setFeedback({
        type: "error",
        text: "Invalid verification code. Please check and re-enter the 6 digits."
      });
      return;
    }

    const isAdmin = form.email?.trim().toLowerCase() === "ronaldsneekord002@gmail.com";
    const userToSave = {
      ...form,
      emailVerified: true,
      verifiedAt: new Date().toISOString(),
      role: isAdmin ? "admin" : "learner"
    };

    // Save verified user in localStorage
    localStorage.setItem("user", JSON.stringify(userToSave));

    alert(`Email successfully verified! Welcome ${form.name}, your ${isAdmin ? "Admin " : ""}account is active.`);
    navigate("/login");
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
            {step === "form" ? <Mail size={22} className="text-white" /> : <KeyRound size={22} className="text-white" />}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {step === "form" ? "Create an Account" : "Verify Your Email"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            {step === "form" 
              ? "Join HighRon Tech with instant EmailJS email verification" 
              : `Enter the 6-digit code sent to ${form.email}`}
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

        {step === "form" ? (
          /* Step 1 Form */
          <form onSubmit={handleInitiateSignup} className="space-y-4 sm:space-y-5">
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
              disabled={isSending}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-3 sm:py-3.5 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition font-semibold text-white shadow-lg shadow-indigo-500/25 active:scale-[0.99] text-sm sm:text-base mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSending ? (
                <>
                  <RefreshCw size={17} className="animate-spin" />
                  <span>Dispatching Security Code...</span>
                </>
              ) : (
                <span>Send Verification Code</span>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: Email Verification Code */
          <form onSubmit={handleVerifyOtp} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                6-Digit Security Code
              </label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                placeholder="123456"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                className="w-full text-center tracking-[0.4em] font-mono text-xl sm:text-2xl px-4 py-3 rounded-xl bg-slate-700/80 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-white/10"
                required
              />
            </div>

            <button
              type="submit"
              disabled={otpInput.length < 6}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 py-3 sm:py-3.5 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition font-semibold text-white shadow-lg shadow-emerald-500/25 active:scale-[0.99] text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 size={18} />
              <span>Verify & Complete Registration</span>
            </button>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => {
                  setStep("form");
                  setFeedback(null);
                }}
                className="hover:text-white flex items-center gap-1 transition"
              >
                <ArrowLeft size={13} />
                <span>Change Email</span>
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={countdown > 0 || isSending}
                className="text-indigo-400 hover:text-indigo-300 disabled:text-slate-500 font-medium transition"
              >
                {countdown > 0 ? `Resend code in ${countdown}s` : "Resend Code"}
              </button>
            </div>
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

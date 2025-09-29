// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (
      storedUser &&
      storedUser.email === form.email &&
      storedUser.password === form.password
    ) {
      localStorage.setItem("session_user", JSON.stringify(storedUser));
      alert(`Welcome back, ${storedUser.name}!`);
      navigate("/dashboard");
    } else {
      alert("Invalid email or password!");
    }
  };

  const icons = ["💻", "⚡", "☁️", "🔒", "⚙️", "📡"];

  return (
    <div className="relative w-screen h-screen bg-slate-900 flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 opacity-85" />
        {icons.map((ic, i) => (
          <motion.div
            key={i}
            className="absolute text-white/60"
            style={{
              top: `${10 + (i * 14) % 80}%`,
              left: `${5 + (i * 23) % 85}%`,
            }}
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{
              opacity: [0.25, 0.85, 0.25],
              y: [0, -30, 0],
              rotate: [0, 20, -10, 0],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              repeatType: "mirror",
              delay: i * 0.7,
            }}
          >
            <span className="block text-5xl sm:text-6xl md:text-7xl">{ic}</span>
          </motion.div>
        ))}
      </div>

      {/* Foreground login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-slate-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-6 text-center text-white">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-slate-700 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-slate-700 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-500 py-3 rounded-md hover:bg-indigo-400 transition font-semibold"
            >
              Log In
            </button>
          </form>

          <p className="text-sm text-center mt-4 text-slate-300">
            Don’t have an account?{" "}
            <a href="/create-account" className="text-indigo-400 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

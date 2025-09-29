// CreateAccount.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Cloud, Shield, Code, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateAccount() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // save user data to localStorage
    localStorage.setItem("user", JSON.stringify(form));

    alert(`Welcome ${form.name}, your account has been created!`);
    navigate("/login"); // redirect to login
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden bg-slate-900 text-white">
      {/* 🔹 Fullscreen Background Gradient */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-600/30 via-slate-800/40 to-pink-600/30" />

      {/* 🔹 Animated Tech Icons */}
      {[Cpu, Cloud, Shield, Code, Database].map((Icon, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            y: [0, -40, 0],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: i * 2,
          }}
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + (i % 3) * 30}%`,
          }}
        >
          <Icon size={90} className="text-indigo-300/40" />
        </motion.div>
      ))}

      {/* 🔹 Glowing Orb Effect */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-3xl"
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* 🔹 Foreground Form */}
      <div className="relative z-10 bg-slate-800/80 backdrop-blur-md p-10 rounded-xl shadow-lg w-full max-w-md mx-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Create an Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-slate-700/80 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-slate-700/80 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-slate-700/80 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-500 py-3 rounded-md hover:bg-indigo-400 transition font-semibold"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-8 text-slate-300">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-400 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

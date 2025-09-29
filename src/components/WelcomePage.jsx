// WelcomePage.jsx
import { Link } from "react-router-dom";
import React from "react";
import { motion } from "framer-motion";
import { Laptop, Smartphone, Server, Code, Cpu } from "lucide-react";

const icons = [Laptop, Smartphone, Server, Code, Cpu];

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Animated Banner */}
      <div className="relative w-full h-48 sm:h-56 md:h-64 bg-slate-800 overflow-hidden">
        {icons.map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute text-indigo-400 opacity-80"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * 200,
              scale: 0.8,
            }}
            animate={{
              y: [Math.random() * 200, Math.random() * 200 + 50],
              rotate: [0, 360],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "mirror",
            }}
          >
            <Icon size={40} />
          </motion.div>
        ))}

        {/* Centered Title on Banner */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            HighRon Tech Community 
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-4 sm:px-8 lg:px-16 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Server Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              src="/src/components/HighRon.png"
              alt="HighRon"
              className="w-16 h-16 rounded-full border-2 border-white mx-auto sm:mx-0"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">Our Community</h2>
              <p className="text-slate-400 mt-1">
                Welcome to the Community! 🌐 We are here to learn, share, and grow
                together.
              </p>
            </div>
          </div>

          {/* Two-column Section */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Get Started */}
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Get Started</h3>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mt-2 text-slate-300">
                <span>✅ Follow the rules</span>
                <span>✅ Check announcements</span>
                <span>✅ Join discussions</span>
              </div>
            </div>

            {/* Rules */}
            <div className="bg-slate-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Rules</h3>
              <ul className="list-disc list-inside text-slate-300 mt-2 space-y-1">
                <li>Be respectful</li>
                <li>No spam or ads</li>
                <li>We are here for just purpose</li>
                <li>Keep discussions on topic</li>
                <li>Any Unnecessary Topics can lead removal from the community</li>
              </ul>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-6 flex justify-center lg:justify-start">
            <Link
              to="/create-account"
              className="px-6 py-3 bg-indigo-500 rounded-md text-white font-medium hover:bg-indigo-400 transition"
            >
            Continue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

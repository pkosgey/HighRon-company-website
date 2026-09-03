import { Link } from "react-router-dom";
import React from "react";
import { motion } from "framer-motion";
import { Laptop, Smartphone, Server, Code, Cpu, Rocket, ShieldCheck, CheckCircle, Globe, FileText } from "lucide-react";

const icons = [Laptop, Smartphone, Server, Code, Cpu];

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Animated Banner */}
      <div className="relative w-full h-44 sm:h-56 md:h-64 bg-slate-800/90 overflow-hidden flex items-center justify-center border-b border-white/5">
        {icons.map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute text-indigo-400/40 select-none pointer-events-none"
            initial={{
              left: `${10 + index * 18}%`,
              top: `${15 + (index % 3) * 25}%`,
              scale: 0.8,
            }}
            animate={{
              y: [0, -25, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 10 + index * 2,
              repeat: Infinity,
              repeatType: "mirror",
            }}
          >
            <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
          </motion.div>
        ))}

        {/* Centered Title on Banner */}
        <div className="relative z-10 px-4 text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight">
            HighRon Tech Space 
          </h1>
          <p className="text-xs sm:text-sm text-indigo-300 mt-1 font-medium">Innovation • Learning • Growth</p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="max-w-5xl mx-auto">
          {/* Server Info */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 bg-slate-800/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl"
          >
            <img
              src="/src/components/HighRon.png"
              alt="HighRon"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-indigo-400 shrink-0 object-cover shadow-lg shadow-indigo-500/20"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center justify-center sm:justify-start gap-2">
                <span>Our Community</span>
                <Globe size={18} className="text-indigo-400" />
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-1 leading-relaxed">
                Welcome to the HighRon Community. We are here to learn, collaborate, and innovate
                together. Explore live discussions, discover cutting-edge tech, and build with us.
              </p>
            </div>
          </motion.div>

          {/* Two-column Section */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Get Started */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/80 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10 shadow-lg"
            >
              <h3 className="text-base sm:text-lg font-bold text-indigo-300 flex items-center gap-2">
                <Rocket size={18} className="text-indigo-400" />
                <span>Get Started</span>
              </h3>
              <div className="flex flex-col gap-2.5 mt-4 text-slate-300 text-sm">
                <span className="flex items-center gap-2.5">
                  <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                  <span>Follow community guidelines</span>
                </span>
                <span className="flex items-center gap-2.5">
                  <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                  <span>Review scheduled events and announcements</span>
                </span>
                <span className="flex items-center gap-2.5">
                  <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                  <span>Participate in collaborative discussions</span>
                </span>
                <span className="flex items-center gap-2.5">
                  <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                  <span>Showcase your projects and gather feedback</span>
                </span>
              </div>
            </motion.div>

            {/* Rules */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/80 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/10 shadow-lg"
            >
              <h3 className="text-base sm:text-lg font-bold text-indigo-300 flex items-center gap-2">
                <ShieldCheck size={18} className="text-indigo-400" />
                <span>Community Guidelines</span>
              </h3>
              <ul className="space-y-2 mt-4 text-slate-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></span>
                  <span>Maintain respect and professional courtesy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></span>
                  <span>No spam, commercial promotions, or unsolicited messages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></span>
                  <span>Keep discussions aligned with channel topics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></span>
                  <span>Constructive critiques and open inquiry are encouraged</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></span>
                  <span>Unethical conduct will result in account suspension</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* CTA Button */}
          <div className="mt-8 flex justify-center sm:justify-start">
            <Link
              to="/create-account"
              className="w-full sm:w-auto text-center px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-semibold hover:from-indigo-600 hover:to-purple-700 transition shadow-lg shadow-indigo-500/25"
            >
              Continue to Sign Up →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

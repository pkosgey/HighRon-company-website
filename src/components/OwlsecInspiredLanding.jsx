// OwlsecInspiredLanding.jsx
// Enhanced version with better animations, interactivity, and modern design

import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Users, MessageCircle, ShieldCheck, 
  ArrowRight, Sparkles, Zap, Globe, Award,
  Star, Code, Cpu, Lock, Rocket, ChevronDown,
  Github, Twitter, Linkedin, Youtube, Mail,
  Sun, Moon, LogIn, UserPlus, Bell, BookOpen
} from 'lucide-react';

export default function OwlsecInspiredLanding() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate featured items
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <ShieldCheck size={24} />,
      title: "Security First",
      description: "Enterprise-grade security with end-to-end encryption and 24/7 monitoring."
    },
    {
      icon: <Users size={24} />,
      title: "Active Community",
      description: "Connect with 25k+ tech enthusiasts, experts, and innovators worldwide."
    },
    {
      icon: <MessageCircle size={24} />,
      title: "Real-time Chat",
      description: "Instant messaging with rich media support, threads, and voice channels."
    }
  ];

  const stats = [
    { number: "25K+", label: "Community Members", icon: <Users size={20} /> },
    { number: "200+", label: "Active Channels", icon: <MessageCircle size={20} /> },
    { number: "24/7", label: "Moderation & Support", icon: <ShieldCheck size={20} /> },
    { number: "4.9/5", label: "User Satisfaction", icon: <Star size={20} /> }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "AI Researcher",
      avatar: "SC",
      text: "HighRon has transformed how I collaborate with my team. The real-time features and community support are unmatched.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Full Stack Developer",
      avatar: "MR",
      text: "The learning resources and community engagement here are incredible. I've grown more in 6 months than in 2 years alone.",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Cybersecurity Analyst",
      avatar: "PP",
      text: "The security focus and expert discussions make this the go-to platform for anyone serious about tech.",
      rating: 5
    }
  ];

  // Handler to require login for protected routes
  const handleProtectedNav = (e, destination) => {
    e.preventDefault();
    const sessionUser = localStorage.getItem("session_user");
    if (!sessionUser) {
      navigate("/login", { 
        state: { 
          from: destination, 
          message: `Please log in to access ${destination === '/resources' ? 'Resources' : 'Notifications'}.` 
        } 
      });
    } else {
      navigate(destination);
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100">
      {/* Advanced Interactive Cyber Aurora Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Ambient Pulsing Glow Orbs */}
        <motion.div 
          animate={{
            scale: [1, 1.25, 1],
            x: [0, 40, 0],
            y: [0, -30, 0],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-indigo-600/25 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{
            scale: [1.2, 0.9, 1.2],
            x: [0, -50, 0],
            y: [0, 40, 0],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 -right-32 w-96 h-96 sm:w-[520px] sm:h-[520px] bg-purple-600/20 rounded-full blur-[130px]"
        />
        <motion.div 
          animate={{
            scale: [1, 1.15, 1],
            y: [0, -40, 0],
            opacity: [0.1, 0.22, 0.1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute -bottom-32 left-1/3 w-96 h-96 sm:w-[480px] sm:h-[480px] bg-cyan-600/15 rounded-full blur-[120px]"
        />

        {/* Ambient Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b12_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Dynamic Star particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-300"
            style={{
              width: `${(i % 3) + 1.5}px`,
              height: `${(i % 3) + 1.5}px`,
              left: `${(i * 17 + 5) % 96}%`,
              top: `${(i * 19 + 7) % 94}%`,
            }}
            animate={{
              y: [0, -35, 0],
              opacity: [0.1, 0.7, 0.1],
              scale: [0.8, 1.4, 0.8],
            }}
            transition={{
              duration: 4 + (i % 6),
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i % 5) * 0.7,
            }}
          />
        ))}
      </div>

      {/* Header - Sticky with blur effect */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-2xl border-b border-white/10' : 'bg-slate-900/60 backdrop-blur-md md:bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <motion.div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0 relative overflow-hidden"
              whileHover={{ rotate: 180, scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-lg sm:text-xl font-bold text-white tracking-wider">HT</span>
            </motion.div>
            <div>
              <h1 className="text-base sm:text-lg font-bold leading-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                HighRon Tech
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">Community & Innovation Hub</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium">
            <Link to="/" className="hover:text-indigo-400 transition-colors relative group py-1">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 transition-all group-hover:w-full"></span>
            </Link>
            <a 
              href="/notifications" 
              onClick={(e) => handleProtectedNav(e, "/notifications")}
              className="hover:text-indigo-400 transition-colors relative group py-1 cursor-pointer"
            >
              Notifications
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 transition-all group-hover:w-full"></span>
            </a>
            <a 
              href="/resources" 
              onClick={(e) => handleProtectedNav(e, "/resources")}
              className="hover:text-indigo-400 transition-colors relative group py-1 cursor-pointer"
            >
              Resources
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 transition-all group-hover:w-full"></span>
            </a>
            <Link to="/join-server" className="hover:text-indigo-400 transition-colors relative group py-1">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 transition-all group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link 
              to="/login" 
              className="px-3.5 py-2 text-sm font-medium hover:text-indigo-400 transition-colors flex items-center gap-1.5"
            >
              <LogIn size={16} />
              Sign In
            </Link>
            <Link 
              to="/create-account" 
              className="px-4 py-2 lg:px-5 lg:py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <UserPlus size={16} />
              Join Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2.5 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900/98 backdrop-blur-xl border-t border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1 sm:space-y-2">
                <Link 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2.5 hover:bg-white/10 rounded-lg transition-colors text-slate-200 font-medium"
                >
                  Home
                </Link>
                <a 
                  href="/notifications" 
                  onClick={(e) => handleProtectedNav(e, "/notifications")}
                  className="block px-4 py-2.5 hover:bg-white/10 rounded-lg transition-colors text-slate-200 font-medium cursor-pointer"
                >
                  Notifications
                </a>
                <a 
                  href="/resources" 
                  onClick={(e) => handleProtectedNav(e, "/resources")}
                  className="block px-4 py-2.5 hover:bg-white/10 rounded-lg transition-colors text-slate-200 font-medium cursor-pointer"
                >
                  Resources
                </a>
                <Link 
                  to="/join-server" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2.5 hover:bg-white/10 rounded-lg transition-colors text-slate-200 font-medium"
                >
                  About
                </Link>
                <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5 pb-2">
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full px-4 py-2.5 text-center hover:bg-white/10 rounded-lg transition-colors font-medium border border-white/10"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/create-account" 
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full px-4 py-2.5 text-center bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-semibold shadow-md shadow-indigo-500/20"
                  >
                    Join Now
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 mb-5 sm:mb-6 backdrop-blur-md"
              whileHover={{ scale: 1.03 }}
            >
              <Sparkles size={16} className="text-indigo-400 shrink-0" />
              <span className="text-xs sm:text-sm text-indigo-300 font-medium">Join 25,000+ Innovators Worldwide</span>
            </motion.div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Build the Future with{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                HighRon Tech
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-xl">
              Connect with experts, attend live events, share projects, and improve your skills — 
              all in a friendly, moderated community. Whether you're a beginner or a pro, there's a place for you.
            </p>

            {/* CTA Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
              <Link 
                to="/create-account"
                className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl sm:rounded-full text-sm sm:text-base font-medium hover:shadow-xl hover:shadow-indigo-500/25 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2.5 group"
              >
                <span>Get Started Free</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/join-server"
                className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-full text-sm sm:text-base font-medium hover:bg-white/10 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2.5"
              >
                <Users size={18} />
                <span>Explore Community</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-white/5 hover:border-indigo-500/30 transition-all"
                >
                  <div className="flex items-center justify-center gap-1 text-indigo-400 text-xs sm:text-sm mb-1">
                    {stat.icon}
                  </div>
                  <div className="text-base sm:text-xl font-bold tracking-tight">{stat.number}</div>
                  <div className="text-[11px] sm:text-xs text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Interactive Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full max-w-lg mx-auto lg:max-w-none"
          >
            <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl relative overflow-hidden">
              {/* Glow effect */}
              <div className="absolute -top-20 -right-20 w-48 sm:w-64 h-48 sm:h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              {/* Chat Preview Header */}
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="flex-1 h-8 sm:h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600/60 flex items-center px-3">
                  <span className="text-xs sm:text-sm font-medium text-white/90 truncate"># general-chat</span>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="bg-slate-900/60 rounded-xl p-3 sm:p-4 h-64 sm:h-80 overflow-hidden relative">
                <motion.div 
                  className="space-y-3 sm:space-y-4"
                  animate={{ y: [0, -200, -400, -600, -800] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="flex items-start gap-2.5 sm:gap-3">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        i % 3 === 0 ? 'bg-indigo-500' : i % 3 === 1 ? 'bg-purple-500' : 'bg-pink-500'
                      }`}>
                        {String.fromCharCode(65 + (i % 26))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-semibold truncate">User{i + 1}</div>
                        <div className="text-xs sm:text-sm text-slate-300 break-words">
                          {i % 2 === 0 
                            ? "HighRon is the best platform to learn and grow!" 
                            : "Just joined the community. Excited to collaborate!"}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
                
                {/* Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-14 sm:h-16 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
              </div>

              {/* Online Status */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span>1,247 online now</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MessageCircle size={13} /> 12.4k
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={13} /> 25.6k
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                HighRon
              </span>
              ?
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Everything you need to learn, connect, and innovate in one powerful platform
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 group hover:border-indigo-500/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-indigo-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What Our Community Says
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Hear from real members who are building their future with HighRon Tech
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-indigo-500/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-xs text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed italic">"{testimonial.text}"</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Banner */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 sm:mt-24 rounded-2xl bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 border border-white/10 p-6 sm:p-10 lg:p-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-36 sm:w-48 h-36 sm:h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative text-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Ready to Build the Future?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-6 sm:mb-8">
              Join thousands of innovators already building their careers and projects with HighRon Tech.
              Your journey starts here.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3.5 sm:gap-4 max-w-md mx-auto sm:max-w-none">
              <Link 
                to="/create-account"
                className="px-6 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl sm:rounded-full font-medium hover:shadow-xl hover:shadow-indigo-500/25 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Rocket size={18} />
                <span>Start Building</span>
              </Link>
              <Link 
                to="/join-server"
                className="px-6 py-3.5 sm:px-8 sm:py-4 bg-white/5 border border-white/10 rounded-xl sm:rounded-full font-medium hover:bg-white/10 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Users size={18} />
                <span>Join Community</span>
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="mt-14 sm:mt-16 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 text-left">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold">HT</span>
                </div>
                <div>
                  <h5 className="font-bold text-base">HighRon Tech</h5>
                  <p className="text-xs text-slate-400">Innovation Hub</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 max-w-xs">
                Exploring the world of technology for future generations. Building tomorrow, today.
              </p>
              <div className="flex gap-2.5 mt-4">
                <a href="#" aria-label="GitHub" className="p-2.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <Github size={18} />
                </a>
                <a href="#" aria-label="Twitter" className="p-2.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <Twitter size={18} />
                </a>
                <a href="#" aria-label="LinkedIn" className="p-2.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <Linkedin size={18} />
                </a>
                <a href="#" aria-label="YouTube" className="p-2.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <Youtube size={18} />
                </a>
              </div>
            </div>

            <div>
              <h6 className="font-semibold text-sm mb-3 text-white">Community</h6>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/" className="hover:text-indigo-400 transition-colors">Discord</Link></li>
                <li><Link to="/" className="hover:text-indigo-400 transition-colors">Events</Link></li>
                <li><Link to="/" className="hover:text-indigo-400 transition-colors">Help Center</Link></li>
                <li><Link to="/" className="hover:text-indigo-400 transition-colors">Guidelines</Link></li>
              </ul>
            </div>

            <div>
              <h6 className="font-semibold text-sm mb-3 text-white">Resources</h6>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/resources" className="hover:text-indigo-400 transition-colors">Learning Hub</Link></li>
                <li><Link to="/resources" className="hover:text-indigo-400 transition-colors">Tools</Link></li>
                <li><Link to="/resources" className="hover:text-indigo-400 transition-colors">Research</Link></li>
                <li><Link to="/resources" className="hover:text-indigo-400 transition-colors">Security</Link></li>
              </ul>
            </div>

            <div>
              <h6 className="font-semibold text-sm mb-3 text-white">Company</h6>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/join-server" className="hover:text-indigo-400 transition-colors">About</Link></li>
                <li><Link to="/" className="hover:text-indigo-400 transition-colors">Careers</Link></li>
                <li><Link to="/" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
                <li><Link to="/" className="hover:text-indigo-400 transition-colors">Blog</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-3">
            <span>© {new Date().getFullYear()} HighRon Tech. All rights reserved.</span>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link>
              <Link to="/" className="hover:text-indigo-400 transition-colors">Terms of Service</Link>
              <Link to="/" className="hover:text-indigo-400 transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
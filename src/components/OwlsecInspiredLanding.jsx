// Owlsec-inspired_website.jsx
// Single-file React component (default export) — Tailwind CSS utility classes
// Notes: This is an *inspired* design, not an exact copy of any existing site or branding.
// Replace placeholder images, icons, and text with your own assets.

import { Link } from "react-router-dom";
import React from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Users, MessageCircle, ShieldCheck } from 'lucide-react';

export default function OwlsecInspiredLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center ring-1 ring-white/6">
            {/* Placeholder logo */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L15 9L21 10L16 14L17 21L12 18L7 21L8 14L3 10L9 9L12 3Z" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">HighRon Tech<span className="text-indigo-400">-Community</span></h1>
            <p className="text-xs text-slate-400 -mt-1">Community & Security • Modern Chat • Events</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="hover:text-white/90">Play Game</Link>
          <Link to="/notifications" className="hover:text-white/90">Notifications</Link>
          <Link to="/join-server" className="hover:text-white/90">About Us</Link>
          <Link to="/resources" className="hover:text-white/90">Resources</Link>
          <Link to="/welcome" className="ml-2 px-4 py-2 bg-indigo-500/90 rounded-md text-white text-sm hover:bg-indigo-400/90">
          Join Server
          </Link>
        </nav>

        <div className="md:hidden">
          <button aria-label="menu" className="p-2 bg-white/6 rounded-md">
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <section>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Join a thriving community for security, learning, and collaboration.
            </motion.h2>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-6 text-slate-300 max-w-xl">
              Connect with experts, attend live events, share projects, and improve your security skills — all in a friendly, moderated community. Whether you're a beginner or a pro, there's a channel for you.
            </motion.p>

            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md text-xs text-slate-400">
              <div className="border border-white/6 rounded-lg p-3">
                <div className="flex items-center gap-2"><Users size={14} /><span className="font-semibold text-slate-100">25k+</span></div>
                <div className="mt-1">Members</div>
              </div>
              <div className="border border-white/6 rounded-lg p-3">
                <div className="flex items-center gap-2"><MessageCircle size={14} /><span className="font-semibold text-slate-100">200+</span></div>
                <div className="mt-1">Live Channels</div>
              </div>
              <div className="border border-white/6 rounded-lg p-3">
                <div className="flex items-center gap-2"><ShieldCheck size={14} /><span className="font-semibold text-slate-100">24/7</span></div>
                <div className="mt-1">Moderation</div>
              </div>
            </div>
          </section>

          {/* Right: mock server preview */}
          <aside>
            <div className="bg-white/3 rounded-2xl p-4 shadow-lg ring-1 ring-white/6">
              <div className="flex gap-3 items-center mb-4">
                <div className="w-2/3 h-8 rounded bg-gradient-to-r from-indigo-600 to-pink-600/60"></div>
                <div className="flex-1 h-8 rounded bg-white/4"></div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <ul className="space-y-2">
                    {[<a href="/welcome">welcome</a>,<a href="/notifications">Announcements</a>,<a href="/join-server">About Us</a>,<a href="">Play Game</a>].map((c)=> (
                      <li key={c} className="text-sm p-2 rounded-md hover:bg-white/4">{c}</li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-3 bg-white/3 rounded-lg p-3 relative overflow-hidden">
                <div className="space-y-3 h-64 overflow-hidden relative">
                  {/* Animated scrolling container */}
                  <div 
                    className="flex flex-col"
                    style={{
                      animation: 'verticalScroll 20s linear infinite'
                    }}
                  >
                    {[...Array(38)].map((_, i) => (
                      <div key={i} className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-semibold">Member{String((i % 9) + 1)}</div>
                          <div className="text-xs text-slate-300">HighRon is the best platform to learn, you are really welcomed.</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Gradient overlay to smooth edges */}
              
                </div>

                {/* Add CSS styles inline or in your CSS file */}
                <style>
                  {`
                    @keyframes verticalScroll {
                      0% {
                        transform: translateY(0);
                      }
                      100% {
                        transform: translateY(-50%);
                      }
                    }
                  `}
                </style>
              </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Features */}
        <section className="mt-16">
          <h3 className="text-2xl font-bold">Features</h3>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard title="Channels & Topics" desc="Organize conversations with topic-based channels for focused discussion." icon={<MessageCircle size={20} />} />
            <FeatureCard title="Events & Workshops" desc="Host meetups, live coding sessions and capture participants" icon={<Users size={20} />} />
            <FeatureCard title="Moderation Tools" desc="Automated moderation, role assignment, and safety rules to keep community healthy." icon={<ShieldCheck size={20} />} />
          </div>
        </section>

        {/* CTA Banner */}
        <section className="mt-14 rounded-xl bg-gradient-to-r from-indigo-700/20 to-pink-700/10 p-6 flex items-center justify-between">
          <div>
            <h4 className="text-xl font-semibold">Ready to join?</h4>
            <p className="text-slate-300 mt-1">Create an account and jump into channels that match your interests.</p>
          </div>
          <div>
            <Link to="/create-account" className="px-6 py-3 bg-indigo-500 rounded-md text-white font-medium hover:bg-indigo-400 transition">Start</Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/6 pt-8 pb-12 text-sm text-slate-400">
          <div className="flex flex-col md:flex-row md:justify-between gap-6">
            <div>
              <h5 className="font-semibold text-slate-100">HighRon Tech community</h5>
              <p className="max-w-sm mt-2">Exploring the world of technology for future technology for future generation</p>
              
            <img
              src="/src/components/HighRon.png"
              alt="HighRon"
              className="w-14 h-14 rounded-full border-2 border-white mx-auto sm:mx-0"></img>
            </div>

            
            <div className="flex gap-6">
              <div>
                <h6 className="font-semibold text-slate-100">Community</h6>
                <ul className="mt-2 space-y-1">
                  <li>Discord</li>
                  <li>Events</li>
                  <li>Help</li>
                </ul>
              </div>
              <div>
                <h6 className="font-semibold text-slate-100">Company</h6>
                <ul className="mt-2 space-y-1">
                  <li>About</li>
                  <li>Careers</li>
                  <li>Contact</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 text-xs text-slate-500">© {new Date().getFullYear()} HighRon Tech community. All rights reserved.</div>
        </footer>
      </main>
    </div>
  );
}

function FeatureCard({title, desc, icon}){
  return (
    <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:0.25}} className="bg-white/3 p-4 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-white/6 flex items-center justify-center">{icon}</div>
        <div>
          <div className="font-semibold text-slate-100">{title}</div>
          <div className="text-slate-300 text-sm mt-1">{desc}</div>
        </div>
      </div>
    </motion.div>
  );
}

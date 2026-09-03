import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Laptop, Lock, Globe, Zap, Wrench, BarChart3, 
  Cpu, Lightbulb, Smartphone, CheckCircle, BookOpen, 
  FlaskConical, Briefcase, Sparkles 
} from "lucide-react";

export default function JoinServer() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const techIcons = [Laptop, Lock, Globe, Zap, Wrench, BarChart3, Cpu, Lightbulb, Smartphone];

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }

    const canvas = document.getElementById("techBackground");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 3 + 1;
        this.dx = (Math.random() - 0.5) * 1.5;
        this.dy = (Math.random() - 0.5) * 1.5;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#6366f1";
        ctx.fill();
      }
      update() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.dy *= -1;
        this.draw();
      }
    }

    const init = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => p.update());
      requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => init();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-slate-900 overflow-x-hidden">
      {/* Fixed Background Elements */}
      <canvas
        id="techBackground"
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ display: 'block' }}
      />

      <div className="fixed inset-0 pointer-events-none z-0 select-none">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-slate-900/90 to-purple-950/90" />
        {techIcons.map((IconComp, i) => (
          <motion.div
            key={i}
            className="absolute text-indigo-400/20"
            style={{
              top: `${10 + (i * 14) % 80}%`,
              left: `${5 + (i * 23) % 85}%`,
            }}
            initial={{ opacity: 0, y: 20, scale: 0.85 }}
            animate={{
              opacity: [0.1, 0.35, 0.1],
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
            <IconComp className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" />
          </motion.div>
        ))}
      </div>

      {/* Scrollable Content Area */}
      <div className="relative z-10 w-full min-h-screen">
        <div className="flex items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div 
            className="text-center w-full max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold mb-6 text-white drop-shadow-lg tracking-tight">
              Welcome to HighRon Tech, {user?.username || "Innovator"}
            </h1>
            
            {/* Company Introduction */}
            <motion.div 
              className="bg-slate-800/80 backdrop-blur-md shadow-2xl rounded-2xl p-5 sm:p-8 mx-auto mb-6 sm:mb-8 border border-white/10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center text-indigo-400 flex items-center justify-center gap-2">
                <Sparkles size={22} />
                <span>Pioneering the Future of Technology</span>
              </h2>
              <div className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed space-y-3 sm:space-y-4 text-left sm:text-center">
                <p>
                  At <strong className="text-white">HighRon Tech</strong>, we're not just building technology – we're shaping the future for generations to come. 
                  As innovators at the forefront of digital transformation, we explore uncharted territories in artificial intelligence, 
                  quantum computing, sustainable tech, and immersive digital experiences.
                </p>
                
                <p>
                  Our mission is to bridge the gap between today's possibilities and tomorrow's realities. We believe in creating 
                  technology that empowers humanity, solves complex global challenges, and opens doors to opportunities we've yet to imagine.
                </p>

                <p>
                  Join us as we push the boundaries of what's possible, crafting solutions that will define the next era of human progress 
                  and leave a lasting impact on our world.
                </p>
              </div>
            </motion.div>

            {/* Benefits Section */}
            <motion.div 
              className="bg-slate-800/80 backdrop-blur-md shadow-2xl rounded-2xl p-5 sm:p-8 mx-auto mb-6 sm:mb-8 border border-white/10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center text-white">
                Your Journey Begins Here 
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 text-left">
                <div className="bg-slate-900/50 p-4 sm:p-5 rounded-xl border border-white/5">
                  <h3 className="text-base sm:text-lg font-semibold text-indigo-300 mb-3 sm:mb-4 flex items-center gap-2">
                    <Globe size={18} className="text-indigo-400" />
                    <span>Community Benefits</span>
                  </h3>
                  <ul className="space-y-2.5 text-sm sm:text-base text-slate-200">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                      <span>Access exclusive community channels</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                      <span>Join discussions with industry experts</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                      <span>Participate in live tech events</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                      <span>Get personalized mentorship</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-slate-900/50 p-4 sm:p-5 rounded-xl border border-white/5">
                  <h3 className="text-base sm:text-lg font-semibold text-indigo-300 mb-3 sm:mb-4 flex items-center gap-2">
                    <BookOpen size={18} className="text-indigo-400" />
                    <span>Learning Opportunities</span>
                  </h3>
                  <ul className="space-y-2.5 text-sm sm:text-base text-slate-200">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle size={16} className="text-indigo-400 shrink-0" />
                      <span>Cutting-edge tech resources</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle size={16} className="text-indigo-400 shrink-0" />
                      <span>Research collaboration projects</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle size={16} className="text-indigo-400 shrink-0" />
                      <span>Career development programs</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle size={16} className="text-indigo-400 shrink-0" />
                      <span>Global networking opportunities</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 mt-2">
                <motion.button
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 sm:py-3.5 px-6 rounded-xl transition duration-200 text-sm sm:text-base shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/resources')}
                >
                  <BookOpen size={16} />
                  <span>Explore Resources</span>
                </motion.button>

                <motion.button
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 sm:py-3.5 px-7 rounded-xl transition duration-200 text-sm sm:text-base shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/login')}
                >
                  <span>Enter Innovation Dashboard →</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Additional Content to Ensure Scrollability */}
            <motion.div 
              className="bg-slate-800/60 backdrop-blur-md shadow-xl rounded-2xl p-5 sm:p-6 mx-auto border border-white/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-base sm:text-xl font-bold mb-2 text-indigo-300">
                Ready to Make an Impact?
              </h3>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                Your journey with HighRon Tech starts now. Together, we'll explore the frontiers of technology 
                and create solutions that matter.
              </p>
            </motion.div>

            {/* Vision Statement at Bottom */}
            <motion.div 
              className="mt-8 text-slate-300 text-sm sm:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className="italic">
                "HighRon Tech: Where today's dreams become tomorrow's reality. 
                We're not just following trends – we're creating the future."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
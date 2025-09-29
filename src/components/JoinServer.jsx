import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function JoinServer() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const icons = ["⏳", "💻", "🔒", "🌐", "⚡", "🔧", "📊", "🤖", "💡", "📱"];

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
        ctx.fillStyle = "#4f46e5";
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
    <div className="relative w-screen min-h-screen bg-slate-900 overflow-hidden">
      {/* Fixed Background Elements */}
      <canvas
        id="techBackground"
        className="fixed inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

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

      {/* Scrollable Content Area */}
      <div className="relative z-10 w-full min-h-screen">
        <div className="flex items-center justify-center w-full px-4 py-8">
          <motion.div 
            className="text-center w-full max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 text-white drop-shadow-lg">
              Welcome to HighRon Tech, {user?.username || "Guest"}! 
            </h1>
            
            {/* Company Introduction */}
            <motion.div 
              className="bg-slate-800 bg-opacity-70 backdrop-blur-md shadow-2xl rounded-2xl p-6 sm:p-8 mx-auto mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-indigo-400">
                Pioneering the Future of Technology 🌟
              </h2>
              <div className="text-base sm:text-lg text-slate-200 leading-relaxed space-y-4">
                <p>
                  At <strong>HighRon Tech</strong>, we're not just building technology – we're shaping the future for generations to come. 
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
              className="bg-slate-800 bg-opacity-70 backdrop-blur-md shadow-2xl rounded-2xl p-6 sm:p-8 mx-auto mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center text-white">
                Your Journey Begins Here 
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-indigo-300 mb-4">Community Benefits</h3>
                  <ul className="space-y-3 text-base text-slate-200">
                    <li className="flex items-center">
                      <span className="text-green-400 mr-3">✅</span>
                      Access exclusive community channels
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-400 mr-3">✅</span>
                      Join discussions with industry experts
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-400 mr-3">✅</span>
                      Participate in live tech events
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-400 mr-3">✅</span>
                      Get personalized mentorship
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-indigo-300 mb-4">Learning Opportunities</h3>
                  <ul className="space-y-3 text-base text-slate-200">
                    <li className="flex items-center">
                      <span className="text-blue-400 mr-3">📚</span>
                      Cutting-edge tech resources
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-400 mr-3">🔬</span>
                      Research collaboration projects
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-400 mr-3">💼</span>
                      Career development programs
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-400 mr-3">🌍</span>
                      Global networking opportunities
                    </li>
                  </ul>
                </div>
              </div>

              <motion.button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 mt-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/resources')}
>
                📚 Explore Resources
              </motion.button>

              <motion.button
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
              >
                Enter the Innovation Dashboard →
              </motion.button>
            </motion.div>

            {/* Additional Content to Ensure Scrollability */}
            <motion.div 
              className="bg-slate-800 bg-opacity-50 backdrop-blur-md shadow-xl rounded-2xl p-6 mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-center text-indigo-300">
                Ready to Make an Impact?
              </h3>
              <p className="text-slate-200 text-base mb-4">
                Your journey with HighRon Tech starts now. Together, we'll explore the frontiers of technology 
                and create solutions that matter.
              </p>
              <p className="text-slate-200 text-base">
                Scroll down to see more exciting features and opportunities waiting for you!
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
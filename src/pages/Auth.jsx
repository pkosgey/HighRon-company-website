// src/pages/Auth.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return alert("Please enter an email");
    // Simple mock auth — store user
    const user = { name: name || email.split("@")[0], email };
    localStorage.setItem("owlsec_user", JSON.stringify(user));
    nav("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white/5 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">
          {isLogin ? "Welcome back" : "Create an account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 rounded bg-white/6 p-2"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 rounded bg-white/6 p-2"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 rounded bg-white/6 p-2"
              placeholder="password"
            />
          </div>

          <div className="flex items-center justify-between">
            <button type="submit" className="px-4 py-2 bg-indigo-500 rounded">
              {isLogin ? "Log in" : "Sign up"}
            </button>

            <button
              type="button"
              className="text-sm underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { username, avatar },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

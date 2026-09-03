import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { 
  Users, 
  MessageCircle, 
  Plus, 
  LogOut, 
  BarChart3, 
  Activity, 
  Trash2, 
  Bell,
  BellOff,
  X,
  Send,
  Download,
  Search,
  CheckCheck,
  Hash,
  Shield,
  Sparkles,
  Smile,
  Paperclip
} from "lucide-react";

// Default channels
const DEFAULT_CHANNELS = ["general", "tech", "security", "random"];

// Helper to get persistent chat messages
const getStoredMessages = () => {
  try {
    const data = localStorage.getItem("highron_chat_messages");
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse stored chat messages:", e);
  }
  return [
    {
      id: "msg-1",
      user: "HighRon Bot",
      avatar: "https://ui-avatars.com/api/?name=HighRon+Bot&background=6366f1&color=fff",
      channel: "general",
      text: "Welcome to HighRon Real-Time Chat! Messages persist across user sessions and synchronize live across tabs.",
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: "msg-2",
      user: "Alex Rivera",
      avatar: "https://ui-avatars.com/api/?name=Alex+Rivera&background=8b5cf6&color=fff",
      channel: "general",
      text: "Hey everyone! Checking out the new modernized chat dashboard. Looks super clean!",
      timestamp: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: "msg-3",
      user: "Elena Rostova",
      avatar: "https://ui-avatars.com/api/?name=Elena+Rostova&background=ec4899&color=fff",
      channel: "tech",
      text: "Anyone experimenting with the latest quantum algorithms? Let's discuss research papers here.",
      timestamp: new Date(Date.now() - 900000).toISOString()
    }
  ];
};

// Helper to get persistent channels
const getStoredChannels = () => {
  try {
    const data = localStorage.getItem("highron_channels");
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse stored channels:", e);
  }
  return DEFAULT_CHANNELS;
};

export default function Dashboard() {
  const sessionUser = JSON.parse(localStorage.getItem("session_user"));
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const user = sessionUser || storedUser || { username: "Innovator", email: "user@highron.tech" };
  const token = localStorage.getItem("token");

  const [channels, setChannels] = useState(getStoredChannels);
  const [activeChannel, setActiveChannel] = useState("general");
  const [messages, setMessages] = useState(getStoredMessages);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [notifications, setNotifications] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(3);
  const [searchFilter, setSearchFilter] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const canvasRef = useRef(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const broadcastChannelRef = useRef(null);

  // Initialize BroadcastChannel for cross-tab real-time sync
  useEffect(() => {
    try {
      broadcastChannelRef.current = new BroadcastChannel("highron_chat_channel");
      broadcastChannelRef.current.onmessage = (event) => {
        if (event.data?.type === "NEW_MESSAGE") {
          const msg = event.data.payload;
          setMessages(prev => {
            if (prev.some(m => m.id === msg.id)) return prev;
            const updated = [...prev, msg];
            localStorage.setItem("highron_chat_messages", JSON.stringify(updated));
            return updated;
          });
          if (msg.channel !== activeChannel || activeTab !== "chat") {
            createNotification(msg);
          }
        } else if (event.data?.type === "NEW_CHANNEL") {
          const newChan = event.data.payload;
          setChannels(prev => {
            if (prev.includes(newChan)) return prev;
            const updated = [...prev, newChan];
            localStorage.setItem("highron_channels", JSON.stringify(updated));
            return updated;
          });
        }
      };
    } catch (e) {
      console.warn("BroadcastChannel not supported:", e);
    }

    return () => {
      broadcastChannelRef.current?.close();
    };
  }, [activeChannel, activeTab]);

  // Listen to window storage events (cross-tab sync fallback)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "highron_chat_messages" && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          setMessages(updated);
        } catch (err) {
          console.error("Storage sync error:", err);
        }
      } else if (e.key === "highron_channels" && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          setChannels(updated);
        } catch (err) {
          console.error("Channel sync error:", err);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Initialize Socket.IO connection if available
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:3001";
    try {
      socketRef.current = io(backendUrl, {
        auth: { token: token || "guest-token" },
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 2,
        timeout: 2000
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to HighRon live chat socket");
      });

      socketRef.current.on("message", (msg) => {
        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          const updated = [...prev, msg];
          localStorage.setItem("highron_chat_messages", JSON.stringify(updated));
          return updated;
        });
        
        if (msg.channel !== activeChannel || activeTab !== "chat") {
          createNotification(msg);
        }
      });
    } catch (e) {
      console.warn("Live socket error:", e);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [token, activeChannel, activeTab]);

  // Load channels & messages from backend if token exists
  useEffect(() => {
    const fetchRemoteData = async () => {
      if (!token) return;
      try {
        const chanRes = await fetch(`${API_URL}/channels`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (chanRes.ok) {
          const data = await chanRes.json();
          const channelNames = data.map(ch => ch.name || ch);
          if (channelNames.length > 0) {
            setChannels(prev => {
              const combined = Array.from(new Set([...prev, ...channelNames]));
              localStorage.setItem("highron_channels", JSON.stringify(combined));
              return combined;
            });
          }
        }
      } catch (err) {
        console.warn("Backend channels unavailable, using cached channels:", err);
      }

      try {
        const msgRes = await fetch(`${API_URL}/messages/${activeChannel}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (msgRes.ok) {
          const data = await msgRes.json();
          if (Array.isArray(data) && data.length > 0) {
            setMessages(prev => {
              const otherChannels = prev.filter(m => m.channel !== activeChannel);
              const combined = [...otherChannels, ...data];
              localStorage.setItem("highron_chat_messages", JSON.stringify(combined));
              return combined;
            });
          }
        }
      } catch (err) {
        console.warn("Backend messages unavailable, using cached messages:", err);
      }
    };

    fetchRemoteData();
  }, [activeChannel, token]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Draw dashboard when active tab changes and on window resize
  useEffect(() => {
    if (activeTab === "dashboard" && canvasRef.current) {
      drawDashboard();
    }
    const handleResize = () => {
      if (activeTab === "dashboard" && canvasRef.current) {
        drawDashboard();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab, messages, notifications]);

  // Notification functions
  const createNotification = (message) => {
    if (!notificationsEnabled) return;

    const notification = {
      id: Date.now() + Math.random(),
      type: 'new_message',
      channel: message.channel,
      user: message.user,
      preview: message.text.length > 50 ? message.text.substring(0, 50) + '...' : message.text,
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [notification, ...prev.slice(0, 49)]);

    // Update unread counts
    setUnreadCounts(prev => ({
      ...prev,
      [message.channel]: (prev[message.channel] || 0) + 1
    }));

    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`New message in #${message.channel}`, {
        body: `${message.user}: ${notification.preview}`,
        icon: '/favicon.ico',
        tag: 'chat-notification'
      });
    }
  };

  const markChannelAsRead = (channel) => {
    setUnreadCounts(prev => ({
      ...prev,
      [channel]: 0
    }));

    setNotifications(prev => 
      prev.map(notification => 
        notification.channel === channel 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCounts({});
  };

  const toggleNotifications = () => {
    if (!notificationsEnabled && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setNotificationsEnabled(true);
        }
      });
    } else {
      setNotificationsEnabled(!notificationsEnabled);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

    const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const senderName = user?.username || user?.name || "Innovator";
      const messageData = {
        user: senderName,
        channel: activeChannel,
        text: newMessage.trim(),
        timestamp: new Date().toISOString(),
        id: "msg-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
        avatar: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(senderName)}&background=6366f1&color=fff`
      };

      // Add message immediately to state and localStorage so it NEVER disappears on logout
      setMessages(prev => {
        const updated = [...prev, messageData];
        localStorage.setItem("highron_chat_messages", JSON.stringify(updated));
        return updated;
      });

      // Synchronize across open browser tabs via BroadcastChannel
      if (broadcastChannelRef.current) {
        try {
          broadcastChannelRef.current.postMessage({
            type: "NEW_MESSAGE",
            payload: messageData
          });
        } catch (err) {
          console.warn("BroadcastChannel error:", err);
        }
      }
      
      // Send via socket if connected
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("chatMessage", messageData);
      }
      
      setNewMessage("");
    }
  };

  const addChannel = async () => {
    const rawName = prompt("Enter new channel name:");
    if (!rawName) return;
    const cleanName = rawName.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
    
    if (cleanName && !channels.includes(cleanName)) {
      // Add immediately to state and persistent storage
      const updatedChannels = [...channels, cleanName];
      setChannels(updatedChannels);
      localStorage.setItem("highron_channels", JSON.stringify(updatedChannels));

      // Broadcast to other tabs
      if (broadcastChannelRef.current) {
        try {
          broadcastChannelRef.current.postMessage({
            type: "NEW_CHANNEL",
            payload: cleanName
          });
        } catch (e) {
          console.warn("Channel broadcast error:", e);
        }
      }

      // Sync with backend if logged in
      if (token) {
        try {
          await fetch(`${API_URL}/channels`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: cleanName })
          });
        } catch (error) {
          console.warn('Backend channel sync offline:', error);
        }
      }
      setActiveChannel(cleanName);
    } else if (channels.includes(cleanName)) {
      alert("Channel name already exists!");
    }
  };

  const clearChannelHistory = () => {
    if (window.confirm(`Are you sure you want to clear messages in #${activeChannel}?`)) {
      setMessages(prev => {
        const remaining = prev.filter(m => m.channel !== activeChannel);
        localStorage.setItem("highron_chat_messages", JSON.stringify(remaining));
        return remaining;
      });
    }
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ userId: user?.id })
        });
      }
    } catch (error) {
      console.warn('Logout server notification error:', error);
    } finally {
      // NOTE: We only clear the active session, NOT highron_chat_messages or highron_channels!
      localStorage.removeItem("session_user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  const drawDashboard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw header bar
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#4f46e5');
    gradient.addColorStop(1, '#9333ea');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, 4);
    
    // Header label
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('HighRon Network Analytics', 24, 32);
    
    ctx.fillStyle = '#64748b';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Live Message Volume • 7-Day History', 24, 52);
    
    // Activity Chart Area
    const chartX = 24;
    const chartY = 75;
    const chartW = canvas.width - 48;
    const chartH = Math.max(canvas.height - 120, 100);
    
    // Background card for chart
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(chartX, chartY, chartW, chartH, 12);
    ctx.fill();
    ctx.stroke();
    
    // Calculate last 7 days message activity
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    const dailyCounts = last7Days.map(date => 
      messages.filter(msg => msg.timestamp && msg.timestamp.startsWith(date)).length
    );
    
    const maxCount = Math.max(...dailyCounts, 5);
    const innerPadding = 30;
    const availableW = chartW - innerPadding * 2;
    const availableH = chartH - 60;
    const barWidth = Math.min(availableW / dailyCounts.length - 12, 40);
    
    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    for (let g = 0; g <= 4; g++) {
      const gy = chartY + 20 + (availableH / 4) * g;
      ctx.beginPath();
      ctx.moveTo(chartX + 20, gy);
      ctx.lineTo(chartX + chartW - 20, gy);
      ctx.stroke();
    }
    
    // Draw bars
    for (let i = 0; i < dailyCounts.length; i++) {
      const count = dailyCounts[i];
      const barHeight = Math.max((count / maxCount) * (availableH - 20), 6);
      const bx = chartX + innerPadding + i * (availableW / dailyCounts.length) + ((availableW / dailyCounts.length - barWidth) / 2);
      const by = chartY + availableH + 10 - barHeight;
      
      // Bar gradient
      const barGrad = ctx.createLinearGradient(0, by, 0, by + barHeight);
      barGrad.addColorStop(0, '#818cf8');
      barGrad.addColorStop(1, '#4f46e5');
      
      ctx.fillStyle = barGrad;
      ctx.beginPath();
      ctx.roundRect(bx, by, barWidth, barHeight, [6, 6, 2, 2]);
      ctx.fill();
      
      // Value above bar
      if (count > 0) {
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(count.toString(), bx + barWidth / 2, by - 6);
      }
      
      // Day label
      const d = new Date(last7Days[i]);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(dayName, bx + barWidth / 2, chartY + availableH + 30);
    }
    ctx.textAlign = 'left'; // reset text align
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatNotificationTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-screen h-[100dvh] w-full bg-slate-900 text-white overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 md:w-72 bg-slate-900/95 md:bg-slate-900 backdrop-blur-xl p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-white/10 ${
        isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent leading-none">
                  HighRon
                </h1>
                <p className="text-[10px] text-slate-400 tracking-wider uppercase mt-1">Live Hub</p>
              </div>
            </div>
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex mb-4 bg-slate-800/80 rounded-xl p-1 border border-white/5 shrink-0">
            <button
              onClick={() => {
                setActiveTab("chat");
                setIsMobileSidebarOpen(false);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition text-center flex items-center justify-center gap-1.5 ${
                activeTab === "chat" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
              }`}
            >
              <MessageCircle size={15} />
              <span>Channels</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setIsMobileSidebarOpen(false);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition text-center flex items-center justify-center gap-1.5 ${
                activeTab === "dashboard" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
              }`}
            >
              <BarChart3 size={15} />
              <span>Metrics</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative mb-3 shrink-0">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search channels..."
              className="w-full bg-slate-800/60 border border-white/5 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {searchFilter && (
              <button 
                onClick={() => setSearchFilter("")} 
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs"
              >
                ×
              </button>
            )}
          </div>
          
          {/* Notification Quick Toggle */}
          <div className="flex items-center justify-between mb-3 px-3 py-2 bg-slate-800/40 rounded-xl border border-white/5 shrink-0">
            <span className="text-xs text-slate-300 flex items-center gap-1.5">
              <Bell size={13} className="text-indigo-400" /> Notifications
            </span>
            <button
              onClick={toggleNotifications}
              className={`p-1 rounded-full transition ${
                notificationsEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'
              }`}
              title={notificationsEnabled ? "Notifications On" : "Notifications Off"}
            >
              {notificationsEnabled ? <Bell size={13} /> : <BellOff size={13} />}
            </button>
          </div>
          
          {/* Channels Header */}
          <div className="flex items-center justify-between mb-2 px-1 shrink-0">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Hash size={13} className="text-indigo-400" /> Channels ({channels.length})
            </h2>
            <button
              onClick={clearChannelHistory}
              className="text-slate-400 hover:text-red-400 p-1 rounded transition"
              title={`Clear #${activeChannel} messages`}
            >
              <Trash2 size={13} />
            </button>
          </div>

          {/* Channels List */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {channels
              .filter(ch => ch.toLowerCase().includes(searchFilter.toLowerCase()))
              .map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveChannel(ch);
                    if (activeTab === "chat") {
                      markChannelAsRead(ch);
                    }
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full group px-3 py-2.5 rounded-xl flex items-center justify-between text-xs font-medium transition text-left ${
                    activeChannel === ch 
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30" 
                      : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={activeChannel === ch ? "text-indigo-200" : "text-slate-500 group-hover:text-indigo-400"}>#</span>
                    <span className="truncate">{ch}</span>
                    {unreadCounts[ch] > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.2">
                        {unreadCounts[ch]}
                      </span>
                    )}
                  </div>
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${
                    activeChannel === ch ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                  }`}>
                    {messages.filter(m => m.channel === ch).length}
                  </span>
                </button>
              ))}
          </div>

          <button
            onClick={addChannel}
            className="mt-3 shrink-0 flex items-center gap-2 text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-600/20 text-xs font-medium w-full justify-center py-2.5 rounded-xl border border-indigo-500/20 transition"
          >
            <Plus size={15} /> Add Channel
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 pt-3.5 border-t border-white/10 mt-3 bg-slate-900/40">
          <div className="relative">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || user?.name || "Innovator")}&background=6366f1&color=fff`}
              alt="avatar"
              className="w-9 h-9 rounded-xl shrink-0 object-cover ring-2 ring-indigo-500/30"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{user?.username || user?.name || "Innovator"}</p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
              Live Connected
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out (chat history preserved)"
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 w-full overflow-hidden bg-slate-950">
        {/* Header */}
        <header className="bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-white/10 flex items-center justify-between gap-3 shrink-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-white/5 focus:outline-none"
              aria-label="Open navigation menu"
            >
              <div className="space-y-1">
                <span className="block w-4 h-0.5 bg-current"></span>
                <span className="block w-4 h-0.5 bg-current"></span>
                <span className="block w-4 h-0.5 bg-current"></span>
              </div>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                {activeTab === "chat" ? <Hash size={18} /> : <BarChart3 size={18} />}
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>{activeTab === "chat" ? activeChannel : "System Dashboard"}</span>
                  {activeTab === "chat" && (
                    <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      Real-time
                    </span>
                  )}
                </h2>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  {activeTab === "chat" 
                    ? `Live discussion in #${activeChannel} • Auto-persisted` 
                    : "Live platform metrics & notification logs"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {activeTab === "chat" && (
              <button
                onClick={() => {
                  const chatData = {
                    channel: activeChannel,
                    exportDate: new Date().toISOString(),
                    totalMessages: messages.filter(m => m.channel === activeChannel).length,
                    messages: messages.filter(m => m.channel === activeChannel)
                  };
                  
                  const dataStr = JSON.stringify(chatData, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `highron_chat_${activeChannel}_${new Date().toISOString().split('T')[0]}.json`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-white/5 transition flex items-center gap-1.5"
              >
                <Download size={13} />
                <span className="hidden sm:inline">Export</span>
              </button>
            )}

            {activeTab === "dashboard" && notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-white/5 transition"
              >
                Clear ({notifications.length})
              </button>
            )}

            <div className="text-xs text-slate-300 flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-white/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-[11px]">{onlineUsers} online</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden min-h-0 relative">
          {activeTab === "chat" ? (
            /* Modern Chat Area */
            <div className="h-full flex flex-col min-h-0 bg-gradient-to-b from-slate-900/60 to-slate-950">
              {/* Messages Stream */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">
                {/* Channel Welcome Banner */}
                <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/60 rounded-2xl p-4 sm:p-5 border border-indigo-500/20 backdrop-blur-md shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                      <Hash size={20} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        Welcome to #{activeChannel}
                      </h3>
                      <p className="text-xs text-slate-400">This is the start of the #{activeChannel} channel.</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-2">
                    Connect with community members, exchange code snippets, and share ideas. 
                    All messages in this channel are broadcast live and stored securely.
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                    <span>{messages.filter(m => m.channel === activeChannel).length} messages</span>
                    <span className="text-indigo-400">• Active Channel</span>
                  </div>
                </div>
                
                {/* Messages List */}
                {messages.filter(m => m.channel === activeChannel).length === 0 ? (
                  <div className="text-center text-slate-400 py-16">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-white/5 flex items-center justify-center mx-auto mb-3 text-indigo-400">
                      <MessageCircle size={26} />
                    </div>
                    <p className="text-sm font-medium text-slate-300">No messages in #{activeChannel} yet.</p>
                    <p className="text-xs text-slate-500 mt-1">Be the first to send a message below!</p>
                  </div>
                ) : (
                  messages
                    .filter(m => m.channel === activeChannel)
                    .map((msg) => {
                      const isMe = msg.user === (user?.username || user?.name);
                      return (
                        <div 
                          key={msg.id} 
                          className={`flex items-start gap-3 group transition-all duration-200 ${
                            isMe ? "flex-row-reverse" : "flex-row"
                          }`}
                        >
                          <img
                            src={msg.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.user)}&background=6366f1&color=fff`}
                            alt={msg.user}
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl shrink-0 mt-0.5 object-cover ring-1 ring-white/10"
                          />
                          <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                            <div className="flex items-center gap-2 mb-1 px-1">
                              <span className="text-xs font-semibold text-slate-200">{msg.user}</span>
                              <span className="text-[10px] text-slate-500">{formatMessageTime(msg.timestamp)}</span>
                              {isMe && <span className="text-[10px] text-indigo-400 font-medium">(You)</span>}
                            </div>
                            <div className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm break-words leading-relaxed shadow-sm ${
                              isMe 
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-sm" 
                                : "bg-slate-800/90 text-slate-200 border border-white/5 rounded-tl-sm hover:border-white/10 transition-colors"
                            }`}>
                              {msg.text}
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Form */}
              <form
                onSubmit={sendMessage}
                className="bg-slate-900/90 backdrop-blur-md p-3 sm:p-4 border-t border-white/10 flex items-center gap-2 sm:gap-3 shrink-0"
              >
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message #${activeChannel}...`}
                    className="w-full pl-4 pr-12 py-2.5 sm:py-3 rounded-xl bg-slate-800/90 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm border border-white/5 transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl transition text-white shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 shrink-0 text-xs sm:text-sm font-semibold cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Send</span>
                  <Send size={15} />
                </button>
              </form>
            </div>
          ) : (
            /* Dashboard Area - Full Screen & Responsive */
            <div className="h-full flex flex-col min-h-0 overflow-y-auto bg-gradient-to-b from-slate-900/60 to-slate-950 p-4 lg:p-6">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl h-full flex flex-col lg:flex-row overflow-hidden shadow-2xl">
                {/* Left Panel - Notifications & Stats */}
                <div className="w-full lg:w-1/3 xl:w-1/4 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col">
                  <h3 className="text-base lg:text-lg font-bold mb-4 flex items-center gap-2 text-white">
                    <Activity className="text-indigo-400" size={18} />
                    <span>System Telemetry</span>
                  </h3>
                  
                  {/* Quick Stats Grid */}
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold mb-3 text-slate-400 uppercase tracking-wider">Live Metrics</h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="bg-slate-800/60 border border-white/5 p-3 rounded-xl">
                        <p className="text-[11px] text-slate-400">Total Messages</p>
                        <p className="text-lg font-bold text-white mt-0.5">{messages.length}</p>
                      </div>
                      <div className="bg-slate-800/60 border border-white/5 p-3 rounded-xl">
                        <p className="text-[11px] text-slate-400">Your Messages</p>
                        <p className="text-lg font-bold text-indigo-400 mt-0.5">
                          {messages.filter(msg => msg.user === (user?.username || user?.name)).length}
                        </p>
                      </div>
                      <div className="bg-slate-800/60 border border-white/5 p-3 rounded-xl">
                        <p className="text-[11px] text-slate-400">Unread</p>
                        <p className="text-lg font-bold text-red-400 mt-0.5">
                          {Object.values(unreadCounts).reduce((sum, count) => sum + count, 0)}
                        </p>
                      </div>
                      <div className="bg-slate-800/60 border border-white/5 p-3 rounded-xl">
                        <p className="text-[11px] text-slate-400">Active Channels</p>
                        <p className="text-lg font-bold text-emerald-400 mt-0.5">{channels.length}</p>
                      </div>
                    </div>
                  </div>

                  {/* Notifications Panel */}
                  <div className="flex-1 min-h-0 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Activity Feed</h4>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {notifications.filter(n => !n.read).length} new
                      </span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                      {notifications.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 text-xs">
                          <Bell size={24} className="mx-auto mb-2 opacity-40 text-indigo-400" />
                          <p>No recent notifications</p>
                        </div>
                      ) : (
                        notifications.slice(0, 8).map(notification => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-xl text-xs transition border ${
                              notification.read 
                                ? 'bg-slate-800/40 border-white/5 text-slate-300' 
                                : 'bg-slate-800/90 border-indigo-500/30 text-white'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-semibold text-indigo-400">#{notification.channel}</span>
                              <span className="text-[10px] text-slate-400">
                                {formatNotificationTime(notification.timestamp)}
                              </span>
                            </div>
                            <p className="text-slate-300 text-xs leading-relaxed">
                              <strong className="text-white">{notification.user}:</strong> {notification.preview}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Panel - Analytics Canvas */}
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="p-4 lg:p-6 border-b border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm lg:text-base">Traffic & Discussion Volume</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Real-time message velocity across the network</p>
                    </div>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
                      Live Stream
                    </span>
                  </div>
                  <div className="flex-1 p-4 lg:p-6 min-h-0">
                    <canvas 
                      ref={canvasRef} 
                      className="w-full h-full rounded-xl bg-slate-950/80 border border-white/5"
                    />
                  </div>
                  <div className="p-3 lg:p-4 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
                    <span>Synchronized locally & globally</span>
                    <span className="text-indigo-400 font-medium">Total Volume: {messages.length} messages</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
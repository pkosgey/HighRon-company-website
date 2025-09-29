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
  BellOff
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
 
export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState("general");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [notifications, setNotifications] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(1);
  
  const canvasRef = useRef(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (token) {
      const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:3001";
      socketRef.current = io(backendUrl, {
      auth: { token }
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to server");
      });

      socketRef.current.on("message", (msg) => {
        setMessages(prev => [...prev, msg]);
        
        // Create notification for new messages in other channels or when not on chat tab
        if (msg.channel !== activeChannel || activeTab !== "chat") {
          createNotification(msg);
        }
      });

        socketRef.current.on("error", (error) => {
          console.error("Socket error:", error);
        });

        socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection failed:", error);
      });

      socketRef.current.on("chatMessage", (data) => {
        console.log("Message received from server:", data);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [token]);

  // Load channels from backend
  useEffect(() => {
    const loadChannels = async () => {
      try {
        const response = await fetch(`${API_URL}/channels`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const channelNames = data.map(ch => ch.name || ch);
          setChannels(channelNames);
        } else {
          console.error('Failed to load channels');
          // Fallback to default channels
          setChannels(['general', 'tech', 'random']);
        }
      } catch (error) {
        console.error('Failed to load channels:', error);
        // Fallback to default channels
        setChannels(['general', 'tech', 'random']);
      }
    };

    if (token) {
      loadChannels();
    }
  }, [token]);

  // Load messages when channel changes
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/messages/${activeChannel}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error('Failed to load messages');
          setMessages([]);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
        setMessages([]);
      }
    };

    if (token && activeChannel) {
      loadMessages();
      
      // Join socket room
      if (socketRef.current) {
        socketRef.current.emit("joinRoom", activeChannel);
      }

      // Mark channel as read
      markChannelAsRead(activeChannel);
    }
  }, [activeChannel, token]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Draw dashboard when active tab changes
  useEffect(() => {
    if (activeTab === "dashboard" && canvasRef.current) {
      drawDashboard();
    }
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
      const messageData = {
        user: user?.username,
        channel: activeChannel,
        text: newMessage,
        timestamp: new Date().toISOString(), // Add timestamp
        id: Date.now() + Math.random() // Add unique ID
      };

      console.log("Sending message:", messageData); // Debug log

      // Add message immediately to state for better UX
      setMessages(prev => [...prev, messageData]);
      
      // Try to send via socket if connected
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("chatMessage", messageData);
      } else {
        console.warn("Socket not connected, message stored locally only");
      }
      
      setNewMessage("");
    }
  };

  const addChannel = async () => {
    const name = prompt("Enter new channel name:");
    if (name && !channels.includes(name)) {
      try {
        const response = await fetch(`${API_URL}/channels`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name })
        });

        if (response.ok) {
          const newChannel = await response.json();
          setChannels(prev => [...prev, newChannel.name || name]);
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to create channel');
        }
      } catch (error) {
        console.error('Failed to create channel:', error);
        alert('Failed to create channel');
      }
    } else if (channels.includes(name)) {
      alert("Channel name already exists!");
    }
  };

  const clearChannelHistory = () => {
    if (window.confirm(`Are you sure you want to clear all messages in #${activeChannel}?`)) {
      setMessages([]);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: user?.id })
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem("user");
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
    ctx.fillStyle = '#2f3136';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw header
    ctx.fillStyle = '#40444b';
    ctx.fillRect(0, 0, canvas.width, 40);
    
    // Draw header text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('HighRon Dashboard', 10, 25);
    
    // Draw chat statistics
    const statsY = 60;
    ctx.fillStyle = '#36393f';
    ctx.fillRect(10, statsY, canvas.width - 20, 100);
    
    // Draw stats text
    ctx.fillStyle = '#dcddde';
    ctx.font = '14px Arial';
    
    const totalMessages = messages.length;
    const userMessages = messages.filter(msg => msg.user === user?.username).length;
    const today = new Date().toISOString().split('T')[0];
    const todayMessages = messages.filter(msg => 
      msg.timestamp && msg.timestamp.startsWith(today)
    ).length;
    
    ctx.fillText(`Total Messages: ${totalMessages}`, 20, statsY + 25);
    ctx.fillText(`Your Messages: ${userMessages}`, 20, statsY + 50);
    ctx.fillText(`Today's Messages: ${todayMessages}`, canvas.width/2, statsY + 25);
    ctx.fillText(`Active Channel: #${activeChannel}`, canvas.width/2, statsY + 50);
    
    // Draw notification stats
    const notificationStatsY = statsY + 120;
    ctx.fillStyle = '#36393f';
    ctx.fillRect(10, notificationStatsY, canvas.width - 20, 80);
    
    ctx.fillStyle = '#dcddde';
    ctx.font = '14px Arial';
    const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
    ctx.fillText(`Unread Messages: ${totalUnread}`, 20, notificationStatsY + 25);
    ctx.fillText(`Notifications: ${notifications.length}`, 20, notificationStatsY + 50);
    ctx.fillText(`Status: ${notificationsEnabled ? 'Enabled' : 'Disabled'}`, canvas.width/2, notificationStatsY + 25);
    
    // Draw activity chart
    const chartY = notificationStatsY + 100;
    ctx.fillStyle = '#36393f';
    ctx.fillRect(10, chartY, canvas.width - 20, canvas.height - chartY - 20);
    
    // Draw chart title
    ctx.fillStyle = '#dcddde';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('Message Activity (Last 7 Days)', 20, chartY + 25);
    
    // Draw simple chart
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    const dailyCounts = last7Days.map(date => 
      messages.filter(msg => msg.timestamp && msg.timestamp.startsWith(date)).length
    );
    
    const maxCount = Math.max(...dailyCounts, 1);
    const chartWidth = canvas.width - 60;
    const chartHeight = 100;
    const barWidth = chartWidth / dailyCounts.length;
    
    for (let i = 0; i < dailyCounts.length; i++) {
      const barHeight = (dailyCounts[i] / maxCount) * chartHeight;
      const x = 30 + i * barWidth;
      const y = chartY + 80 + (chartHeight - barHeight);
      
      ctx.fillStyle = '#5865f2';
      ctx.fillRect(x, y, barWidth - 5, barHeight);
      
      if (dailyCounts[i] > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Arial';
        ctx.fillText(dailyCounts[i].toString(), x + (barWidth/2) - 5, y - 5);
      }
    }
    
    // Draw chart labels
    ctx.fillStyle = '#8e9297';
    ctx.font = '10px Arial';
    const dayLabels = last7Days.map(date => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { weekday: 'short' });
    });
    
    for (let i = 0; i < dayLabels.length; i++) {
      const x = 30 + i * barWidth + (barWidth / 2) - 8;
      ctx.fillText(dayLabels[i], x, chartY + 80 + chartHeight + 15);
    }
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
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 p-5 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="text-indigo-400">HighRon</span>
          </h1>
          
          {/* Navigation Tabs */}
          <div className="flex mb-6 bg-slate-700 rounded-md p-1">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-2 rounded-md text-center ${
                activeTab === "chat" ? "bg-indigo-500" : "hover:bg-slate-600"
              }`}
            >
              <MessageCircle size={18} className="inline mr-2" />
              Chat
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex-1 py-2 rounded-md text-center ${
                activeTab === "dashboard" ? "bg-indigo-500" : "hover:bg-slate-600"
              }`}
            >
              <BarChart3 size={18} className="inline mr-2" />
              Dashboard
            </button>
          </div>
          
          {/* Notification Toggle */}
          <div className="flex items-center justify-between mb-4 p-3 bg-slate-700 rounded-lg">
            <span className="text-sm">Notifications</span>
            <button
              onClick={toggleNotifications}
              className={`p-2 rounded-full ${
                notificationsEnabled ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {notificationsEnabled ? <Bell size={16} /> : <BellOff size={16} />}
            </button>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg flex items-center gap-2">
              <MessageCircle size={18} /> Channels
            </h2>
            <div className="flex gap-1">
              <button
                onClick={clearChannelHistory}
                className="text-red-400 hover:text-red-500"
                title="Clear channel history"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <ul className="space-y-2 mb-4">
            {channels.map((ch, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setActiveChannel(ch);
                  if (activeTab === "chat") {
                    markChannelAsRead(ch);
                  }
                }}
                className={`cursor-pointer px-3 py-2 rounded-md flex justify-between items-center ${
                  activeChannel === ch ? "bg-indigo-500" : "hover:bg-slate-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>#{ch}</span>
                  {unreadCounts[ch] > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCounts[ch]}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400">
                  {messages.filter(m => m.channel === ch).length}
                </span>
              </li>
            ))}
          </ul>
          <button
            onClick={addChannel}
            className="flex items-center gap-2 text-indigo-400 hover:underline w-full justify-center"
          >
            <Plus size={18} /> Add Channel
          </button>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}`}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold">{user?.username}</p>
            <p className="text-xs text-slate-400">Online</p>
          </div>
          <LogOut
            size={20}
            className="ml-auto cursor-pointer text-red-400 hover:text-red-500"
            onClick={handleLogout}
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <header className="bg-slate-800 px-6 py-4 shadow flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {activeTab === "chat" ? `#${activeChannel}` : "Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
            {activeTab === "chat" && (
              <button
                onClick={() => {
                  const chatData = {
                    channel: activeChannel,
                    exportDate: new Date().toISOString(),
                    messages: messages
                  };
                  
                  const dataStr = JSON.stringify(chatData, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `chat_${activeChannel}_${new Date().toISOString().split('T')[0]}.json`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
                className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-md transition"
              >
                Export Chat
              </button>
            )}
            {activeTab === "dashboard" && notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-md transition"
              >
                Clear Notifications ({notifications.length})
              </button>
            )}
            <span className="text-slate-400 flex items-center gap-1">
              <Users size={16} /> {onlineUsers} Online
            </span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "chat" ? (
            /* Chat Area */
            <div className="h-full flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="bg-slate-800 rounded-lg p-4 mb-4 border-l-4 border-indigo-500">
                  <h3 className="text-lg font-bold mb-2">Welcome To HighRon, <span className="text-indigo-400">@{user?.username}</span> 💬 ❤️</h3>
                  <p className="text-slate-300">
                    We are an encouraging learning community that helps beginners get started, and keep experts sharp! 
                    We are glad you're here! Hack The Planet!
                  </p>
                  <p className="text-sm text-slate-400 mt-2">
                    This channel has {messages.length} message{messages.length !== 1 ? 's' : ''}.
                    {unreadCounts[activeChannel] > 0 && (
                      <span className="text-red-400 ml-2">
                        {unreadCounts[activeChannel]} unread message{unreadCounts[activeChannel] !== 1 ? 's' : ''}
                      </span>
                    )}
                  </p>
                </div>
                
                {messages.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <MessageCircle size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No messages yet in #{activeChannel}. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3 group">
                      <img
                        src={msg.avatar || `https://ui-avatars.com/api/?name=${msg.user}`}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <p className="font-semibold">{msg.user}</p>
                          <p className="text-xs text-slate-400">
                            {formatMessageTime(msg.timestamp)}
                          </p>
                          {msg.user === user?.username && (
                            <span className="text-xs text-indigo-400">(You)</span>
                          )}
                        </div>
                        <p className="text-slate-300">{msg.text}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form
                onSubmit={sendMessage}
                className="bg-slate-800 p-4 flex items-center gap-3"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message #${activeChannel}`}
                  className="flex-1 px-4 py-2 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-500 px-5 py-2 rounded-md hover:bg-indigo-400 transition disabled:opacity-50"
                  disabled={!newMessage.trim()}
                >
                  Send
                </button>
              </form>
            </div>
          ) : (
            /* Dashboard Area - Full Screen & Responsive */
            <div className="h-full flex flex-col">
              <div className="flex-1 p-4 lg:p-6 min-h-0">
                <div className="bg-slate-800 rounded-lg h-full flex flex-col lg:flex-row">
                  {/* Left Panel - Notifications & Stats */}
                  <div className="w-full lg:w-1/3 xl:w-1/4 p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-slate-700 flex flex-col">
                    <h3 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6 flex items-center gap-2">
                      <Activity className="text-indigo-400" /> Server Analytics
                    </h3>
                    
                    {/* Quick Stats */}
                    <div className="mb-4 lg:mb-6">
                      <h4 className="font-semibold mb-3 text-slate-300 text-sm lg:text-base">Quick Stats</h4>
                      <div className="grid grid-cols-2 gap-2 lg:gap-3">
                        <div className="bg-slate-700 p-2 lg:p-3 rounded-lg">
                          <p className="text-xs lg:text-sm text-slate-400">Total Msgs</p>
                          <p className="text-base lg:text-lg font-bold">{messages.length}</p>
                        </div>
                        <div className="bg-slate-700 p-2 lg:p-3 rounded-lg">
                          <p className="text-xs lg:text-sm text-slate-400">Your Msgs</p>
                          <p className="text-base lg:text-lg font-bold">
                            {messages.filter(msg => msg.user === user?.username).length}
                          </p>
                        </div>
                        <div className="bg-slate-700 p-2 lg:p-3 rounded-lg">
                          <p className="text-xs lg:text-sm text-slate-400">Unread</p>
                          <p className="text-base lg:text-lg font-bold text-red-400">
                            {Object.values(unreadCounts).reduce((sum, count) => sum + count, 0)}
                          </p>
                        </div>
                        <div className="bg-slate-700 p-2 lg:p-3 rounded-lg">
                          <p className="text-xs lg:text-sm text-slate-400">Channels</p>
                          <p className="text-base lg:text-lg font-bold">{channels.length}</p>
                        </div>
                      </div>
                    </div>

                    {/* Notifications Panel */}
                    <div className="flex-1 min-h-0">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-300 text-sm lg:text-base">Recent Notifications</h4>
                        <span className="text-xs text-slate-400">
                          {notifications.filter(n => !n.read).length} unread
                        </span>
                      </div>
                      <div className="h-full overflow-y-auto space-y-2">
                        {notifications.length === 0 ? (
                          <p className="text-slate-400 text-sm text-center py-4 lg:py-8">
                            No notifications yet
                          </p>
                        ) : (
                          notifications.slice(0, 8).map(notification => (
                            <div
                              key={notification.id}
                              className={`p-2 lg:p-3 rounded-md text-xs lg:text-sm ${
                                notification.read ? 'bg-slate-700' : 'bg-slate-600 border-l-2 border-indigo-500'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <span className="font-medium text-indigo-300">#{notification.channel}</span>
                                <span className="text-xs text-slate-300">
                                  {formatNotificationTime(notification.timestamp)}
                                </span>
                              </div>
                              <p className="text-slate-200 mt-1 text-xs">
                                <strong>{notification.user}</strong>: {notification.preview}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Panel - Analytics Canvas */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="p-4 lg:p-6 border-b border-slate-700">
                      <h4 className="font-semibold text-slate-300 text-sm lg:text-base">Message Analytics</h4>
                      <p className="text-xs lg:text-sm text-slate-400">Real-time message statistics and trends</p>
                    </div>
                    <div className="flex-1 p-4 lg:p-6 min-h-0">
                      <canvas 
                        ref={canvasRef} 
                        className="w-full h-full rounded-md bg-slate-900"
                      />
                    </div>
                    <div className="p-3 lg:p-4 border-t border-slate-700 text-xs lg:text-sm text-slate-400">
                      <p>Connected to backend database. Total messages across all channels: {
                        channels.reduce((total, channel) => {
                          return total + messages.filter(m => m.channel === channel).length;
                        }, 0)
                      }</p>
                    </div>
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
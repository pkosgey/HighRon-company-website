import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Check, 
  X, 
  Filter, 
  Settings, 
  Mail, 
  Users, 
  Star, 
  AlertTriangle, 
  Calendar,
  MessageSquare,
  Download,
  Eye,
  Clock,
  Search,
  Trash2,
  Archive,
  ArrowLeft,
  LogOut
} from "lucide-react";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  // Sample notifications data
  const sampleNotifications = [
    {
      id: 1,
      type: "community",
      title: "New Community Event",
      message: "Join our AI Workshop this Friday at 2 PM EST. Learn about machine learning fundamentals and real-world applications.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
      icon: <Calendar className="text-blue-500" size={20} />,
      priority: "high",
      action: "rsvp"
    },
    {
      id: 2,
      type: "message",
      title: "New Message from John",
      message: "Hey! I wanted to discuss the project timeline and deliverables for the upcoming sprint.",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      read: false,
      icon: <MessageSquare className="text-green-500" size={20} />,
      priority: "medium",
      action: "reply"
    },
    {
      id: 3,
      type: "system",
      title: "System Update Completed",
      message: "Your account has been upgraded to Premium tier. Enjoy all the new features and benefits!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: true,
      icon: <Star className="text-yellow-500" size={20} />,
      priority: "medium",
      action: "view"
    },
    {
      id: 4,
      type: "security",
      title: "Security Alert",
      message: "New login detected from unknown device. Please verify if this was you.",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      read: false,
      icon: <AlertTriangle className="text-red-500" size={20} />,
      priority: "critical",
      action: "review"
    },
    {
      id: 5,
      type: "resource",
      title: "New Resource Available",
      message: "Download the latest AI development toolkit with new features and improvements.",
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
      read: true,
      icon: <Download className="text-purple-500" size={20} />,
      priority: "low",
      action: "download"
    },
    {
      id: 6,
      type: "community",
      title: "You have new followers",
      message: "5 new members started following your profile. Connect with them to grow your network.",
      timestamp: new Date(Date.now() - 1000 * 60 * 240),
      read: true,
      icon: <Users className="text-indigo-500" size={20} />,
      priority: "low",
      action: "view"
    },
    {
      id: 7,
      type: "system",
      title: "Maintenance Notice",
      message: "Scheduled maintenance this Sunday 2-4 AM EST. Services may be temporarily unavailable.",
      timestamp: new Date(Date.now() - 1000 * 60 * 360),
      read: true,
      icon: <Settings className="text-gray-500" size={20} />,
      priority: "medium",
      action: "dismiss"
    },
    {
      id: 8,
      type: "community",
      title: "Project Collaboration Invitation",
      message: "You've been invited to collaborate on the Quantum Computing Research project.",
      timestamp: new Date(Date.now() - 1000 * 60 * 480),
      read: false,
      icon: <Users className="text-teal-500" size={20} />,
      priority: "high",
      action: "respond"
    },
    {
      id: 9,
      type: "resource",
      title: "Course Completion Certificate",
      message: "Your Advanced React course has been completed. Download your certificate now.",
      timestamp: new Date(Date.now() - 1000 * 60 * 720),
      read: true,
      icon: <Download className="text-amber-500" size={20} />,
      priority: "medium",
      action: "download"
    },
    {
      id: 10,
      type: "system",
      title: "Weekly Digest",
      message: "Your weekly activity summary is ready. Check out your progress and achievements.",
      timestamp: new Date(Date.now() - 1000 * 60 * 1440),
      read: true,
      icon: <Mail className="text-cyan-500" size={20} />,
      priority: "low",
      action: "view"
    }
  ];

  useEffect(() => {
    // Simulate loading notifications
    setNotifications(sampleNotifications);
    updateUnreadCount(sampleNotifications);
  }, []);

  const updateUnreadCount = (notifs) => {
    const unread = notifs.filter(notif => !notif.read).length;
    setUnreadCount(unread);
  };

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };

  const deleteNotification = (id) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== id);
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const filters = [
    { id: "all", name: "All", icon: <Bell size={18} /> },
    { id: "unread", name: "Unread", icon: <Eye size={18} /> },
    { id: "community", name: "Community", icon: <Users size={18} /> },
    { id: "system", name: "System", icon: <Settings size={18} /> },
    { id: "security", name: "Security", icon: <AlertTriangle size={18} /> },
    { id: "resource", name: "Resources", icon: <Download size={18} /> },
  ];

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = filter === "all" || 
                         (filter === "unread" && !notif.read) || 
                         notif.type === filter;
    
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "border-l-4 border-l-red-500 bg-red-500/10";
      case "high": return "border-l-4 border-l-orange-500 bg-orange-500/10";
      case "medium": return "border-l-4 border-l-yellow-500 bg-yellow-500/10";
      case "low": return "border-l-4 border-l-green-500 bg-green-500/10";
      default: return "border-l-4 border-l-gray-500";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("session_user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white overflow-x-hidden flex flex-col">
      {/* Top Navbar */}
      <nav className="w-full bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between z-20">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition text-xs sm:text-sm font-medium">
            <ArrowLeft size={16} />
            <span>Home</span>
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-white font-semibold text-xs sm:text-sm">Notification Hub</span>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-4">
          <Link to="/dashboard" className="text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition font-medium">
            Dashboard
          </Link>
          <button 
            onClick={handleLogout}
            className="text-xs sm:text-sm text-slate-400 hover:text-red-400 p-2 rounded-xl hover:bg-white/5 transition flex items-center gap-1.5"
            title="Log Out"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </nav>

      {/* Header - Full Width */}
      <div className="w-full relative overflow-hidden border-b border-slate-700/50">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-none" />
        <div className="relative z-10 w-full px-4 py-6 sm:py-8 lg:py-10">
          <div className="w-full max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full"
            >
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold mb-1.5 tracking-tight text-white">Notifications</h1>
                <p className="text-slate-300 text-sm sm:text-base lg:text-lg">
                  {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : "All caught up"}
                </p>
              </div>
              
              <div className="flex gap-2.5 sm:gap-3 flex-wrap w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={markAllAsRead}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                  disabled={unreadCount === 0}
                >
                  <Check size={16} />
                  <span>Mark All Read</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearAll}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-red-600/80 hover:bg-red-600 rounded-xl transition-colors text-xs sm:text-sm font-semibold shadow-lg shadow-red-600/20"
                >
                  <Trash2 size={16} />
                  <span>Clear All</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full flex-1 flex flex-col">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 flex-1">
          <div className="w-full max-w-7xl mx-auto h-full flex flex-col">
            
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-4 sm:p-6 mb-6 border border-slate-700/50 w-full"
            >
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter Tabs - Scrollable on mobile */}
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-2 min-w-max">
                  {filters.map((filterItem) => (
                    <button
                      key={filterItem.id}
                      onClick={() => setFilter(filterItem.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 flex-shrink-0 ${
                        filter === filterItem.id
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                      }`}
                    >
                      {filterItem.icon}
                      <span className="text-sm font-medium whitespace-nowrap">{filterItem.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Notifications List - Scrollable Area */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex-1 overflow-y-auto"
            >
              <AnimatePresence>
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-3 pb-6">
                    {filteredNotifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`bg-slate-800/30 backdrop-blur-lg rounded-xl p-4 border border-slate-700/50 hover:border-slate-500/50 transition-all duration-300 ${
                          !notification.read ? 'ring-2 ring-indigo-500/30 shadow-lg' : 'shadow-md'
                        } ${getPriorityColor(notification.priority)}`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Notification Icon */}
                          <div className="flex-shrink-0 mt-1">
                            {notification.icon}
                          </div>

                          {/* Notification Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                              <h3 className={`font-semibold text-lg sm:text-xl leading-tight ${
                                !notification.read ? 'text-white' : 'text-slate-300'
                              }`}>
                                {notification.title}
                              </h3>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="text-slate-400 text-sm whitespace-nowrap">
                                  {getTimeAgo(notification.timestamp)}
                                </span>
                                {!notification.read && (
                                  <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-slate-300 mb-3 leading-relaxed text-base">
                              {notification.message}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2">
                              {!notification.read && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => markAsRead(notification.id)}
                                  className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-sm transition-colors"
                                >
                                  <Check size={14} />
                                  Mark Read
                                </motion.button>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => deleteNotification(notification.id)}
                                className="flex items-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg text-sm transition-colors"
                              >
                                <X size={14} />
                                Dismiss
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  /* Empty State */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center py-16 h-full"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center mx-auto mb-4 text-indigo-400">
                        <Bell size={32} />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-semibold mb-2">No notifications</h3>
                      <p className="text-slate-400 text-lg mb-6">
                        {searchTerm || filter !== "all" 
                          ? "Try adjusting your search or filter" 
                          : "You're all caught up! Check back later for new updates."
                        }
                      </p>
                      {(searchTerm || filter !== "all") && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSearchTerm("");
                            setFilter("all");
                          }}
                          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                        >
                          Clear Filters
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Stats Footer */}
            {filteredNotifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-6 pt-6 border-t border-slate-700/50"
              >
                <div className="flex flex-wrap justify-center gap-6 text-slate-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Bell size={16} />
                    <span>Total: {notifications.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    <span>Unread: {unreadCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>Last updated: Just now</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="sm:hidden fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={markAllAsRead}
          className="bg-indigo-600 text-white p-4 rounded-full shadow-2xl"
          disabled={unreadCount === 0}
        >
          <Check size={24} />
        </motion.button>
      </div>
    </div>
  );
};

export default NotificationsPage;
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, Star, Clock, Users, BookOpen, Code, Shield, TrendingUp, Video, FileText, Database } from "lucide-react";

const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Comprehensive resources data
  const resources = {
    learning: {
      title: "🎓 Learning Center",
      icon: <BookOpen size={20} />,
      items: [
        { name: "AI/ML Fundamentals Course", type: "video", rating: 4.9, downloads: 1247, duration: "8h", premium: false },
        { name: "Quantum Computing 101", type: "ebook", rating: 4.7, downloads: 892, duration: "3h", premium: true },
        { name: "Blockchain Development Guide", type: "interactive", rating: 4.8, downloads: 1563, duration: "6h", premium: false },
        { name: "Cybersecurity Certification Path", type: "course", rating: 4.9, downloads: 2104, duration: "12h", premium: true },
        { name: "React Advanced Patterns", type: "video", rating: 4.6, downloads: 987, duration: "4h", premium: false },
      ]
    },
    tools: {
      title: "🔧 Development Tools",
      icon: <Code size={20} />,
      items: [
        { name: "HighRon API SDK v2.1", type: "tool", rating: 4.8, downloads: 2541, duration: null, premium: false },
        { name: "Project Starter Kits Collection", type: "template", rating: 4.5, downloads: 1876, duration: null, premium: false },
        { name: "Code Review Checklist", type: "guide", rating: 4.7, downloads: 3210, duration: null, premium: false },
        { name: "Deployment Automation Scripts", type: "tool", rating: 4.9, downloads: 1423, duration: null, premium: true },
        { name: "UI Component Library", type: "library", rating: 4.6, downloads: 1987, duration: null, premium: false },
      ]
    },
    research: {
      title: "📊 Research & Insights",
      icon: <TrendingUp size={20} />,
      items: [
        { name: "Sustainable Tech Whitepaper 2024", type: "paper", rating: 4.8, downloads: 876, duration: "45m", premium: false },
        { name: "AI Ethics Framework Guide", type: "guide", rating: 4.9, downloads: 654, duration: "1h", premium: true },
        { name: "Quantum Security Analysis", type: "paper", rating: 4.7, downloads: 432, duration: "30m", premium: false },
        { name: "Future Tech Trends Report", type: "report", rating: 4.8, downloads: 1298, duration: "2h", premium: true },
        { name: "Market Analysis Q3 2024", type: "report", rating: 4.6, downloads: 765, duration: "1h", premium: false },
      ]
    },
    security: {
      title: "🛡️ Security Resources",
      icon: <Shield size={20} />,
      items: [
        { name: "Security Best Practices", type: "guide", rating: 4.9, downloads: 1987, duration: "2h", premium: false },
        { name: "Vulnerability Assessment Toolkit", type: "tool", rating: 4.8, downloads: 1123, duration: null, premium: true },
        { name: "Compliance Checklists", type: "template", rating: 4.7, downloads: 876, duration: null, premium: false },
        { name: "Data Protection Guidelines", type: "guide", rating: 4.9, downloads: 1543, duration: "1h", premium: false },
      ]
    }
  };

  const categories = [
    { id: "all", name: "All Resources", icon: <Database size={18} /> },
    { id: "learning", name: "Learning", icon: <BookOpen size={18} /> },
    { id: "tools", name: "Tools", icon: <Code size={18} /> },
    { id: "research", name: "Research", icon: <TrendingUp size={18} /> },
    { id: "security", name: "Security", icon: <Shield size={18} /> },
  ];

  const resourceTypes = {
    video: { color: "bg-red-100 text-red-800", icon: <Video size={14} /> },
    ebook: { color: "bg-blue-100 text-blue-800", icon: <FileText size={14} /> },
    interactive: { color: "bg-green-100 text-green-800", icon: <Code size={14} /> },
    course: { color: "bg-purple-100 text-purple-800", icon: <BookOpen size={14} /> },
    tool: { color: "bg-orange-100 text-orange-800", icon: <Code size={14} /> },
    template: { color: "bg-indigo-100 text-indigo-800", icon: <FileText size={14} /> },
    guide: { color: "bg-teal-100 text-teal-800", icon: <BookOpen size={14} /> },
    library: { color: "bg-pink-100 text-pink-800", icon: <Database size={14} /> },
    paper: { color: "bg-gray-100 text-gray-800", icon: <FileText size={14} /> },
    report: { color: "bg-cyan-100 text-cyan-800", icon: <TrendingUp size={14} /> },
  };

  // Filter resources based on search and category
  const filteredResources = Object.entries(resources).filter(([categoryId]) => 
    selectedCategory === "all" || categoryId === selectedCategory
  ).flatMap(([categoryId, category]) => 
    category.items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).map(item => ({ ...item, category: categoryId }))
  );

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      {/* Header */}
      <div className="relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative z-10 w-full px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              HighRon Tech Resources
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Access cutting-edge tools, courses, and research materials to accelerate your tech journey
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="relative w-full px-4 sm:px-6 lg:px-8 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-slate-700 mx-auto"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search resources, courses, tools..."
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                }`}
              >
                {category.icon}
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-slate-400 text-sm">
            {filteredResources.length} resources found
          </div>
        </motion.div>
      </div>

      {/* Resources Grid */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredResources.map((resource, index) => (
            <motion.div
              key={`${resource.category}-${resource.name}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-800/30 backdrop-blur-lg rounded-xl p-6 border border-slate-700 hover:border-indigo-400 transition-all duration-300 hover:transform hover:scale-105 group"
            >
              {/* Resource Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${resourceTypes[resource.type].color}`}>
                    {resourceTypes[resource.type].icon}
                    {resource.type}
                  </span>
                  {resource.premium && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Star size={12} />
                      Premium
                    </span>
                  )}
                </div>
                <Download size={18} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
              </div>

              {/* Resource Title */}
              <h3 className="font-semibold text-lg mb-2 group-hover:text-indigo-300 transition-colors">
                {resource.name}
              </h3>

              {/* Resource Meta */}
              <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400" />
                  <span>{resource.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{resource.downloads.toLocaleString()}</span>
                </div>
                {resource.duration && (
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{resource.duration}</span>
                  </div>
                )}
              </div>

              {/* Category Badge */}
              <div className="flex items-center gap-2 text-xs text-slate-500">
                {resources[resource.category].icon}
                <span>{resources[resource.category].title}</span>
              </div>

              {/* Download Button */}
              <button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition-colors group-hover:shadow-lg">
                Download Resource
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No resources found</h3>
            <p className="text-slate-400">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-slate-800/20 border-t border-slate-700 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-400">500+</div>
              <div className="text-slate-400">Resources Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">50K+</div>
              <div className="text-slate-400">Community Downloads</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">100+</div>
              <div className="text-slate-400">Expert Contributors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">4.8/5</div>
              <div className="text-slate-400">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
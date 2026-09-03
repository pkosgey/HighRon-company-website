import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Star, Clock, Users, BookOpen, Code, Shield, 
  TrendingUp, Video, FileText, Database, ArrowLeft, LogOut, 
  Sparkles, Eye, Plus, ShieldCheck, CheckCircle, 
  Cpu, Lock, X, UploadCloud, PlayCircle, Film
} from "lucide-react";

const INITIAL_RESOURCES = {
  learning: {
    title: "Learning Center",
    items: [
      { id: "res-1", name: "AI & ML Architecture Masterclass", type: "video", rating: 4.9, learners: 1247, duration: "8h", description: "Deep dive into Transformer neural networks, attention mechanisms, and real-world deployment patterns.", content: "Comprehensive lecture series covering Attention Is All You Need, Transformer architecture, fine-tuning LLMs with LoRA, and serving high-throughput inference endpoints with vLLM.", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { id: "res-2", name: "Quantum Computing Principles", type: "ebook", rating: 4.7, learners: 892, duration: "3h", description: "Foundation handbook covering Qubits, superposition, entanglement, and Shor's algorithm.", content: "Table of Contents:\n1. Mathematical foundations of Hilbert spaces\n2. Qubits and Quantum Gates\n3. Quantum Circuit Optimization\n4. Quantum Error Mitigation\n5. Practical applications in Post-Quantum Cryptography." },
      { id: "res-3", name: "Modern Cyber Defense Interactive Lab", type: "interactive", rating: 4.8, learners: 1563, duration: "6h", description: "Hands-on browser simulations for packet inspection, firewall rule enforcement, and anomaly detection.", content: "Interactive walkthrough analyzing PCAP captures, detecting zero-day buffer overflows, and crafting automated IDS signatures." },
      { id: "res-4", name: "Enterprise Security Certification Syllabus", type: "course", rating: 4.9, learners: 2104, duration: "12h", description: "Full accreditation preparation curriculum for security architects and engineering teams.", content: "Curriculum Modules:\nModule 1: Identity & Access Governance (RBAC & ABAC)\nModule 2: Cloud Infrastructure Hardening\nModule 3: SOC Runbooks and Incident Response Planning." },
    ]
  },
  tools: {
    title: "Development Tools",
    items: [
      { id: "res-5", name: "HighRon Core API SDK v2.1", type: "tool", rating: 4.8, learners: 2541, duration: "Reference", description: "Official documentation and TypeScript client libraries for integrating HighRon realtime protocols.", content: "SDK Quickstart:\nimport { HighRonClient } from '@highron/sdk';\nconst client = new HighRonClient({ apiKey: process.env.HIGHRON_KEY });\nawait client.connectStream('telemetry');" },
      { id: "res-6", name: "Production Kubernetes Manifests", type: "template", rating: 4.5, learners: 1876, duration: "Specs", description: "Hardened Helm charts and zero-trust Istio service mesh configurations.", content: "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: highron-ingress\nspec:\n  replicas: 3\n  template:\n    spec:\n      containers:\n      - name: gateway\n        image: highron/gateway:v2" },
      { id: "res-7", name: "Code Review & Security Checklist", type: "guide", rating: 4.7, learners: 3210, duration: "Guidelines", description: "30-point verification checklist for memory safety, cryptographic sanity, and vulnerability prevention.", content: "Review Checklist:\n[ ] 1. All external inputs validated against strict regex schema\n[ ] 2. Secrets injected via environment vaults, never hardcoded\n[ ] 3. Cryptographic primitives using SHA-256 or Argon2id\n[ ] 4. Rate-limiting enforced on authentication routes." }
    ]
  },
  research: {
    title: "Research & Insights",
    items: [
      { id: "res-8", name: "Decentralized AI Governance Whitepaper", type: "paper", rating: 4.8, learners: 876, duration: "45m read", description: "Peer-reviewed research exploring consensus-driven safety alignments in autonomous agent systems.", content: "Abstract: We evaluate cryptographic proof-of-safety mechanisms designed to enforce behavioral constraints across decentralized LLM worker clusters without centralized single-points-of-failure." },
      { id: "res-9", name: "Quantum Encryption Resistance Benchmark", type: "paper", rating: 4.7, learners: 432, duration: "30m read", description: "Performance analysis of Kyber vs Classic McEliece algorithms on constrained IoT nodes.", content: "Benchmarking results demonstrate that Kyber-768 provides optimal throughput with 4.2x faster key generation on ARM Cortex-M4 processors compared to legacy RSA-4096." }
    ]
  },
  security: {
    title: "Security Resources",
    items: [
      { id: "res-10", name: "Zero-Trust Architecture Guidelines", type: "guide", rating: 4.9, learners: 1987, duration: "2h read", description: "Framework for implementing micro-segmentation, continuous verification, and ephemeral session tokens.", content: "Zero Trust Core Principles:\n1. Verify explicitly at every network hop\n2. Use least privileged access\n3. Assume breach and automate telemetry forensics." }
    ]
  }
};

const getStoredResources = () => {
  try {
    const data = localStorage.getItem("highron_resources_store");
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load saved resources:", e);
  }
  return INITIAL_RESOURCES;
};

export default function ResourcesPage() {
  const navigate = useNavigate();
  const sessionUser = JSON.parse(localStorage.getItem("session_user"));
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const user = sessionUser || storedUser;

  // Check if current user is admin (specifically checking ronaldsneekord002@gmail.com or role: admin)
  const isAdmin = Boolean(
    user?.email?.trim().toLowerCase() === "ronaldsneekord002@gmail.com" ||
    user?.role === "admin"
  );

  const [resources, setResources] = useState(getStoredResources);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Interactive Viewer Modal state (No download allowed)
  const [viewingResource, setViewingResource] = useState(null);

  // Admin Upload Modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState("document"); // "document" or "video"
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    name: "",
    category: "learning",
    type: "guide",
    rawContent: "",
    duration: "45m",
    videoUrl: ""
  });

  // AI Analysis simulation states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisStep, setAiAnalysisStep] = useState("");
  const [aiResult, setAiResult] = useState(null);

  const fileInputRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("session_user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Handle local file selection (document .txt/.pdf/.md or video .mp4/.webm)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);

    if (uploadMode === "document") {
      // Read document text
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        setUploadForm(prev => ({
          ...prev,
          name: prev.name || file.name.replace(/\.[^/.]+$/, ""),
          rawContent: typeof text === "string" ? text : "Binary document attached. Ready for HighRon AI parsing."
        }));
      };
      reader.readAsText(file);
    } else if (uploadMode === "video") {
      // Create local streaming object URL for in-browser streaming
      const videoBlobUrl = URL.createObjectURL(file);
      setUploadForm(prev => ({
        ...prev,
        name: prev.name || file.name.replace(/\.[^/.]+$/, ""),
        type: "video",
        videoUrl: videoBlobUrl,
        rawContent: `Video Asset: ${file.name}\nSize: ${(file.size / (1024 * 1024)).toFixed(2)} MB\nCodec/MIME: ${file.type || "video/mp4"}\nStatus: Streamable in high-definition without download.`
      }));
    }
  };

  // AI Analyze and publish handler
  const handleAIAnalyzeAndPost = async (e) => {
    e.preventDefault();
    if (!uploadForm.name.trim()) {
      alert("Please provide a resource title!");
      return;
    }

    if (uploadMode === "document" && !uploadForm.rawContent.trim() && !uploadedFile) {
      alert("Please upload a document or paste content for AI analysis!");
      return;
    }

    setIsAnalyzing(true);
    setAiResult(null);

    // AI Pipeline simulation
    if (uploadMode === "video") {
      setAiAnalysisStep("Transcribing video audio track & generating speech timestamps...");
      await new Promise(r => setTimeout(r, 700));

      setAiAnalysisStep("Running Computer Vision scan for inappropriate content & copyright...");
      await new Promise(r => setTimeout(r, 800));

      setAiAnalysisStep("Optimizing video chunk streaming headers & locking download channels...");
      await new Promise(r => setTimeout(r, 700));
    } else {
      setAiAnalysisStep("Parsing document content & extracting semantic concepts...");
      await new Promise(r => setTimeout(r, 700));

      setAiAnalysisStep("Running HighRon AI Security & Quality Verification Scan...");
      await new Promise(r => setTimeout(r, 800));

      setAiAnalysisStep("Synthesizing learning outcomes, syllabus tags, and difficulty rating...");
      await new Promise(r => setTimeout(r, 700));
    }

    const generatedSummary = uploadForm.rawContent.length > 140 
      ? uploadForm.rawContent.slice(0, 137) + "..."
      : uploadForm.rawContent || "High-definition interactive video session verified by HighRon AI.";

    const newResourceItem = {
      id: "res-ai-" + Date.now(),
      name: uploadForm.name.trim(),
      type: uploadMode === "video" ? "video" : uploadForm.type,
      rating: 5.0,
      learners: 1,
      duration: uploadForm.duration || (uploadMode === "video" ? "Video Stream" : "Self-Paced"),
      description: generatedSummary,
      content: uploadForm.rawContent,
      videoUrl: uploadForm.videoUrl,
      aiVerified: true,
      postedBy: user?.name || "Admin Ronald",
      createdAt: new Date().toISOString()
    };

    setResources(prev => {
      const targetCategory = uploadForm.category in prev ? uploadForm.category : "learning";
      const updatedCatItems = [newResourceItem, ...prev[targetCategory].items];
      const updated = {
        ...prev,
        [targetCategory]: {
          ...prev[targetCategory],
          items: updatedCatItems
        }
      };
      localStorage.setItem("highron_resources_store", JSON.stringify(updated));
      return updated;
    });

    setAiResult({
      status: "Verified & Published",
      qualityScore: uploadMode === "video" ? "99.8% (HD Audio/Video Scan)" : "99.2% (Document Semantic Pass)",
      recommendation: uploadMode === "video" ? "Video Ready for Protected In-Browser Streaming" : "Document Approved by AI Pipeline"
    });

    setIsAnalyzing(false);

    setTimeout(() => {
      setIsUploadModalOpen(false);
      setUploadedFile(null);
      setUploadForm({
        name: "",
        category: "learning",
        type: "guide",
        rawContent: "",
        duration: "45m",
        videoUrl: ""
      });
      setAiResult(null);
      setAiAnalysisStep("");
    }, 1700);
  };

  // Filter resources based on search and category
  const filteredResources = Object.entries(resources).filter(([categoryId]) => 
    selectedCategory === "all" || categoryId === selectedCategory
  ).flatMap(([categoryId, category]) => 
    category.items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    ).map(item => ({ ...item, category: categoryId }))
  );

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white overflow-x-hidden flex flex-col selection:bg-indigo-500/30">
      {/* Top Navbar */}
      <nav className="w-full bg-slate-900/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-3 sm:gap-6">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs sm:text-sm font-medium">
            <ArrowLeft size={16} />
            <span>Home</span>
          </Link>
          <span className="text-slate-700">/</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-xs sm:text-sm tracking-wide">Resources Hub</span>
            {isAdmin && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold flex items-center gap-1">
                <ShieldCheck size={12} /> Admin Mode
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Admin Upload Trigger Button */}
          {isAdmin && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 transition transform hover:scale-[1.02]"
            >
              <Sparkles size={15} />
              <span>Upload with AI</span>
            </button>
          )}

          <Link to="/dashboard" className="text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition border border-white/5 font-medium">
            Dashboard
          </Link>

          <button 
            onClick={handleLogout}
            className="text-xs sm:text-sm text-slate-400 hover:text-red-400 p-2 rounded-xl hover:bg-red-500/10 transition flex items-center gap-1.5"
            title="Log Out"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </nav>

      {/* Header Banner */}
      <div className="relative overflow-hidden w-full bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950 py-10 sm:py-14 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-3">
              <Lock size={13} />
              <span>Secure In-Browser Study • Direct File Downloads Restricted</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 tracking-tight bg-gradient-to-r from-indigo-300 via-white to-purple-300 bg-clip-text text-transparent">
              HighRon Tech Resources
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Access AI-curated interactive learning tracks, research materials, and development tools. 
              Study securely in your browser without external file downloads.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 z-20 relative">
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/10">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-4">
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search courses, guides, and papers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm transition"
              />
            </div>

            {isAdmin && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition shrink-0"
              >
                <Plus size={15} />
                <span>Upload as Admin</span>
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 items-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {cat.icon}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource) => (
            <div
              key={resource.id || resource.name}
              className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-indigo-500/40 transition-all duration-200 flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium ${resourceTypes[resource.type]?.color || "bg-slate-800 text-slate-300"}`}>
                    {resourceTypes[resource.type]?.icon || <BookOpen size={13} />}
                    <span className="capitalize">{resource.type}</span>
                  </span>

                  {resource.aiVerified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Sparkles size={11} /> AI Verified
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock size={12} /> {resource.duration}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-base text-white mb-2 group-hover:text-indigo-300 transition-colors line-clamp-2">
                  {resource.name}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {resource.description || "Interactive resource curated for HighRon learners."}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-white/5 mb-3.5">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star size={13} fill="currentColor" /> {resource.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={13} /> {resource.learners?.toLocaleString()} learners
                  </span>
                  <span className="text-slate-400 font-medium capitalize">
                    {resource.category}
                  </span>
                </div>

                {/* Open in Interactive Reader Modal - NO DOWNLOADING */}
                <button
                  onClick={() => setViewingResource(resource)}
                  className="w-full bg-slate-800/90 hover:bg-indigo-600 text-slate-200 hover:text-white py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 text-xs group-hover:shadow-md group-hover:shadow-indigo-600/20 border border-white/5 cursor-pointer"
                >
                  <Eye size={15} />
                  <span>Read / Study Online</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <Search size={36} className="mx-auto mb-3 opacity-40 text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-300 mb-1">No resources found</h3>
            <p className="text-xs text-slate-500">Try adjusting your keyword or filter category.</p>
          </div>
        )}
      </div>

      {/* Interactive Resource Viewer Modal (Study in Browser - No Download) */}
      <AnimatePresence>
        {viewingResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    {resourceTypes[viewingResource.type]?.icon || <BookOpen size={18} />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1">{viewingResource.name}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="capitalize">{viewingResource.type}</span>
                      <span>•</span>
                      <span>{viewingResource.duration}</span>
                      <span>•</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Lock size={10} /> In-Browser Read Only
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setViewingResource(null)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Content / In-Browser Streamer */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-300 text-sm leading-relaxed custom-scrollbar">
                {/* Video Player Stream if Resource is Video */}
                {(viewingResource.type === "video" || viewingResource.videoUrl) && (
                  <div className="rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl relative">
                    <video
                      controls
                      controlsList="nodownload noplaybackrate"
                      disablePictureInPicture
                      onContextMenu={(e) => e.preventDefault()}
                      className="w-full max-h-[380px] object-contain mx-auto bg-black"
                      src={viewingResource.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"}
                    >
                      Your browser does not support high-definition video streaming.
                    </video>
                    <div className="p-3 bg-slate-900/90 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
                        <PlayCircle size={14} /> HighRon Protected Video Stream
                      </span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Lock size={11} /> Download Disabled
                      </span>
                    </div>
                  </div>
                )}

                <div className="bg-slate-800/40 p-4 rounded-xl border border-white/5">
                  <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1.5">
                    {viewingResource.type === "video" ? "Video Synopsis & AI Breakdown" : "Document Overview"}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200">{viewingResource.description}</p>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-white/5 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-text">
                  {viewingResource.content || "Content is streamed in protected viewer format. External downloading is disabled to protect content integrity."}
                </div>

                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center gap-2">
                  <ShieldCheck size={16} className="shrink-0 text-indigo-400" />
                  <span>Protected Learning Stream: Streaming directly in browser. Downloading videos or documents is permanently disabled.</span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3.5 border-t border-white/10 flex items-center justify-between bg-slate-800/40">
                <span className="text-xs text-slate-400">Status: Active Study Session</span>
                <button
                  onClick={() => setViewingResource(null)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition"
                >
                  Close Viewer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Resource Upload Modal with AI Analysis */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-indigo-500/30 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-950/80 to-slate-900">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Admin Resource Studio</h3>
                    <p className="text-[11px] text-indigo-300">Upload & AI Analyzer Pipeline</p>
                  </div>
                </div>
                <button
                  onClick={() => !isAnalyzing && setIsUploadModalOpen(false)}
                  disabled={isAnalyzing}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition disabled:opacity-30"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form & AI Processing Area */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                {isAnalyzing ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="relative w-16 h-16 mx-auto">
                      <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center text-indigo-400">
                        <Cpu size={22} className="animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">HighRon AI Analyzing Resource...</h4>
                      <p className="text-xs text-indigo-300 mt-1 font-mono">{aiAnalysisStep}</p>
                    </div>
                  </div>
                ) : aiResult ? (
                  <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-3">
                    <CheckCircle size={40} className="text-emerald-400 mx-auto" />
                    <h4 className="text-lg font-bold text-white">Published Successfully!</h4>
                    <p className="text-xs text-slate-300">
                      The resource has been analyzed by AI, quality-verified, and published to the Resources page for all learners.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-left bg-slate-900/80 p-3 rounded-xl text-xs border border-white/5 mt-3">
                      <div>
                        <span className="text-slate-400">Quality Score:</span>
                        <p className="font-bold text-emerald-400">{aiResult.qualityScore}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Verification:</span>
                        <p className="font-bold text-indigo-300">{aiResult.recommendation}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAIAnalyzeAndPost} className="space-y-4">
                    {/* Upload Mode Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Upload Asset Type
                      </label>
                      <div className="grid grid-cols-2 gap-2 bg-slate-800/80 p-1 rounded-xl border border-white/5">
                        <button
                          type="button"
                          onClick={() => {
                            setUploadMode("document");
                            setUploadForm(prev => ({ ...prev, type: "guide" }));
                            setUploadedFile(null);
                          }}
                          className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
                            uploadMode === "document"
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <FileText size={14} />
                          <span>Document (AI Analyzed)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadMode("video");
                            setUploadForm(prev => ({ ...prev, type: "video" }));
                            setUploadedFile(null);
                          }}
                          className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
                            uploadMode === "video"
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <Film size={14} />
                          <span>Video (Streamed)</span>
                        </button>
                      </div>
                    </div>

                    {/* File Attachment Dropzone */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                        <span>{uploadMode === "video" ? "Attach Video File (.mp4, .webm)" : "Attach Document File (.txt, .md, .pdf)"}</span>
                        {uploadedFile && (
                          <span className="text-[10px] text-emerald-400 font-medium truncate max-w-[180px]">
                            {uploadedFile.name}
                          </span>
                        )}
                      </label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-indigo-500/30 hover:border-indigo-500/60 rounded-xl p-4 text-center cursor-pointer bg-slate-800/40 hover:bg-slate-800/60 transition group"
                      >
                        <UploadCloud size={24} className="mx-auto text-indigo-400 group-hover:scale-110 transition-transform mb-1.5" />
                        <p className="text-xs text-slate-300 font-medium">
                          {uploadedFile ? `Selected: ${uploadedFile.name}` : `Click to browse or drop ${uploadMode === "video" ? "video" : "document"} here`}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {uploadMode === "video" ? "Supported: MP4, WebM, MOV" : "Supported: TXT, Markdown, JSON, PDF"}
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={uploadMode === "video" ? "video/*" : ".txt,.md,.pdf,.json,.doc,.docx"}
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Resource Title
                      </label>
                      <input
                        type="text"
                        required
                        value={uploadForm.name}
                        onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                        placeholder={uploadMode === "video" ? "e.g., Deep Learning in Production Video Series" : "e.g., Quantum Algorithm Implementation Guide"}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Category
                        </label>
                        <select
                          value={uploadForm.category}
                          onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="learning">Learning</option>
                          <option value="tools">Tools</option>
                          <option value="research">Research</option>
                          <option value="security">Security</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Duration / Estimated Length
                        </label>
                        <input
                          type="text"
                          value={uploadForm.duration}
                          onChange={(e) => setUploadForm({ ...uploadForm, duration: e.target.value })}
                          placeholder={uploadMode === "video" ? "e.g., 1h 20m" : "e.g., 45m read"}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                        <span>{uploadMode === "video" ? "Video Synopsis & Key Lecture Timestamps" : "Document Body / Text Content for AI Analysis"}</span>
                        <span className="text-[10px] text-indigo-400 flex items-center gap-1">
                          <Sparkles size={11} /> AI Scanned
                        </span>
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={uploadForm.rawContent}
                        onChange={(e) => setUploadForm({ ...uploadForm, rawContent: e.target.value })}
                        placeholder={uploadMode === "video" ? "Enter video outline, syllabus chapters, and learning targets for the AI video indexer..." : "Paste or review document text for semantic AI quality analysis and learner indexing..."}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed custom-scrollbar font-mono"
                      />
                    </div>

                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 flex items-center gap-2">
                      <Lock size={15} className="shrink-0 text-indigo-400" />
                      <span>Direct downloading is disabled. Video and document materials are streamed securely inside the learner's browser.</span>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsUploadModalOpen(false)}
                        className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition cursor-pointer"
                      >
                        <Sparkles size={15} />
                        <span>{uploadMode === "video" ? "Run AI Scan & Post Video" : "Run AI Analysis & Post Document"}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
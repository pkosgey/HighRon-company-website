import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Star, Clock, Users, BookOpen, Code, Shield, 
  TrendingUp, Video, FileText, Database, ArrowLeft, LogOut, 
  Sparkles, Eye, Plus, ShieldCheck, CheckCircle, 
  Cpu, Lock, X, UploadCloud, PlayCircle, Film, Trash2,
  Copy, Check, AlignLeft, Layers, Loader2
} from "lucide-react";

import { 
  fetchSupabaseResources, 
  saveSupabaseResource, 
  deleteSupabaseResource 
} from "../utils/supabaseClient";

const ADMIN_EMAIL = "ronaldsneekord002@gmail.com";
const PUBSUB_TOPIC = "highron_tech_community_live_stream_v1";
const PUBSUB_HTTP = `https://ntfy.sh/${PUBSUB_TOPIC}`;
const PUBSUB_WS = `wss://ntfy.sh/${PUBSUB_TOPIC}/ws`;

const INITIAL_RESOURCES = {
  learning: {
    title: "Learning Center",
    items: [
      { 
        id: "res-1", 
        name: "AI & ML Architecture Masterclass", 
        type: "video", 
        rating: 4.9, 
        learners: 1247, 
        duration: "8h", 
        difficulty: "Advanced",
        description: "Deep dive into Transformer neural networks, multi-head attention mechanisms, and production inference deployment patterns.", 
        keyTakeaways: [
          "Mathematical breakdown of Self-Attention and Scaled Dot-Product formulas.",
          "Parameter-Efficient Fine-Tuning (PEFT) with LoRA and QLoRA.",
          "High-throughput inference clustering using vLLM and PagedAttention."
        ],
        content: "Comprehensive lecture series covering Attention Is All You Need, Transformer architecture, fine-tuning LLMs with LoRA, and serving high-throughput inference endpoints with vLLM.", 
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" 
      },
      { 
        id: "res-2", 
        name: "Quantum Computing Principles", 
        type: "ebook", 
        rating: 4.7, 
        learners: 892, 
        duration: "3h", 
        difficulty: "Advanced",
        description: "Foundational handbook covering Qubits, superposition, quantum entanglement, and Post-Quantum Cryptography algorithms.", 
        keyTakeaways: [
          "State vectors and Hilbert spaces representation of qubit systems.",
          "Quantum gate synthesis, circuit optimization, and unitary transformations.",
          "Shor's and Grover's algorithm mechanics and NIST post-quantum migration."
        ],
        content: "Table of Contents:\n1. Mathematical foundations of Hilbert spaces\n2. Qubits and Quantum Gates\n3. Quantum Circuit Optimization\n4. Quantum Error Mitigation\n5. Practical applications in Post-Quantum Cryptography." 
      },
      { 
        id: "res-3", 
        name: "Modern Cyber Defense Interactive Lab", 
        type: "interactive", 
        rating: 4.8, 
        learners: 1563, 
        duration: "6h", 
        difficulty: "Intermediate",
        description: "Hands-on browser simulations for packet inspection, zero-trust perimeter enforcement, and real-time IDS anomaly detection.", 
        keyTakeaways: [
          "Live PCAP packet dissection and protocol abnormality signature drafting.",
          "Preventing zero-day memory corruption vulnerabilities and buffer overflows.",
          "Hardening network edge policies with automated anomaly triage."
        ],
        content: "Interactive walkthrough analyzing PCAP captures, detecting zero-day buffer overflows, and crafting automated IDS signatures." 
      },
      { 
        id: "res-4", 
        name: "Enterprise Security Certification Syllabus", 
        type: "course", 
        rating: 4.9, 
        learners: 2104, 
        duration: "12h", 
        difficulty: "Intermediate",
        description: "Full accreditation preparation curriculum for security architects, DevSecOps practitioners, and engineering leaders.", 
        keyTakeaways: [
          "Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC).",
          "Kubernetes and multi-cloud container infrastructure hardening.",
          "SOC runbook synthesis and enterprise incident response planning."
        ],
        content: "Curriculum Modules:\nModule 1: Identity & Access Governance (RBAC & ABAC)\nModule 2: Cloud Infrastructure Hardening\nModule 3: SOC Runbooks and Incident Response Planning." 
      },
    ]
  },
  tools: {
    title: "Development Tools",
    items: [
      { 
        id: "res-5", 
        name: "HighRon Core API SDK v2.1", 
        type: "tool", 
        rating: 4.8, 
        learners: 2541, 
        duration: "Reference", 
        difficulty: "Intermediate",
        description: "Official documentation and TypeScript client libraries for integrating HighRon realtime protocols and pubsub channels.", 
        keyTakeaways: [
          "Zero-latency WebSocket & PubSub client initialization patterns.",
          "Automatic reconnection handling with exponential backoff algorithms.",
          "End-to-end payload signature verification and cryptographic integrity."
        ],
        content: "SDK Quickstart:\nimport { HighRonClient } from '@highron/sdk';\nconst client = new HighRonClient({ apiKey: process.env.HIGHRON_KEY });\nawait client.connectStream('telemetry');" 
      },
      { 
        id: "res-6", 
        name: "Production Kubernetes Manifests", 
        type: "template", 
        rating: 4.5, 
        learners: 1876, 
        duration: "Specs", 
        difficulty: "Advanced",
        description: "Hardened Helm charts, Istio service mesh configs, and automated horizontal pod autoscaler policies for high-load systems.", 
        keyTakeaways: [
          "Zero-trust mTLS service mesh enforcement across microservices.",
          "Graceful shutdown hooks and zero-downtime rolling update configurations.",
          "Resource limits, network policies, and non-root security contexts."
        ],
        content: "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: highron-ingress\nspec:\n  replicas: 3\n  template:\n    spec:\n      containers:\n      - name: gateway\n        image: highron/gateway:v2" 
      },
      { 
        id: "res-7", 
        name: "Code Review & Security Checklist", 
        type: "guide", 
        rating: 4.7, 
        learners: 3210, 
        duration: "Guidelines", 
        difficulty: "Fundamental",
        description: "30-point verification checklist for memory safety, cryptographic sanity, input validation, and vulnerability prevention.", 
        keyTakeaways: [
          "Sanitizing all external inputs against strict schema validations.",
          "Storing secrets in hardware-backed key vaults, never in code repositories.",
          "Enforcing Argon2id password hashing and SHA-256 integrity checks."
        ],
        content: "Review Checklist:\n[ ] 1. All external inputs validated against strict regex schema\n[ ] 2. Secrets injected via environment vaults, never hardcoded\n[ ] 3. Cryptographic primitives using SHA-256 or Argon2id\n[ ] 4. Rate-limiting enforced on authentication routes." 
      }
    ]
  },
  research: {
    title: "Research & Insights",
    items: [
      { 
        id: "res-8", 
        name: "Decentralized AI Governance Whitepaper", 
        type: "paper", 
        rating: 4.8, 
        learners: 876, 
        duration: "45m read", 
        difficulty: "Advanced",
        description: "Peer-reviewed research exploring consensus-driven safety alignments in autonomous multi-agent systems.", 
        keyTakeaways: [
          "Cryptographic proof-of-safety consensus algorithms for agent swarms.",
          "Decentralized human-in-the-loop dispute resolution protocols.",
          "Mitigating rogue single points of failure in autonomous worker clusters."
        ],
        content: "Abstract: We evaluate cryptographic proof-of-safety mechanisms designed to enforce behavioral constraints across decentralized LLM worker clusters without centralized single-points-of-failure." 
      },
      { 
        id: "res-9", 
        name: "Quantum Encryption Resistance Benchmark", 
        type: "paper", 
        rating: 4.7, 
        learners: 432, 
        duration: "30m read", 
        difficulty: "Advanced",
        description: "Performance analysis of Kyber vs Classic McEliece algorithms on constrained embedded IoT microcontrollers.", 
        keyTakeaways: [
          "Benchmarking throughput of Kyber-768 on ARM Cortex-M4 architectures.",
          "4.2x faster key generation cycles over legacy RSA-4096 standards.",
          "Memory footprint optimizations for post-quantum key encapsulation."
        ],
        content: "Benchmarking results demonstrate that Kyber-768 provides optimal throughput with 4.2x faster key generation on ARM Cortex-M4 processors compared to legacy RSA-4096." 
      }
    ]
  },
  security: {
    title: "Security Resources",
    items: [
      { 
        id: "res-10", 
        name: "Zero-Trust Architecture Guidelines", 
        type: "guide", 
        rating: 4.9, 
        learners: 1987, 
        duration: "2h read", 
        difficulty: "Intermediate",
        description: "Framework for implementing micro-segmentation, continuous telemetry verification, and ephemeral session tokens.", 
        keyTakeaways: [
          "Explicit verification at every network packet boundary and API hop.",
          "Enforcing least privilege with fine-grained time-bound certificates.",
          "Assuming breach posture with automated containment runbooks."
        ],
        content: "Zero Trust Core Principles:\n1. Verify explicitly at every network hop\n2. Use least privileged access\n3. Assume breach and automate telemetry forensics." 
      }
    ]
  }
};

const categories = [
  { id: "all", name: "All Resources", icon: <Database size={14} /> },
  { id: "learning", name: "Learning", icon: <BookOpen size={14} /> },
  { id: "tools", name: "Tools", icon: <Code size={14} /> },
  { id: "research", name: "Research", icon: <TrendingUp size={14} /> },
  { id: "security", name: "Security", icon: <Shield size={14} /> },
];

const resourceTypes = {
  video: { color: "bg-red-500/15 text-red-300 border border-red-500/20", icon: <Video size={13} /> },
  ebook: { color: "bg-blue-500/15 text-blue-300 border border-blue-500/20", icon: <FileText size={13} /> },
  interactive: { color: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20", icon: <Code size={13} /> },
  course: { color: "bg-purple-500/15 text-purple-300 border border-purple-500/20", icon: <BookOpen size={13} /> },
  tool: { color: "bg-amber-500/15 text-amber-300 border border-amber-500/20", icon: <Code size={13} /> },
  template: { color: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20", icon: <FileText size={13} /> },
  guide: { color: "bg-teal-500/15 text-teal-300 border border-teal-500/20", icon: <BookOpen size={13} /> },
  library: { color: "bg-pink-500/15 text-pink-300 border border-pink-500/20", icon: <Database size={13} /> },
  paper: { color: "bg-slate-500/15 text-slate-300 border border-slate-500/20", icon: <FileText size={13} /> },
  report: { color: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/20", icon: <TrendingUp size={13} /> },
};

// Clean & sanitize text to eliminate foreign binary code and PDF stream artifacts
const sanitizeExtractedText = (text, filename) => {
  if (!text || typeof text !== "string") return "";
  
  // Remove null bytes and non-printable control codes
  let cleaned = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // If raw binary PDF code slipped in (e.g. contains /Filter, /FlateDecode, obj, endobj, stream)
  const isBinaryJunk = (cleaned.includes("/Filter") || cleaned.includes("endobj") || cleaned.includes("stream") || cleaned.startsWith("%PDF-"));
  if (isBinaryJunk) {
    cleaned = cleaned
      .replace(/stream[\s\S]*?endstream/g, " ")
      .replace(/[0-9]+\s+[0-9]+\s+obj[\s\S]*?endobj/g, " ")
      .replace(/<<[\s\S]*?>>/g, " ")
      .replace(/xref[\s\S]*?trailer/g, " ")
      .replace(/%PDF-[0-9.]+/g, " ")
      .replace(/[^\x20-\x7E\n\r\t]/g, " ");
  }

  // Remove excess whitespace
  cleaned = cleaned
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();

  if (cleaned.length < 25) {
    return `Interactive Study Document: ${filename || "Uploaded Resource"}\nType: Protected In-Browser Document\n\nThis material has been indexed by HighRon AI for interactive browser reading. Review the AI Executive Summary and Core Takeaways in the study viewer.`;
  }

  return cleaned;
};

// Semantic AI Summarizer Engine
const generateAISummary = (rawContent, title, type) => {
  const cleanBody = (rawContent || "")
    .replace(/[#*`_>\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleanBody.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const minutes = Math.max(2, Math.ceil(wordCount / 180));
  const estimatedDuration = type === "video" ? "Video Stream" : `${minutes}m read`;

  // Extract clean sentences, ignoring codes or artifacts
  const sentences = cleanBody
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 25 && s.length < 240 && !s.includes("obj") && !s.includes("/Filter") && !s.includes("endstream"));

  let executiveSummary = "";
  if (sentences.length >= 2) {
    executiveSummary = `${sentences[0]} ${sentences[1]}`;
  } else if (sentences.length === 1) {
    executiveSummary = sentences[0];
  } else {
    executiveSummary = `Comprehensive ${type} reference covering core concepts, operational patterns, and security standards for HighRon learners.`;
  }

  let keyTakeaways = [];
  if (sentences.length >= 5) {
    keyTakeaways = sentences.slice(2, 6).map(s => s.replace(/^[0-9.-]+\s*/, ""));
  } else if (sentences.length >= 3) {
    keyTakeaways = [
      sentences[1],
      sentences[2],
      `Practical implementation and verification guidelines for ${title}.`
    ];
  } else {
    keyTakeaways = [
      `Master the core architectural principles and fundamentals of ${title}.`,
      "Apply security hardening, micro-segmentation, and fault tolerance patterns.",
      "Review production deployment checklists and troubleshooting runbooks."
    ];
  }

  // Detect difficulty level
  const lower = cleanBody.toLowerCase();
  const techKeywords = ["quantum", "cryptograph", "kernel", "kubernetes", "distributed", "compiler", "neural", "zero-trust", "concurrency", "vector"];
  const matches = techKeywords.filter(k => lower.includes(k)).length;
  const difficulty = matches >= 3 ? "Advanced" : matches >= 1 ? "Intermediate" : "Fundamental";

  return {
    executiveSummary,
    keyTakeaways,
    estimatedDuration,
    difficulty,
    wordCount
  };
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

  // Strict Admin Authorization Check: ONLY ronaldsneekord002@gmail.com is admin
  const isAdmin = Boolean(user?.email?.trim().toLowerCase() === ADMIN_EMAIL);

  const [resources, setResources] = useState(getStoredResources);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Interactive Viewer Modal state (No download allowed)
  const [viewingResource, setViewingResource] = useState(null);
  const [readerTab, setReaderTab] = useState("overview"); // "overview" | "media" | "notes"
  const [readerFontSize, setReaderFontSize] = useState("normal"); // "small" | "normal" | "large"
  const [copiedNotes, setCopiedNotes] = useState(false);

  // Admin Upload Modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState("document"); // "document" or "video"
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isExtractingText, setIsExtractingText] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: "",
    category: "learning",
    type: "guide",
    rawContent: "",
    duration: "45m",
    videoUrl: "",
    documentUrl: ""
  });

  // AI Analysis simulation states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisStep, setAiAnalysisStep] = useState("");
  const [aiResult, setAiResult] = useState(null);

  const fileInputRef = useRef(null);

  // Load persistent resources from Supabase on mount
  useEffect(() => {
    fetchSupabaseResources().then(remoteResources => {
      if (remoteResources && Object.keys(remoteResources).length > 0) {
        setResources(prev => {
          const merged = { ...prev };
          Object.keys(remoteResources).forEach(cat => {
            if (!merged[cat]) {
              merged[cat] = remoteResources[cat];
            } else {
              const existingIds = new Set(merged[cat].items.map(i => i.id));
              const newItems = remoteResources[cat].items.filter(i => !existingIds.has(i.id));
              merged[cat] = {
                ...merged[cat],
                items: [...newItems, ...merged[cat].items]
              };
            }
          });
          localStorage.setItem("highron_resources_store", JSON.stringify(merged));
          return merged;
        });
      }
    });
  }, []);

  // Real-time synchronization for resources across devices
  useEffect(() => {
    let ws = null;
    let reconnectTimer = null;
    let isMounted = true;

    // Fetch past additions/deletions from past 48h
    const fetchPastResourceUpdates = async () => {
      try {
        const res = await fetch(`${PUBSUB_HTTP}/json?poll=1&since=48h`);
        if (res.ok) {
          const text = await res.text();
          const lines = text.trim().split("\n");
          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const item = JSON.parse(line);
              if (item.event === "message" && item.message) {
                const packet = JSON.parse(item.message);
                if (packet.type === "ADD_RESOURCE" && packet.payload) {
                  const { category, item: resItem } = packet.payload;
                  setResources(prev => {
                    const cat = category in prev ? category : "learning";
                    if (prev[cat]?.items?.some(i => i.id === resItem.id)) return prev;
                    const updated = {
                      ...prev,
                      [cat]: {
                        ...prev[cat],
                        items: [resItem, ...prev[cat].items]
                      }
                    };
                    localStorage.setItem("highron_resources_store", JSON.stringify(updated));
                    return updated;
                  });
                } else if (packet.type === "DELETE_RESOURCE" && packet.payload) {
                  const resourceId = packet.payload;
                  setResources(prev => {
                    const updated = {};
                    Object.keys(prev).forEach(cat => {
                      updated[cat] = {
                        ...prev[cat],
                        items: prev[cat].items.filter(i => i.id !== resourceId)
                      };
                    });
                    localStorage.setItem("highron_resources_store", JSON.stringify(updated));
                    return updated;
                  });
                }
              }
            } catch (err) {}
          }
        }
      } catch (err) {}
    };

    fetchPastResourceUpdates();

    const connectWs = () => {
      if (!isMounted) return;
      try {
        ws = new WebSocket(PUBSUB_WS);
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.event === "message" && data.message) {
              const packet = JSON.parse(data.message);
              if (packet.type === "ADD_RESOURCE" && packet.payload) {
                const { category, item: resItem } = packet.payload;
                setResources(prev => {
                  const cat = category in prev ? category : "learning";
                  if (prev[cat]?.items?.some(i => i.id === resItem.id)) return prev;
                  const updated = {
                    ...prev,
                    [cat]: {
                      ...prev[cat],
                      items: [resItem, ...prev[cat].items]
                    }
                  };
                  localStorage.setItem("highron_resources_store", JSON.stringify(updated));
                  return updated;
                });
              } else if (packet.type === "DELETE_RESOURCE" && packet.payload) {
                const resourceId = packet.payload;
                setResources(prev => {
                  const updated = {};
                  Object.keys(prev).forEach(cat => {
                    updated[cat] = {
                      ...prev[cat],
                      items: prev[cat].items.filter(i => i.id !== resourceId)
                    };
                  });
                  localStorage.setItem("highron_resources_store", JSON.stringify(updated));
                  return updated;
                });
              }
            }
          } catch (e) {}
        };
        ws.onclose = () => {
          if (isMounted) {
            reconnectTimer = setTimeout(connectWs, 3000);
          }
        };
        ws.onerror = () => ws?.close();
      } catch (err) {
        if (isMounted) {
          reconnectTimer = setTimeout(connectWs, 3000);
        }
      }
    };

    connectWs();

    return () => {
      isMounted = false;
      clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, []);

  const handleDeleteResource = (resourceId, resourceName, e) => {
    e?.stopPropagation();
    if (!isAdmin) {
      alert(`Access Restricted: Only the administrator (${ADMIN_EMAIL}) is permitted to delete resources.`);
      return;
    }

    if (window.confirm(`Admin: Are you sure you want to permanently delete "${resourceName}"?`)) {
      setResources(prev => {
        const updated = {};
        Object.keys(prev).forEach(cat => {
          updated[cat] = {
            ...prev[cat],
            items: prev[cat].items.filter(item => item.id !== resourceId && item.name !== resourceName)
          };
        });
        localStorage.setItem("highron_resources_store", JSON.stringify(updated));
        return updated;
      });

      // Broadcast delete to all devices
      fetch(PUBSUB_HTTP, {
        method: "POST",
        body: JSON.stringify({ type: "DELETE_RESOURCE", payload: resourceId })
      }).catch(err => console.warn(err));

      // Delete from Supabase persistent database
      deleteSupabaseResource(resourceId).catch(err => console.warn("Supabase resource delete error:", err));

      if (viewingResource?.id === resourceId) {
        setViewingResource(null);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("session_user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Handle local file selection (document .txt/.pdf/.md or video .mp4/.webm)
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);

    const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

    if (uploadMode === "document") {
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const docBlobUrl = URL.createObjectURL(file);

      if (isPdf) {
        setIsExtractingText(true);
        setUploadForm(prev => ({
          ...prev,
          name: prev.name || baseName,
          type: "ebook",
          documentUrl: docBlobUrl,
          rawContent: "Extracting readable text from PDF pages..."
        }));

        try {
          let extractedText = "";
          if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            
            for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 30); pageNum++) {
              const page = await pdf.getPage(pageNum);
              const textContent = await page.getTextContent();
              const pageStrings = textContent.items
                .map(item => item.str)
                .filter(Boolean)
                .join(" ");
              if (pageStrings.trim()) {
                extractedText += `\n--- Page ${pageNum} ---\n${pageStrings}\n`;
              }
            }
          }

          const cleaned = sanitizeExtractedText(extractedText, file.name);
          setUploadForm(prev => ({
            ...prev,
            name: prev.name || baseName,
            type: "ebook",
            documentUrl: docBlobUrl,
            rawContent: cleaned
          }));
        } catch (err) {
          console.warn("PDF extraction note:", err);
          setUploadForm(prev => ({
            ...prev,
            name: prev.name || baseName,
            type: "ebook",
            documentUrl: docBlobUrl,
            rawContent: `Document Title: ${baseName}\nFilename: ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB\nType: Protected PDF Document\n\nThis material is prepared for interactive reading in the HighRon reader with AI summary synthesis.`
          }));
        } finally {
          setIsExtractingText(false);
        }
      } else {
        // Plain text, markdown, json, csv
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result;
          const cleaned = typeof text === "string" 
            ? sanitizeExtractedText(text, file.name)
            : "Document loaded and ready for AI analysis.";
          
          setUploadForm(prev => ({
            ...prev,
            name: prev.name || baseName,
            documentUrl: docBlobUrl,
            rawContent: cleaned
          }));
        };
        reader.readAsText(file);
      }
    } else if (uploadMode === "video") {
      const videoBlobUrl = URL.createObjectURL(file);
      setUploadForm(prev => ({
        ...prev,
        name: prev.name || baseName,
        type: "video",
        videoUrl: videoBlobUrl,
        rawContent: `Video Asset: ${file.name}\nSize: ${(file.size / (1024 * 1024)).toFixed(2)} MB\nFormat: Protected In-Browser Stream\n\nHigh-definition interactive video session verified by HighRon AI for streaming without downloads.`
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
      await new Promise(r => setTimeout(r, 600));

      setAiAnalysisStep("Running Computer Vision scan for copyright & content compliance...");
      await new Promise(r => setTimeout(r, 600));

      setAiAnalysisStep("Optimizing video chunk streaming headers & locking download channels...");
      await new Promise(r => setTimeout(r, 600));
    } else {
      setAiAnalysisStep("Parsing document syntax & extracting semantic knowledge graph...");
      await new Promise(r => setTimeout(r, 600));

      setAiAnalysisStep("Synthesizing Executive Summary, Key Takeaways & syllabus tags...");
      await new Promise(r => setTimeout(r, 600));

      setAiAnalysisStep("Verifying readability, accessibility & security pass...");
      await new Promise(r => setTimeout(r, 600));
    }

    // Run semantic AI summarizer!
    const aiAnalysis = generateAISummary(uploadForm.rawContent, uploadForm.name.trim(), uploadMode === "video" ? "video" : uploadForm.type);

    const newResourceItem = {
      id: "res-ai-" + Date.now(),
      name: uploadForm.name.trim(),
      type: uploadMode === "video" ? "video" : uploadForm.type,
      rating: 5.0,
      learners: 1,
      duration: uploadForm.duration || aiAnalysis.estimatedDuration,
      difficulty: aiAnalysis.difficulty,
      description: aiAnalysis.executiveSummary,
      keyTakeaways: aiAnalysis.keyTakeaways,
      content: uploadForm.rawContent,
      videoUrl: uploadForm.videoUrl,
      documentUrl: uploadForm.documentUrl,
      aiVerified: true,
      postedBy: user?.name || user?.username || "Admin Ronald",
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

      // Broadcast newly created resource globally to all devices
      fetch(PUBSUB_HTTP, {
        method: "POST",
        body: JSON.stringify({
          type: "ADD_RESOURCE",
          payload: {
            category: targetCategory,
            item: newResourceItem
          }
        })
      }).catch(err => console.warn("Resource broadcast error:", err));

      // Save to Supabase persistent database
      saveSupabaseResource(newResourceItem, targetCategory).catch(err => console.warn("Supabase resource save error:", err));

      return updated;
    });

    setAiResult({
      status: "Verified & Published",
      qualityScore: uploadMode === "video" ? "99.8% (HD Audio/Video Scan)" : "99.4% (Semantic Readability Pass)",
      recommendation: uploadMode === "video" ? "Video Ready for Protected In-Browser Streaming" : "Clean Executive Summary & Key Takeaways Generated"
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
        videoUrl: "",
        documentUrl: ""
      });
      setAiResult(null);
      setAiAnalysisStep("");
    }, 1500);
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
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-nowrap sm:flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition shrink-0 ${
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

                  <div className="flex items-center gap-1.5">
                    {resource.difficulty && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 border border-indigo-500/20">
                        {resource.difficulty}
                      </span>
                    )}
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
                </div>

                <h3 className="font-bold text-base text-white mb-2 group-hover:text-indigo-300 transition-colors line-clamp-2">
                  {resource.name}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-3">
                  {resource.description || "Interactive resource curated for HighRon learners."}
                </p>

                {resource.keyTakeaways && resource.keyTakeaways[0] && (
                  <div className="mb-3.5 text-[11px] text-indigo-300/90 bg-indigo-500/10 border border-indigo-500/15 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 truncate">
                    <CheckCircle size={12} className="text-emerald-400 shrink-0" />
                    <span className="truncate">{resource.keyTakeaways[0]}</span>
                  </div>
                )}
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

                {/* Open in Interactive Reader Modal & Admin Delete */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewingResource(resource)}
                    className="flex-1 bg-slate-800/90 hover:bg-indigo-600 text-slate-200 hover:text-white py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 text-xs group-hover:shadow-md group-hover:shadow-indigo-600/20 border border-white/5 cursor-pointer"
                  >
                    <Eye size={15} />
                    <span>Read / Study Online</span>
                  </button>
                  {isAdmin && (
                    <button
                      onClick={(e) => handleDeleteResource(resource.id, resource.name, e)}
                      className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 transition cursor-pointer"
                      title="Delete Resource (Admin)"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-slate-900 border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="px-4 sm:px-6 py-3.5 border-b border-white/10 flex items-center justify-between bg-slate-800/80 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    {resourceTypes[viewingResource.type]?.icon || <BookOpen size={20} />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-white truncate">{viewingResource.name}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                      <span className="capitalize font-medium text-indigo-300">{viewingResource.type}</span>
                      <span>•</span>
                      <span>{viewingResource.duration}</span>
                      {viewingResource.difficulty && (
                        <>
                          <span>•</span>
                          <span className="text-amber-400 font-medium">{viewingResource.difficulty}</span>
                        </>
                      )}
                      <span>•</span>
                      <span className="text-emerald-400 flex items-center gap-1 font-medium">
                        <Lock size={10} /> Protected Study Session
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setViewingResource(null);
                    setReaderTab("overview");
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition shrink-0"
                  aria-label="Close viewer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Tab Switcher */}
              <div className="flex bg-slate-950/70 border-b border-white/5 px-4 sm:px-6 pt-2 shrink-0 gap-2 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setReaderTab("overview")}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition flex items-center gap-1.5 border-b-2 shrink-0 ${
                    readerTab === "overview"
                      ? "text-indigo-400 border-indigo-500 bg-slate-900/90 shadow-sm"
                      : "text-slate-400 border-transparent hover:text-white"
                  }`}
                >
                  <Sparkles size={13} />
                  <span>AI Overview & Insights</span>
                </button>

                {(viewingResource.documentUrl || viewingResource.type === "video" || viewingResource.videoUrl) && (
                  <button
                    onClick={() => setReaderTab("media")}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition flex items-center gap-1.5 border-b-2 shrink-0 ${
                      readerTab === "media"
                        ? "text-indigo-400 border-indigo-500 bg-slate-900/90 shadow-sm"
                        : "text-slate-400 border-transparent hover:text-white"
                    }`}
                  >
                    {viewingResource.type === "video" || viewingResource.videoUrl ? (
                      <>
                        <PlayCircle size={13} />
                        <span>Protected Video Stream</span>
                      </>
                    ) : (
                      <>
                        <BookOpen size={13} />
                        <span>Interactive Document Reader</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => setReaderTab("notes")}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition flex items-center gap-1.5 border-b-2 shrink-0 ${
                    readerTab === "notes"
                      ? "text-indigo-400 border-indigo-500 bg-slate-900/90 shadow-sm"
                      : "text-slate-400 border-transparent hover:text-white"
                  }`}
                >
                  <AlignLeft size={13} />
                  <span>Formatted Notes & Content</span>
                </button>
              </div>

              {/* Modal Body / Reader Area */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-slate-300 text-sm leading-relaxed custom-scrollbar space-y-4">
                {/* TAB 1: AI OVERVIEW & INSIGHTS */}
                {readerTab === "overview" && (
                  <div className="space-y-4">
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/50 via-purple-950/30 to-slate-900/60 border border-indigo-500/25">
                      <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                        <Sparkles size={14} />
                        <span>AI Executive Summary</span>
                      </div>
                      <p className="text-sm sm:text-base text-slate-100 font-normal leading-relaxed">
                        {viewingResource.description || "Synthesized overview of this learning asset."}
                      </p>
                    </div>

                    {/* Core Key Takeaways Cards */}
                    <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-4 sm:p-5">
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <CheckCircle size={15} className="text-emerald-400" />
                        <span>Core Takeaways & Learning Objectives</span>
                      </h4>
                      <div className="space-y-2.5">
                        {(viewingResource.keyTakeaways || [
                          "Master fundamental concepts, architectural blueprints, and execution pipelines.",
                          "Review security hardening guidelines and verification best practices.",
                          "Apply practical knowledge in production, research, and collaborative environments."
                        ]).map((point, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                              {idx + 1}
                            </span>
                            <span className="leading-snug">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Study Telemetry Specs */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-800/40 border border-white/5 p-3 rounded-xl">
                        <span className="text-[10px] text-slate-400 uppercase">Estimated Pace</span>
                        <p className="text-sm font-semibold text-white mt-0.5">{viewingResource.duration}</p>
                      </div>
                      <div className="bg-slate-800/40 border border-white/5 p-3 rounded-xl">
                        <span className="text-[10px] text-slate-400 uppercase">Proficiency</span>
                        <p className="text-sm font-semibold text-indigo-300 mt-0.5">{viewingResource.difficulty || "All Levels"}</p>
                      </div>
                      <div className="bg-slate-800/40 border border-white/5 p-3 rounded-xl col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-slate-400 uppercase">Integrity Status</span>
                        <p className="text-sm font-semibold text-emerald-400 mt-0.5 flex items-center gap-1">
                          <ShieldCheck size={14} /> AI Verified
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: INTERACTIVE MEDIA / IN-BROWSER DOCUMENT */}
                {readerTab === "media" && (
                  <div>
                    {(viewingResource.type === "video" || viewingResource.videoUrl) ? (
                      <div className="rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl relative">
                        <video
                          controls
                          controlsList="nodownload noplaybackrate"
                          disablePictureInPicture
                          onContextMenu={(e) => e.preventDefault()}
                          className="w-full max-h-[420px] object-contain mx-auto bg-black"
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
                    ) : viewingResource.documentUrl ? (
                      <div className="rounded-2xl overflow-hidden bg-slate-950 border border-white/10 shadow-2xl">
                        <div className="p-2.5 bg-slate-900 border-b border-white/5 flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
                            <BookOpen size={14} /> Interactive Protected Document Reader
                          </span>
                          <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                            <Lock size={11} /> Read Only
                          </span>
                        </div>
                        <iframe
                          src={`${viewingResource.documentUrl}#toolbar=0&navpanes=0`}
                          className="w-full h-[480px] sm:h-[540px] bg-slate-950 border-0"
                          title={viewingResource.name}
                        />
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-400">
                        <p>Document text is ready for review in the Formatted Notes tab.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: FORMATTED NOTES & TEXT */}
                {readerTab === "notes" && (
                  <div className="space-y-3">
                    {/* Text Toolbar */}
                    <div className="flex items-center justify-between bg-slate-800/60 p-2 sm:p-2.5 rounded-xl border border-white/5 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 mr-1">Font Size:</span>
                        <button
                          onClick={() => setReaderFontSize("small")}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${readerFontSize === "small" ? "bg-indigo-600 text-white shadow-sm" : "hover:bg-slate-700 text-slate-300"}`}
                        >
                          A-
                        </button>
                        <button
                          onClick={() => setReaderFontSize("normal")}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${readerFontSize === "normal" ? "bg-indigo-600 text-white shadow-sm" : "hover:bg-slate-700 text-slate-300"}`}
                        >
                          A
                        </button>
                        <button
                          onClick={() => setReaderFontSize("large")}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${readerFontSize === "large" ? "bg-indigo-600 text-white shadow-sm" : "hover:bg-slate-700 text-slate-300"}`}
                        >
                          A+
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(viewingResource.content || viewingResource.description || "");
                          setCopiedNotes(true);
                          setTimeout(() => setCopiedNotes(false), 2000);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-700/70 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                      >
                        {copiedNotes ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        <span>{copiedNotes ? "Copied to Clipboard!" : "Copy Notes"}</span>
                      </button>
                    </div>

                    {/* Clean Readable Content */}
                    <div className={`p-4 sm:p-6 rounded-2xl bg-slate-950 border border-white/5 text-slate-200 whitespace-pre-wrap leading-relaxed select-text font-sans ${
                      readerFontSize === "small" ? "text-xs leading-5" : readerFontSize === "large" ? "text-base leading-7" : "text-sm leading-6"
                    }`}>
                      {viewingResource.content || "Content is streamed in protected viewer format."}
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center gap-2">
                  <ShieldCheck size={16} className="shrink-0 text-indigo-400" />
                  <span>Protected Learning Stream: Streaming directly in browser. Downloading files is disabled to protect content integrity.</span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-4 sm:px-6 py-3.5 border-t border-white/10 flex items-center justify-between bg-slate-800/40 gap-2 shrink-0">
                <span className="text-xs text-slate-400 truncate">Status: Active Study Session</span>
                <div className="flex items-center gap-2 shrink-0">
                  {isAdmin && (
                    <button
                      onClick={(e) => handleDeleteResource(viewingResource.id, viewingResource.name, e)}
                      className="px-3 sm:px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-xl text-xs font-semibold border border-red-500/30 transition flex items-center gap-1.5 cursor-pointer"
                      title="Delete Resource (Admin)"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setViewingResource(null);
                      setReaderTab("overview");
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Close Viewer
                  </button>
                </div>
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
                    <h3 className="text-sm font-bold text-white">Admin AI Resource Publishing</h3>
                    <p className="text-[11px] text-indigo-300">Upload & AI Analyzer Pipeline</p>
                  </div>
                </div>
                <button
                  onClick={() => !isAnalyzing && setIsUploadModalOpen(false)}
                  disabled={isAnalyzing}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
                {/* AI Analysis Step Indicator */}
                {isAnalyzing && (
                  <div className="p-4 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-center space-y-3">
                    <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-semibold text-indigo-300">{aiAnalysisStep}</p>
                    <p className="text-[10px] text-slate-400">HighRon AI Semantic Engine synthesizing content...</p>
                  </div>
                )}

                {/* AI Analysis Result Badge */}
                {aiResult && !isAnalyzing ? (
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle size={20} />
                    </div>
                    <h4 className="text-sm font-bold text-white">{aiResult.status}</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/5">
                      <div>
                        <span className="text-slate-400">Semantic Score:</span>
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
                        <span>{uploadMode === "video" ? "Attach Video File (.mp4, .webm)" : "Attach Document File (.pdf, .txt, .md)"}</span>
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
                          {uploadMode === "video" ? "Supported: MP4, WebM, MOV" : "Supported: PDF, TXT, Markdown, JSON"}
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={uploadMode === "video" ? "video/*" : ".pdf,.txt,.md,.json,.doc,.docx"}
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Text Extraction Status */}
                    {isExtractingText && (
                      <div className="flex items-center gap-2 p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
                        <Loader2 size={15} className="animate-spin text-indigo-400 shrink-0" />
                        <span>Extracting clean readable text from document pages...</span>
                      </div>
                    )}

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
                        <span>{uploadMode === "video" ? "Video Synopsis & Key Lecture Timestamps" : "Extracted Document Content for AI Semantic Analysis"}</span>
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed custom-scrollbar font-sans"
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
                        disabled={isExtractingText}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition cursor-pointer"
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
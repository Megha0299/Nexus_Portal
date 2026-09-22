"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Briefcase,
  Users,
  PlusCircle,
  Trash2,
  Edit3,
  ExternalLink,
  LogOut,
  UploadCloud,
  Search,
  CheckCircle2,
  X,
  Mail,
  Phone,
  Building,
} from "lucide-react";
import {
  useJobs,
  useEvents,
  addJob,
  deleteJob,
  updateJob,
  addEvent,
  deleteEvent,
  updateEvent,
  type JobPost,
  type EventPost,
} from "../../lib/cmsStore";
import { db } from "../../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { companyInfo } from "../../data/robowebData";

interface Inquiry {
  id: string;
  type?: string;
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  selection?: string;
  message?: string;
  status?: string;
  createdAt?: any;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"inquiries" | "events" | "jobs">("inquiries");

  // Inquiries State from Firestore
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);

  // Auth Verification
  useEffect(() => {
    const isAuth = document.cookie
      .split("; ")
      .find((row) => row.startsWith("admin_auth="))
      ?.split("=")[1];

    if (isAuth !== "true") {
      router.replace("/admin/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  // Real-time Firestore Listener for Inquiries
  useEffect(() => {
    if (!authorized) return;

    try {
      const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Inquiry[];
          setInquiries(list);
          setLoadingInquiries(false);
        },
        (err) => {
          console.error("Firestore inquiry listener error:", err);
          setLoadingInquiries(false);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.error(e);
      setLoadingInquiries(false);
    }
  }, [authorized]);

  const handleLogout = () => {
    document.cookie = "admin_auth=; path=/; max-age=0";
    router.replace("/admin/login");
  };

  const jobs = useJobs();
  const events = useEvents();

  const [searchTerm, setSearchTerm] = useState("");

  // ===================== EVENT STATE & EDITING =====================
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventSummary, setEventSummary] = useState("");
  const [eventDatetime, setEventDatetime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventType, setEventType] = useState<EventPost["type"]>("Hackathon");
  const [eventStatus, setEventStatus] = useState<EventPost["status"]>("Upcoming");
  const [registrationLink, setRegistrationLink] = useState("");
  const [eventImages, setEventImages] = useState<string[]>([]);
  const eventFileInputRef = useRef<HTMLInputElement>(null);

  // ===================== JOB STATE & EDITING =====================
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDepartment, setJobDepartment] = useState("Engineering");
  const [jobType, setJobType] = useState<string>("Full Time");
  const [jobLocation, setJobLocation] = useState("Madurai");
  const [jobExperience, setJobExperience] = useState("1-3 years");
  const [jobDescription, setJobDescription] = useState("");
  const [jobSkills, setJobSkills] = useState("");
  const [jobImageBase64, setJobImageBase64] = useState<string>("");
  const jobFileInputRef = useRef<HTMLInputElement>(null);

  // Multiple File to Base64 Converters for Events
  const handleEventImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setEventImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeEventImage = (indexToRemove: number) => {
    setEventImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleJobImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setJobImageBase64(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Event Form Submit (Add or Edit)
  const handleCreateOrUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const payload = {
      title: eventTitle,
      summary: eventSummary,
      datetime: eventDatetime,
      location: eventLocation,
      type: eventType,
      status: eventStatus,
      registrationLink: registrationLink || "https://www.robowebtechnologies.co.in",
      image: eventImages[0] || "",
      images: eventImages,
    };

    if (editingEventId) {
      updateEvent(editingEventId, payload);
      setEditingEventId(null);
    } else {
      addEvent(payload);
    }

    setEventTitle("");
    setEventSummary("");
    setEventDatetime("");
    setEventLocation("");
    setRegistrationLink("");
    setEventImages([]);
    if (eventFileInputRef.current) eventFileInputRef.current.value = "";
  };

  const startEditEvent = (evt: EventPost & { images?: string[] }) => {
    setEditingEventId(evt.id);
    setEventTitle(evt.title || "");
    setEventSummary(evt.summary || "");
    setEventDatetime(evt.datetime || "");
    setEventLocation(evt.location || "");
    setEventType(evt.type || "Hackathon");
    setEventStatus(evt.status || "Upcoming");
    setRegistrationLink(evt.registrationLink || "");

    const existingImages =
      Array.isArray(evt.images) && evt.images.length > 0
        ? evt.images
        : evt.image
        ? [evt.image]
        : [];
    setEventImages(existingImages);
  };

  const cancelEditEvent = () => {
    setEditingEventId(null);
    setEventTitle("");
    setEventSummary("");
    setEventDatetime("");
    setEventLocation("");
    setRegistrationLink("");
    setEventImages([]);
    if (eventFileInputRef.current) eventFileInputRef.current.value = "";
  };

  // Job Form Submit (Add or Edit)
  const handleCreateOrUpdateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    const payload = {
      title: jobTitle,
      department: jobDepartment,
      type: jobType,
      location: jobLocation,
      experience: jobExperience,
      description: jobDescription,
      skills: jobSkills || "Data Processing, Python, Machine learning concepts",
      postedDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "-"),
      status: "Active" as const,
      image: jobImageBase64,
    };

    if (editingJobId) {
      updateJob(editingJobId, payload);
      setEditingJobId(null);
    } else {
      addJob(payload);
    }

    setJobTitle("");
    setJobDescription("");
    setJobSkills("");
    setJobImageBase64("");
    if (jobFileInputRef.current) jobFileInputRef.current.value = "";
  };

  const startEditJob = (job: JobPost) => {
    setEditingJobId(job.id);
    setJobTitle(job.title || "");
    setJobDepartment(job.department || "Engineering");
    setJobType(job.type || "Full Time");
    setJobLocation(job.location || "Madurai");
    setJobExperience(job.experience || "1-3 years");
    setJobDescription(job.description || "");
    setJobSkills(job.skills || "");
    setJobImageBase64(job.image || "");
  };

  const cancelEditJob = () => {
    setEditingJobId(null);
    setJobTitle("");
    setJobDescription("");
    setJobSkills("");
    setJobImageBase64("");
    if (jobFileInputRef.current) jobFileInputRef.current.value = "";
  };

  // Leads Handlers (Read & Delete Only - No Edit)
  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "inquiries", id), { status: newStatus });
    } catch (err) {
      console.error("Failed to update inquiry status:", err);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await deleteDoc(doc(db, "inquiries", id));
    } catch (err) {
      console.error("Failed to delete inquiry:", err);
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#070d1e] flex items-center justify-center text-slate-400 text-sm">
        Authenticating session...
      </div>
    );
  }

  const filteredInquiries = inquiries.filter(
    (inq) =>
      inq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.selection?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredJobs = jobs.filter((j) =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-200 font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-[#0a1226]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
              RW
            </span>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide">
                {companyInfo.name} <span className="text-sky-400 text-xs font-normal">Console</span>
              </h1>
              <p className="text-[11px] text-slate-400">Enterprise Dashboard &amp; Lead Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-medium text-slate-300 hover:text-white transition cursor-pointer"
            >
              Public Site <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 text-xs font-medium text-red-400 hover:bg-red-500/20 transition cursor-pointer"
            >
              <LogOut className="w-3 h-3" /> Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-[#0a1226] border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Leads &amp; Inquiries</p>
              <h3 className="text-2xl font-bold text-sky-400 mt-1">{inquiries.length}</h3>
            </div>
            <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a1226] border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Events</p>
              <h3 className="text-2xl font-bold text-white mt-1">{events.length}</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a1226] border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Roles</p>
              <h3 className="text-2xl font-bold text-white mt-1">{jobs.length}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0a1226] border border-slate-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Firestore DB</p>
              <h3 className="text-sm font-semibold text-emerald-400 mt-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Connected
              </h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl text-[11px] font-mono">
              Live
            </div>
          </div>
        </div>

        {/* Tab & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab("inquiries")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === "inquiries"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Inquiries &amp; Leads ({inquiries.length})
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === "events"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Events &amp; Hackathons ({events.length})
            </button>
            <button
              onClick={() => setActiveTab("jobs")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === "jobs"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" /> Hiring &amp; Jobs ({jobs.length})
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* ================= INQUIRIES TAB (FIRESTORE - READ & DELETE ONLY) ================= */}
        {activeTab === "inquiries" && (
          <div className="bg-[#0a1226] border border-slate-800 rounded-2xl p-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Customer Leads &amp; Student Applications
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Synchronized in real-time from Cloud Firestore (`inquiries`)
                </p>
              </div>
              <span className="text-xs text-slate-400">
                Total: <strong className="text-white">{filteredInquiries.length}</strong>
              </span>
            </div>

            {loadingInquiries ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Loading inquiries from Firestore...
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="py-12 text-center bg-slate-950/40 rounded-xl border border-slate-800/80 text-slate-500 text-xs">
                No inquiries found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px] tracking-wider">
                      <th className="pb-3 font-semibold">Applicant / Name</th>
                      <th className="pb-3 font-semibold">Contact Info</th>
                      <th className="pb-3 font-semibold">Inquiry Type</th>
                      <th className="pb-3 font-semibold">Selection / Service</th>
                      <th className="pb-3 font-semibold">Message</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredInquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-slate-900/40 transition">
                        <td className="py-3.5 pr-3">
                          <div className="font-semibold text-white">{inq.name || "Anonymous"}</div>
                          {inq.organization && (
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Building className="w-3 h-3 text-slate-500" />
                              {inq.organization}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 pr-3 space-y-0.5">
                          {inq.email && (
                            <div className="flex items-center gap-1 text-[11px] text-sky-400">
                              <Mail className="w-3 h-3 text-sky-500/80" />
                              <a href={`mailto:${inq.email}`} className="hover:underline">
                                {inq.email}
                              </a>
                            </div>
                          )}
                          {inq.phone && (
                            <div className="flex items-center gap-1 text-[11px] text-slate-400">
                              <Phone className="w-3 h-3 text-slate-500" />
                              <a href={`tel:${inq.phone}`} className="hover:underline">
                                {inq.phone}
                              </a>
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 pr-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                              inq.type === "internship"
                                ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
                                : "bg-sky-500/10 text-sky-300 border-sky-500/20"
                            }`}
                          >
                            {inq.type || "General"}
                          </span>
                        </td>

                        <td className="py-3.5 pr-3 text-[11px] font-medium text-slate-200">
                          {inq.selection || "—"}
                        </td>

                        <td className="py-3.5 pr-3 max-w-xs">
                          <p className="text-[11px] text-slate-400 truncate" title={inq.message}>
                            {inq.message || "—"}
                          </p>
                        </td>

                        <td className="py-3.5 pr-3">
                          <select
                            value={inq.status || "New"}
                            onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-[11px] text-slate-200 focus:border-sky-500 focus:outline-none cursor-pointer"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Discussion">In Discussion</option>
                            <option value="Enrolled">Enrolled / Closed</option>
                          </select>
                        </td>

                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= EVENTS TAB (WITH MULTIPLE IMAGE UPLOAD) ================= */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-[#0a1226] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {editingEventId ? "Edit Event / Hackathon" : "Post New Event / Hackathon"}
                  </h3>
                </div>
                {editingEventId && (
                  <button
                    type="button"
                    onClick={cancelEditEvent}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleCreateOrUpdateEvent} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RoboHacks 2026"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Event Type
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-300 focus:border-sky-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Hackathon">Hackathon</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Bootcamp">Bootcamp</option>
                      <option value="Tech Talk">Tech Talk</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Status
                    </label>
                    <select
                      value={eventStatus}
                      onChange={(e) => setEventStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-300 focus:border-sky-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Live">Live</option>
                      <option value="Completed">Completed (Past Event)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Timeline / Date *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Oct 15 - 17, 2026"
                      value={eventDatetime}
                      onChange={(e) => setEventDatetime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Madurai / Hybrid"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Multiple Image Files Upload for Events */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-slate-300">
                      Event Photos / Gallery {eventStatus === "Completed" && "(Multiple allowed for Completed)"}
                    </label>
                    {eventImages.length > 0 && (
                      <span className="text-[10px] text-sky-400 font-medium">
                        {eventImages.length} photo{eventImages.length > 1 ? "s" : ""} selected
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-950 border border-dashed border-slate-700 hover:border-sky-500 rounded-lg cursor-pointer transition text-xs text-slate-400 hover:text-white">
                      <UploadCloud className="w-4 h-4 text-sky-400" />
                      <span>
                        {eventImages.length > 0 ? "Add More Photos" : "Upload Event Photos (Choose files)"}
                      </span>
                      <input
                        ref={eventFileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleEventImageUpload}
                        className="hidden"
                      />
                    </label>

                    {eventImages.length > 0 && (
                      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                        {eventImages.map((imgSrc, idx) => (
                          <div
                            key={idx}
                            className="relative w-14 h-12 rounded border border-slate-700 overflow-hidden shrink-0 group"
                          >
                            <img
                              src={imgSrc}
                              alt={`preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeEventImage(idx)}
                              className="absolute top-0 right-0 bg-red-600 text-white p-0.5 rounded-bl hover:bg-red-700 transition cursor-pointer"
                              title="Remove photo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {idx === 0 && (
                              <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-center text-sky-300 font-bold py-0.5">
                                Cover
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Registration / External Link
                  </label>
                  <input
                    type="text"
                    placeholder="https://robowebtechnologies.co.in"
                    value={registrationLink}
                    onChange={(e) => setRegistrationLink(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Summary / Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Event objectives or key highlights..."
                    value={eventSummary}
                    onChange={(e) => setEventSummary(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-sky-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-500 text-white py-2 rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer"
                >
                  {editingEventId ? "Update Event" : "Publish Event"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Active &amp; Completed Listings ({filteredEvents.length})
              </h3>
              {filteredEvents.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                  No events found. Upload one using the form on the left.
                </div>
              ) : (
                filteredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 bg-[#0a1226] border border-slate-800 rounded-xl flex items-center justify-between gap-4 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                        {evt.image ? (
                          <img src={evt.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Calendar className="w-6 h-6 text-sky-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                              evt.status === "Completed"
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            }`}
                          >
                            {evt.status}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{evt.type}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-white mt-0.5">{evt.title}</h4>
                        <p className="text-[11px] text-slate-400">
                          {evt.datetime} • {evt.location || "Online"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEditEvent(evt)}
                        className="p-2 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                        title="Edit Event"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEvent(evt.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= HIRING / JOBS TAB (WITH EDIT OPTION) ================= */}
        {activeTab === "jobs" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-[#0a1226] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {editingJobId ? "Edit Job Opening" : "Post Job Opening / Internship"}
                  </h3>
                </div>
                {editingJobId && (
                  <button
                    type="button"
                    onClick={cancelEditJob}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleCreateOrUpdateJob} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Job / Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Machine Learning specialist"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Type
                    </label>
                    <select
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-300 focus:border-sky-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Full Time">Full Time</option>
                      <option value="Internship">Internship</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      placeholder="IT / Engineering"
                      value={jobDepartment}
                      onChange={(e) => setJobDepartment(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Madurai / Hybrid"
                      value={jobLocation}
                      onChange={(e) => setJobLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Experience
                    </label>
                    <input
                      type="text"
                      placeholder="1-3 years"
                      value={jobExperience}
                      onChange={(e) => setJobExperience(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Skills Field */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Skills (displayed on card)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Data Processing, Python, Machine learning concepts"
                    value={jobSkills}
                    onChange={(e) => setJobSkills(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>

                {/* Direct Image File Upload for Job */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Role Poster / Badge Photo
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-950 border border-dashed border-slate-700 hover:border-emerald-500 rounded-lg cursor-pointer transition text-xs text-slate-400 hover:text-white">
                      <UploadCloud className="w-4 h-4 text-emerald-400" />
                      <span>{jobImageBase64 ? "Change Image" : "Upload Role Image"}</span>
                      <input
                        ref={jobFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleJobImageUpload}
                        className="hidden"
                      />
                    </label>
                    {jobImageBase64 && (
                      <div className="relative w-12 h-10 rounded border border-slate-700 overflow-hidden shrink-0">
                        <img src={jobImageBase64} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setJobImageBase64("");
                            if (jobFileInputRef.current) jobFileInputRef.current.value = "";
                          }}
                          className="absolute top-0 right-0 bg-red-600 text-white p-0.5 rounded-bl cursor-pointer"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Key Responsibilities / Details
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short description of the role responsibilities..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-sky-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer"
                >
                  {editingJobId ? "Update Role" : "Publish Role"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Published Openings ({filteredJobs.length})
              </h3>
              {filteredJobs.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                  No positions posted yet. Upload one using the form on the left.
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 bg-[#0a1226] border border-slate-800 rounded-xl flex items-center justify-between gap-4 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                        {job.image ? (
                          <img src={job.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Briefcase className="w-6 h-6 text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            {job.type}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{job.department}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-white mt-0.5">{job.title}</h4>
                        <p className="text-[11px] text-slate-400">
                          {job.location} • {job.experience}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEditJob(job)}
                        className="p-2 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                        title="Edit Job"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
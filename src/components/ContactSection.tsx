"use client";

import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Briefcase, 
  GraduationCap 
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  organization?: string;
  selection?: string;
  message?: string;
}

export default function ContactSection() {
  const [activeTab, setActiveTab] = useState<"inquiry" | "training">("training");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    selection: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 1. Listen for navbar button triggers ("switch-contact-tab")
  useEffect(() => {
    const handleTabSwitch = (e: Event) => {
      const customEvent = e as CustomEvent<"business" | "internship">;
      if (customEvent.detail === "business") {
        setActiveTab("inquiry");
      } else if (customEvent.detail === "internship") {
        setActiveTab("training");
      }
      setErrors({});
    };

    window.addEventListener("switch-contact-tab", handleTabSwitch);
    return () => window.removeEventListener("switch-contact-tab", handleTabSwitch);
  }, []);

  // 2. Validate Form Fields
  const validateForm = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.fullName.trim()) {
      errs.fullName = "Full name is required.";
    }

    // --- Stricter Email Validation ---
    const trimmedEmail = formData.email.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!trimmedEmail) {
      errs.email = "Email address is required.";
    } else if (!emailRegex.test(trimmedEmail)) {
      errs.email = "Please enter a valid email address (e.g. name@example.com).";
    }

    // --- Strict Phone Validation (India & International) ---
    const phoneDigits = formData.phone.replace(/\D/g, ""); // strip '+', '-', and spaces
    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (phoneDigits.length < 10 || phoneDigits.length > 13) {
      errs.phone = "Enter a valid phone number (at least 10 digits).";
    } else if (/^0+$/.test(phoneDigits)) {
      errs.phone = "Phone number cannot be all zeros.";
    }

    if (!formData.organization.trim()) {
      errs.organization =
        activeTab === "inquiry"
          ? "Company or organization name is required."
          : "College name is required.";
    }

    if (!formData.selection) {
      errs.selection = "Please select an option.";
    }

    if (!formData.message.trim()) {
      errs.message =
        activeTab === "inquiry"
          ? "Project details are required."
          : "Background / notes are required.";
    } else if (formData.message.trim().length < 10) {
      errs.message = "Please enter at least 10 characters.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage("");

    try {
      await addDoc(collection(db, "inquiries"), {
        createdAt: serverTimestamp(),
        email: formData.email,
        message: formData.message,
        name: formData.fullName,
        organization: formData.organization,
        phone: formData.phone,
        selection: formData.selection || "Not Specified",
        status: "New",
        type: activeTab === "inquiry" ? "business" : "internship",
      });

      setSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        organization: "",
        selection: "",
        message: "",
      });
      setErrors({});
    } catch (err: any) {
      console.error("Firestore error:", err);
      setErrorMessage(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="bg-[#050814] text-slate-100 py-20 px-6 border-b border-slate-800/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT COLUMN: Contact Details & Integrated Map */}
          <div className="lg:col-span-5 h-full flex flex-col justify-between p-8 sm:p-9 rounded-3xl bg-[#080d1f] border border-slate-800/90 shadow-2xl">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight mb-7">
                Visit or reach us
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">Office Address</p>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                      59, Sathamangalam, Sivagangai road, Near Anna Bus Stand, Opposite HP Petrol Bunk, Madurai, Tamil Nadu, India - 625020
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Phone</p>
                    <a
                      href="tel:+919150008759"
                      className="text-xs sm:text-sm text-slate-400 hover:text-sky-400 transition"
                    >
                      +91-9150008759
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Email</p>
                    <a
                      href="mailto:contact@robowebtechnologies.co.in"
                      className="text-xs sm:text-sm text-slate-400 hover:text-sky-400 transition"
                    >
                      contact@technologies.co.in
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Business Hours</p>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Monday - Saturday: 10:00 AM - 7:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <div className="w-full h-44 rounded-2xl overflow-hidden border border-slate-700/80 shadow-inner">
                <iframe
                  title="Office Location Map"
                  src="https://maps.google.com/maps?q=39+Gandhi+Nagar+Sathamangalam+Madurai+625020&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 filter invert-[90%] hue-rotate-180 contrast-125 opacity-90 hover:opacity-100 transition duration-300"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="flex justify-end mt-2">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=39+Gandhi+Nagar+Sathamangalam+Madurai+Tamil+Nadu+625020"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold transition"
                >
                  <span>Open in Google Maps</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Form Card */}
          <div className="lg:col-span-7 h-full flex flex-col justify-between p-8 sm:p-9 rounded-3xl bg-white text-slate-900 shadow-2xl border border-slate-200">
            <div>
              {/* Tab Selector */}
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("inquiry");
                    setErrors({});
                  }}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    activeTab === "inquiry"
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-sky-600" />
                  Business Inquiry
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("training");
                    setErrors({});
                  }}
                  className={`relative flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    activeTab === "training"
                      ? "bg-white text-slate-900 shadow-sm border border-slate-300 ring-2 ring-purple-500/20"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                  Apply for Internship / Training
                </button>
              </div>

              {submitted ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900">
                    Application Transmitted
                  </h4>
                  <p className="text-slate-600 max-w-md mx-auto text-sm leading-relaxed">
                    Thank you for reaching out. Your details have been saved to our database and our team will get back to you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Full Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Your name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-slate-900 text-sm focus:outline-none focus:ring-2 ${
                          errors.fullName
                            ? "border-rose-500 focus:ring-rose-500/30"
                            : "border-slate-300 focus:ring-sky-500/30 focus:border-sky-500"
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-slate-900 text-sm focus:outline-none focus:ring-2 ${
                          errors.email
                            ? "border-rose-500 focus:ring-rose-500/30"
                            : "border-slate-300 focus:ring-sky-500/30 focus:border-sky-500"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-rose-500 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone & College / Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91-9876543210"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-slate-900 text-sm focus:outline-none focus:ring-2 ${
                          errors.phone
                            ? "border-rose-500 focus:ring-rose-500/30"
                            : "border-slate-300 focus:ring-sky-500/30 focus:border-sky-500"
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        {activeTab === "inquiry" ? "Company / Organization" : "College"}
                      </label>
                      <input
                        type="text"
                        name="organization"
                        placeholder={activeTab === "inquiry" ? "Your company" : "Your college"}
                        value={formData.organization}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-xl border text-slate-900 text-sm focus:outline-none focus:ring-2 ${
                          errors.organization
                            ? "border-rose-500 focus:ring-rose-500/30"
                            : "border-slate-300 focus:ring-sky-500/30 focus:border-sky-500"
                        }`}
                      />
                      {errors.organization && (
                        <p className="text-xs text-rose-500 mt-1">{errors.organization}</p>
                      )}
                    </div>
                  </div>

                  {/* Preferred Track / Service Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {activeTab === "inquiry" ? "Service Needed" : "Preferred Track"}
                    </label>
                    <select
                      name="selection"
                      value={formData.selection}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl border text-slate-900 text-sm focus:outline-none focus:ring-2 bg-white ${
                        errors.selection
                          ? "border-rose-500 focus:ring-rose-500/30"
                          : "border-slate-300 focus:ring-sky-500/30 focus:border-sky-500"
                      }`}
                    >
                      <option value="">Select an option</option>

                      {activeTab === "training" ? (
                        <>
                          <optgroup label="💼 Industry Internship Tracks">
                            <option value="Full Stack Development (Internship)">
                              Full Stack Development (Internship)
                            </option>
                            <option value="AI & Machine Learning (Internship)">
                              AI &amp; Machine Learning (Internship)
                            </option>
                            <option value="Data Science (Internship)">
                              Data Science (Internship)
                            </option>
                            <option value="Cyber Security (Internship)">
                              Cyber Security (Internship)
                            </option>
                            <option value="Robotics (Internship)">
                              Robotics (Internship)
                            </option>
                          </optgroup>

                          <optgroup label="🎓 Professional Training Tracks">
                            <option value="Full Stack Development (Training)">
                              Full Stack Development (Training)
                            </option>
                            <option value="AI & Machine Learning (Training)">
                              AI &amp; Machine Learning (Training)
                            </option>
                            <option value="Data Science (Training)">
                              Data Science (Training)
                            </option>
                            <option value="Cyber Security (Training)">
                              Cyber Security (Training)
                            </option>
                            <option value="Robotics (Training)">
                              Robotics (Training)
                            </option>
                          </optgroup>
                        </>
                      ) : (
                        <optgroup label="🏢 Enterprise Solutions">
                          <option value="Web Development">Web Development &amp; Portals</option>
                          <option value="App Development">Mobile App Development</option>
                          <option value="AI Automations">AI Automations &amp; Custom Bots</option>
                          <option value="ERP Systems">Custom ERP / CRM Systems</option>
                          <option value="Cloud & DevOps">Cloud Infrastructure &amp; DevOps</option>
                        </optgroup>
                      )}
                    </select>
                    {errors.selection && (
                      <p className="text-xs text-rose-500 mt-1">{errors.selection}</p>
                    )}
                  </div>

                  {/* Project / Candidate Details */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {activeTab === "inquiry" ? "Project Details" : "Candidate Background / Notes"}
                    </label>
                    <textarea
                      rows={3}
                      name="message"
                      placeholder={
                        activeTab === "inquiry"
                          ? "Tell us about your project, goals, and timeline."
                          : "Tell us about your degree, semester, technical interests, or experience."
                      }
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-xl border text-slate-900 text-sm focus:outline-none focus:ring-2 resize-none ${
                        errors.message
                          ? "border-rose-500 focus:ring-rose-500/30"
                          : "border-slate-300 focus:ring-sky-500/30 focus:border-sky-500"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-xs text-rose-500 mt-1">{errors.message}</p>
                    )}
                  </div>

                  {errorMessage && (
                    <p className="text-xs text-rose-500 font-medium">{errorMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] disabled:opacity-60 text-white py-3.5 rounded-xl font-bold shadow-md shadow-sky-500/20 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? "Transmitting..." : activeTab === "inquiry" ? "Request Proposal" : "Submit Application"}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import ProjectsAndFaq from "@/components/ProjectsAndFaq";
import CareersAndEvents from "@/components/CareersAndEvents";
import TechCanvas from "@/components/TechCanvas";
import { requestApply } from "@/lib/cmsStore";
import { Check } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

const dynamicWords = [
  "Modern Businesses",
  "Future Tech Innovators",
  "Next-Gen Startups",
  "Enterprise Systems",
];

export default function Page() {
  // --- Slide-Up Animation State ---
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % dynamicWords.length);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 text-slate-900 scroll-smooth font-sans">
      <Navbar />

      <div className="flex-1">
        {/* =========================================
            HERO / HOME SECTION (WITH TECH CANVAS GRAPHIC)
        ========================================= */}
        <section
          id="top"
          className="relative bg-[#070d1e] text-white pt-24 pb-28 px-6 overflow-hidden border-b border-slate-800 scroll-mt-20"
        >
          <div id="home" className="absolute -top-20" />

          {/* Interactive Connected Nodes Canvas */}
          <TechCanvas />

          {/* Ambient Lighting Gradients */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[110px] pointer-events-none" />

          <div className="relative max-w-5xl mx-auto text-center z-10">
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs sm:text-sm font-medium mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <span className="text-sky-400 text-xs">✦</span>
              Enterprise Software • AI Automations • Practical IT Education
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.15]">
  Empowering{" "}
  <span className="inline-block relative overflow-hidden align-top h-[1.15em] min-w-[280px] sm:min-w-[420px] text-left">
    <span
      key={wordIndex}
      className="animate-word-slide inline-block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-sky-200"
    >
      {dynamicWords[wordIndex]}
    </span>
  </span>
  <br className="hidden sm:inline" />
</h1>
            {/* Subheading */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              RoboWeb Technologies designs custom software and AI-driven solutions for growing businesses, while mentoring the next generation of developers through hands-on internships and industry-ready training programs.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#services"
                className="btn-wow bg-[#0284c7] hover:bg-[#0369a1] text-white px-7 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-sky-500/25 transition-all duration-200"
              >
                Explore Services
              </a>
              <button
                type="button"
                onClick={() =>
                  requestApply({
                    tab: "internship",
                    message: "",
                  })
                }
                className="btn-wow border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 px-7 py-3 rounded-xl text-sm font-semibold hover:border-slate-500 transition-all duration-200"
              >
                Apply for Internship
              </button>
            </div>

            {/* Enterprise TCS Founder Badge */}
            <div className="hero-pro-card mt-10 inline-flex items-center gap-4 px-6 py-3.5 rounded-2xl bg-[#0a1226]/90 border border-slate-800 shadow-2xl backdrop-blur-md text-left max-w-xl">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 text-lg shrink-0 shadow-[0_0_12px_rgba(56,189,248,0.25)]">
                💼
              </span>
              <p className="text-sm sm:text-base text-slate-200 leading-snug">
                Founded by an IT professional with enterprise experience at{" "}
                <span className="text-white font-semibold">Tata Consultancy Services (TCS)</span>.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            ABOUT SECTION
        ========================================= */}
        <section id="about" className="py-24 px-6 border-b border-slate-100 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6 anim-slide-up">
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#0284c7]">
                  About RoboWeb Technologies
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-tight">
                  Bridging Academics &amp; Enterprise Execution
                </h2>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  RoboWeb Technologies delivers high-quality Web &amp; App Development, Custom Software, AI Automations, and hands-on Internship Programmes.
                </p>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Our curriculum and client deliverables are built on corporate standards, providing students with genuine exposure to production codebases and giving businesses scalable digital infrastructure.
                </p>

                {/* Staggered checkmark list */}
                <div className="space-y-3 pt-2">
                  {[
                    { label: "Build Businesses", desc: "Modern web apps, scalable cloud setups, and custom AI tools." },
                    { label: "Build Careers", desc: "Direct mentorship on production codebases with structured code reviews." },
                    { label: "Build Innovation", desc: "Practical robotics, IoT systems, and automated pipelines." },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-start gap-3 anim-slide-up stagger-${i + 1}`}>
                      <Check className="w-4 h-4 text-[#0284c7] stroke-[3] mt-1 shrink-0 transition-transform duration-200 hover:scale-125" />
                      <p className="text-sm text-slate-700 leading-relaxed">
                        <strong className="text-slate-900 font-bold">{item.label}:</strong> {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column (4 Animated Stat Cards) */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                {[
                  { title: "Enterprise", subtitle: "Standards & Quality" },
                  { title: "100%", subtitle: "Hands-on Practice" },
                  { title: "Startups", subtitle: "& SME Scale Solutions" },
                  { title: "Full-Cycle", subtitle: "Support & Delivery" },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className={`group anim-tilt-card anim-slide-up stagger-${idx + 1} flex flex-col justify-center items-center text-center p-8 rounded-lg bg-white border border-slate-200/90 shadow-sm hover:border-[#0284c7] hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 min-h-[140px] cursor-default`}
                  >
                    <h3 className="text-2xl sm:text-[28px] font-extrabold text-[#0284c7] tracking-tight group-hover:scale-105 transition-transform duration-200">
                      {stat.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      {stat.subtitle}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            SERVICES SECTION
        ========================================= */}
        {(() => {
          const [isVisible, setIsVisible] = useState(false);
          const sectionRef = useRef<HTMLElement>(null);

          useEffect(() => {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting) {
                  setIsVisible(true);
                  observer.disconnect();
                }
              },
              { threshold: 0.15 }
            );

            if (sectionRef.current) {
              observer.observe(sectionRef.current);
            }

            return () => observer.disconnect();
          }, []);

          const servicesList = [
            {
              title: "Web Development",
              desc: "Professional corporate portals, business websites, e-commerce stores, and high-performance custom web applications built with modern frameworks.",
            },
            {
              title: "App Development",
              desc: "Modern Android and cross-platform mobile apps engineered for seamless UX, high responsiveness, and business scalability.",
            },
            {
              title: "AI Automations",
              desc: "AI-powered assistants, automated workflow pipelines, customer support chatbots, and intelligent business data processing.",
            },
            {
              title: "Custom Software Systems",
              desc: "Tailor-made software including ERP systems, customer CRM solutions, inventory, and automated billing software.",
            },
            {
              title: "Robotics Solutions",
              desc: "Robotics education, hardware-software integration, STEM kits, and project guidance for students and institutional labs.",
            },
            {
              title: "Cloud, Support & Maintenance",
              desc: "End-to-end cloud deployments, domain and server configuration, continuous security patch management, bug fixes, and performance tuning.",
            },
          ];

          return (
            <section ref={sectionRef} id="services" className="py-24 max-w-7xl mx-auto px-6">
              <div
                className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
              >
                <span className="text-[#0284c7] font-extrabold text-xs tracking-widest uppercase">
                  Comprehensive Solutions
                </span>
                <h2 className="mt-2 text-3xl sm:text-4xl lg:text-[40px] font-black text-slate-900 tracking-tight">
                  Services We Provide
                </h2>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                  High-quality digital services tailored to help companies automate, build, and scale modern applications.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicesList.map((service, index) => (
                  <div
                    key={index}
                    style={{
                      transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
                    }}
                    className={`group relative p-8 rounded-lg bg-white border border-slate-200/90 shadow-sm flex flex-col justify-start cursor-default
                      transition-all duration-300 ease-out
                      hover:-translate-y-2.5 hover:shadow-xl hover:shadow-sky-500/10 hover:border-[#0284c7]
                      ${
                        isVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-12 pointer-events-none"
                      }
                    `}
                  >
                    <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight group-hover:text-[#0284c7] transition-colors duration-200">
                      {service.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          );
        })()}

        {/* =========================================
            TRAINING & INTERNSHIPS SECTION
        ========================================= */}
        {(() => {
          const [isVisible, setIsVisible] = useState(false);
          const trainingRef = useRef<HTMLElement>(null);

          useEffect(() => {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting) {
                  setIsVisible(true);
                  observer.disconnect();
                }
              },
              { threshold: 0.15 }
            );

            if (trainingRef.current) {
              observer.observe(trainingRef.current);
            }

            return () => observer.disconnect();
          }, []);

          return (
            <section
              ref={trainingRef}
              id="training"
              className="py-24 px-6 border-b border-slate-100 bg-white"
            >
              <div className="max-w-6xl mx-auto">
                {/* Header with Scroll Fade/Slide */}
                <div
                  className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ease-out ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                >
                  <span className="text-xs uppercase font-extrabold tracking-widest text-[#0284c7]">
                    Career Advancement
                  </span>
                  <h2 className="mt-3 text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                    Training &amp; Internship Programmes
                  </h2>
                  <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                    Gain real-world engineering project experience and learn directly from industry professionals.
                  </p>
                </div>

                {/* 2 Main Overview Cards (Hover Lift + Staggered Fade In) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Card 1: Industry Internship Program */}
                  <div
                    style={{ transitionDelay: isVisible ? "0ms" : "0ms" }}
                    className={`group p-8 sm:p-10 rounded-lg bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between cursor-default
                      transition-all duration-300 ease-out
                      hover:-translate-y-2 hover:shadow-xl hover:shadow-sky-500/10 hover:border-[#0284c7]
                      ${
                        isVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-12 pointer-events-none"
                      }
                    `}
                  >
                    <div>
                      <span className="inline-block px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold mb-6 transition-transform duration-200 group-hover:scale-105">
                        Active Intake
                      </span>

                      <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-[#0284c7] transition-colors duration-200">
                        Industry Internship Program
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                        Work on production code repositories, practice Git version workflows, build REST APIs, and assemble real-world project portfolios under direct supervision.
                      </p>

                      <ul className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-[#0284c7] transition-colors duration-200"></span>
                          <span>Live project development &amp; code reviews</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-[#0284c7] transition-colors duration-200"></span>
                          <span>Recognized internship completion certificate</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-[#0284c7] transition-colors duration-200"></span>
                          <span>Career guidance &amp; placement assistance</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Card 2: Professional IT & Robotics Courses */}
                  <div
                    style={{ transitionDelay: isVisible ? "160ms" : "0ms" }}
                    className={`group p-8 sm:p-10 rounded-lg bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between cursor-default
                      transition-all duration-300 ease-out
                      hover:-translate-y-2 hover:shadow-xl hover:shadow-sky-500/10 hover:border-[#0284c7]
                      ${
                        isVisible
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-12 pointer-events-none"
                      }
                    `}
                  >
                    <div>
                      <span className="inline-block px-3 py-1 rounded-md bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold mb-6 transition-transform duration-200 group-hover:scale-105">
                        Skill Development
                      </span>

                      <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-[#0284c7] transition-colors duration-200">
                        Professional IT &amp; Robotics Courses
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                        Step-by-step modular training covering full-stack web technologies, modern JavaScript, Python, automation frameworks, and hands-on robotics fundamentals.
                      </p>

                      <ul className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-[#0284c7] transition-colors duration-200"></span>
                          <span>Beginner to advanced hands-on curriculum</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-[#0284c7] transition-colors duration-200"></span>
                          <span>Taught with corporate software practices</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-[#0284c7] transition-colors duration-200"></span>
                          <span>Real-world capstone portfolio projects</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}
        {/* DYNAMIC SECTIONS */}
        <section id="careers">
          <CareersAndEvents />
        </section>

        <section id="faq">
          <ProjectsAndFaq />
        </section>
      </div>

      {/* CONTACT SECTION */}
      <section id="contact">
        <ContactSection />
      </section>

      <Footer />
    </main>
  );
}
"use client";

import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#070d1e] text-slate-300 border-t border-slate-800/80 overflow-hidden">
      {/* Soft Ambient Background Glow */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-12 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center">
              <a
                href="#top"
                onClick={scrollToTop}
                className="inline-block transition-transform duration-200 hover:scale-105"
                aria-label="RoboWeb Technologies Home"
              >
                <img
                  src="MS.png"
                  alt="RoboWeb Technologies"
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </a>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              We engineer scalable Web &amp; App solutions, custom enterprise platforms, and AI automations, while mentoring the next generation of engineers through rigorous project-based internships.
            </p>

            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Enterprise Delivery Standards &amp; Corporate Mentorship</span>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="lg:col-span-3 lg:pl-6 space-y-4">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: "Home", href: "#top" },
                { name: "About Us", href: "#about" },
                { name: "Services", href: "#services" },
                { name: "Training & Internships", href: "#training" },
                { name: "Careers", href: "#careers" },
                { name: "Projects & FAQ", href: "#faq" },
                { name: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-slate-400 hover:text-sky-400 hover:translate-x-1 transition-all duration-200"
                  >
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Office */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">
              Madurai Office
            </h4>

            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-300">
                <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-[13px] leading-relaxed text-slate-300">
                  59, Sathamangalam, Sivagangai Road, Near Anna Bus Stand, Opposite HP Petrol Bunk, Madurai, Tamil Nadu, India — 625020
                </p>
              </div>

              <a
                href="tel:+919150008759"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-900/80 transition-colors group text-slate-300"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm group-hover:text-white transition-colors">
                  +91-9150008759
                </span>
              </a>

              <a
                href="mailto:contact@technologies.co.in"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-900/80 transition-colors group text-slate-300"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm group-hover:text-white transition-colors truncate">
                  contact@technologies.co.in
                </span>
              </a>

              <div className="flex items-center gap-3 p-2.5 text-slate-400">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-slate-400">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm">
                  Monday – Saturday: 10:00 AM – 7:00 PM
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Technologies. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="#about" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <span className="text-slate-700">•</span>
            <a href="#about" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <span className="text-slate-700">•</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 transition-colors font-semibold"
            >
              Back to top
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
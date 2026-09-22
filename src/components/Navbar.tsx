"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, X, Phone, Clock, GraduationCap, ArrowRight } from "lucide-react"
import { companyInfo } from "../data/robowebData"
import { requestApply } from "../lib/cmsStore"

const navLinks = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Training & Internships", href: "#training" },
  { label: "Careers", href: "#careers" },
  { label: "Events", href: "#events" },
  { label: "Projects & FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  // Sliding underline state
  const [sliderStyle, setSliderStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  })
  const navContainerRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault()
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
    window.history.pushState(null, "", "/")
    setMobileOpen(false)
  }

  // Opens Contact section and selects "Apply for Internship / Training" tab
  const handleApplyInternship = () => {
    setMobileOpen(false)
    const contactElem = document.getElementById("contact")
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" })
      window.dispatchEvent(
        new CustomEvent("switch-contact-tab", { detail: "internship" })
      )
    }
  }

  // Opens Contact section and selects "Business Inquiry" tab
  const handleGetProposal = (e: React.MouseEvent) => {
    e.preventDefault()
    setMobileOpen(false)
    const contactElem = document.getElementById("contact")
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: "smooth" })
      window.dispatchEvent(
        new CustomEvent("switch-contact-tab", { detail: "business" })
      )
    }
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget
    if (!navContainerRef.current) return

    const containerRect = navContainerRef.current.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()

    setSliderStyle({
      left: targetRect.left - containerRect.left,
      width: targetRect.width,
      opacity: 1,
    })
  }

  const handleMouseLeave = () => {
    setSliderStyle((prev) => ({ ...prev, opacity: 0 }))
  }

  return (
    <header id="top" className="sticky top-0 z-50">
      {/* Top Notification Bar */}
      <div className="hidden bg-slate-900 text-slate-200 md:block border-b border-slate-800">
        <div className="w-full flex items-center justify-between px-6 lg:px-8 py-1.5 text-xs">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${companyInfo.phone}`}
              className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-white"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              9150008759
            </a>
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-400">
              <Clock className="h-4 w-4" aria-hidden="true" />
              Monday - Saturday: 10:00 AM - 7:00 PM
            </span>
          </div>
          <button
            type="button"
            onClick={handleApplyInternship}
            className="inline-flex items-center gap-1.5 font-semibold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
          >
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            Admissions Open for Internships
          </button>
        </div>
      </div>

      {/* Main Navigation */}
<nav className="w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
  <div className="w-full flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
    
    {/* Left: Logo */}
    <div className="flex items-center shrink-0">
      <a
        href="/"
        onClick={scrollToTop}
        className="flex items-center shrink-0 cursor-pointer overflow-hidden py-1"
        aria-label={`${companyInfo.name} Home`}
      >
        <img
          src="/MS.png?v=2"
          alt={companyInfo.name}
          className="h-10 sm:h-12 w-auto object-contain mix-blend-multiply brightness-95"
        />
      </a>
    </div>

          {/* Center: Centered Headers with Smooth Sliding Window Underline */}
          <div className="hidden lg:flex flex-1 justify-center px-4">
            <ul
              ref={navContainerRef}
              onMouseLeave={handleMouseLeave}
              className="relative flex items-center gap-1 xl:gap-2"
            >
              {navLinks.map((link) => (
                <li key={link.href} className="shrink-0">
                  <a
                    href={link.href}
                    onClick={link.label === "Home" ? scrollToTop : undefined}
                    onMouseEnter={handleMouseEnter}
                    className="relative z-10 block rounded-md px-2.5 py-1 text-xs xl:text-sm font-medium text-slate-700 hover:text-[#0284c7] transition-colors duration-200 whitespace-nowrap cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}

              {/* Sliding Window Underline Indicator */}
              <span
                className="absolute bottom-0 h-[3px] bg-[#0284c7] rounded-full transition-all duration-300 ease-out pointer-events-none"
                style={{
                  left: `${sliderStyle.left}px`,
                  width: `${sliderStyle.width}px`,
                  opacity: sliderStyle.opacity,
                }}
              />
            </ul>
          </div>

          {/* Right: Action Buttons (Desktop) */}
<div className="hidden items-center gap-2.5 shrink-0 lg:flex">
  {/* Apply Internship Button */}
  <button
    type="button"
    onClick={handleApplyInternship}
    className="rounded-md border border-slate-300 px-3.5 py-1.5 text-xs xl:text-sm font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-[#0284c7] whitespace-nowrap cursor-pointer"
  >
    Apply Internship
  </button>

  {/* Get Proposal Button */}
  <button
    type="button"
    onClick={handleGetProposal}
    className="inline-flex items-center gap-1.5 rounded-md bg-[#00a6ff] hover:bg-[#0095e6] px-3.5 py-1.5 text-xs xl:text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md whitespace-nowrap cursor-pointer"
  >
    <span>Get Proposal</span>
    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
  </button>
</div>
          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 lg:hidden ml-auto cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Drawer Side Panel */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] flex-col bg-white shadow-xl transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <span className="text-base font-bold text-slate-900">Menu</span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 cursor-pointer"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <ul className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => {
                  if (link.label === "Home") {
                    scrollToTop(e)
                  } else {
                    setMobileOpen(false)
                  }
                }}
                className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-[#0284c7]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Action Buttons (Mobile) */}
        <div className="flex flex-col gap-2 border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={handleGetProposal}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#00a6ff] hover:bg-[#0095e6] px-4 py-2 text-sm font-bold text-white transition-colors cursor-pointer"
          >
            <span>Get Proposal</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={handleApplyInternship}
            className="rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 cursor-pointer"
          >
            Apply Internship
          </button>
        </div>
      </aside>
    </header>
  )
}
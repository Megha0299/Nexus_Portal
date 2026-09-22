"use client"

import { useState } from "react"
import {
  Boxes,
  Bot,
  GraduationCap,
  Radio,
  ArrowUpRight,
  Plus,
  Minus,
  HelpCircle,
  type LucideIcon,
} from "lucide-react"

type Project = {
  title: string
  description: string
  icon: LucideIcon
  tags: string[]
}

const projects: Project[] = [
  {
    title: "Enterprise ERP & Billing Portal",
    description:
      "Custom software for retail and manufacturing that unifies inventory, billing, and reporting into one secure, role-based platform.",
    icon: Boxes,
    tags: ["Web App", "Next.js", "Node", "PostgreSQL"],
  },
  {
    title: "AI-Powered Customer Support Agent",
    description:
      "An intelligent conversational bot that resolves customer queries and fires automated workflow triggers across connected tools.",
    icon: Bot,
    tags: ["AI & Automation", "LLM", "Workflows"],
  },
  {
    title: "College Management & Internship Portal",
    description:
      "Student progress tracking, attendance, and certified project submissions in a single portal for institutions and mentors.",
    icon: GraduationCap,
    tags: ["EdTech", "Dashboards", "Web App"],
  },
  {
    title: "IoT-Enabled Industrial Monitoring",
    description:
      "Sensor data telemetry with a live dashboard that surfaces real-time analytics and alerts for factory-floor operations.",
    icon: Radio,
    tags: ["IoT", "Telemetry", "Analytics"],
  },
]

type Faq = {
  question: string
  answer: string
}

const faqs: Faq[] = [
  {
    question: "What core services does RoboWeb Technologies provide?",
    answer:
      "We build custom web and mobile applications, ERP/CRM systems, and AI automations, and we handle cloud deployment, DevOps, and ongoing support. Alongside our software work, we run practical IT training and internship programs.",
  },
  {
    question: "Do you offer real-world internship programs for college students?",
    answer:
      "Yes. Our internships are project-based and mentor-led, so students work on real deliverables, follow our development process, and receive verifiable certificates and portfolio-ready work by the end of the program.",
  },
  {
    question: "Can school students or non-CS students join your robotics and training courses?",
    answer:
      "Absolutely. Our robotics and foundational tracks are designed for beginners and non-CS backgrounds, starting from fundamentals and building up through hands-on projects at a comfortable pace.",
  },
  {
    question: "Do you develop custom software and ERP systems for businesses?",
    answer:
      "Yes. We design tailored ERP, CRM, and billing systems around your workflows rather than forcing you into rigid templates, and we build them to scale securely as your business grows.",
  },
  {
    question: "How do we collaborate or request a custom software quotation?",
    answer:
      "Share your requirements through the contact form or call our Madurai office. We schedule a discovery call, map the scope, and send a clear proposal with timeline and pricing before any work begins.",
  },
]

export default function ProjectsAndFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <>
      {/* Featured Projects / Solutions */}
      <section id="projects" className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Featured Projects &amp; Solutions
            </h2>
            <p className="mt-4 text-pretty text-base text-slate-600 sm:text-lg">
              A snapshot of the software, AI, and connected systems we&apos;ve
              delivered across industries.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {projects.map((project) => {
              const Icon = project.icon
              return (
                <article
                  key={project.title}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <ArrowUpRight
                      className="h-5 w-5 text-slate-300 transition-colors group-hover:text-sky-500"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{project.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-xs font-medium text-sky-700">
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            Frequently Asked Questions
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Answers to Common Questions
          </h2>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            const panelId = `faq-panel-${index}`
            const buttonId = `faq-button-${index}`
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span className="text-sm font-semibold text-slate-900 sm:text-base">
                      {faq.question}
                    </span>
                    <span
                      className={`inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                        isOpen ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                      aria-hidden="true"
                    >
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}

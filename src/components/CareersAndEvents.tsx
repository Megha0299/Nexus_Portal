"use client";

import { useState, useRef, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  Mail,
  CalendarDays,
  Calendar,
  Users,
  CheckCircle2,
  Sparkles,
  X,
} from "lucide-react";
import { useJobs, useEvents, requestApply, type JobPost, type EventPost } from "../lib/cmsStore";

function applyForJob(job: JobPost) {
  const isInternship = job.type === "Internship";
  requestApply({
    tab: isInternship ? "internship" : "business",
    organization: "",
    message: `I'd like to apply for the "${job.title}" role in ${job.department} (${job.type}, ${job.location}).`,
  });
}

function registerForEvent(event: EventPost) {
  const link = event.registrationLink?.trim() || "";
  if (/^https?:\/\//i.test(link)) {
    window.open(link, "_blank", "noopener,noreferrer");
    return;
  }
  requestApply({
    tab: "business",
    message: `I'd like to register/inquire for "${event.title}" (${event.type}) on ${event.datetime}.`,
  });
}

/* =========================================================================
   AUTO-SCROLLING GALLERY COMPONENT (Active Only for Completed Events)
   ========================================================================= */
function EventCardBanner({
  event,
  isPast,
}: {
  event: EventPost & { images?: string[] };
  isPast: boolean;
}) {
  const imageList: string[] =
    Array.isArray(event.images) && event.images.length > 0
      ? event.images
      : event.image
      ? [event.image]
      : [];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll loop: shifts to the next image every 3 seconds (pauses on hover)
  useEffect(() => {
    if (!isPast || imageList.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => {
        const nextSlide = (prev + 1) % imageList.length;
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            left: nextSlide * scrollRef.current.clientWidth,
            behavior: "smooth",
          });
        }
        return nextSlide;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isPast, imageList.length, isPaused]);

  // If upcoming OR completed with only 1 image: standard static preview
  if (!isPast || imageList.length <= 1) {
    return (
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        {imageList[0] ? (
          <img
            src={imageList[0]}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
            <Calendar className="h-12 w-12 text-slate-300" />
          </div>
        )}
        <span
          className={`absolute right-3.5 top-3.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${
            isPast ? "bg-slate-900/80 text-purple-300" : "bg-slate-900/80 text-sky-300"
          }`}
        >
          {event.status}
        </span>
      </div>
    );
  }

  // Synchronize dot position if manually scrolled or swiped on touch screens
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth > 0) {
      setActiveSlide(Math.round(scrollLeft / clientWidth));
    }
  };

  return (
    <div
      className="group relative h-48 w-full overflow-hidden bg-slate-900 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {imageList.map((src, index) => (
          <div key={index} className="h-full w-full shrink-0 snap-start relative">
            <img
              src={src}
              alt={`${event.title} photo ${index + 1}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Completed Status Badge */}
      <span className="pointer-events-none absolute right-3.5 top-3.5 z-10 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-purple-300 backdrop-blur-sm shadow-sm">
        Completed
      </span>

      {/* Modern Pill Dot Indicators */}
      <div className="pointer-events-none absolute bottom-2.5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-sm">
        {imageList.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeSlide ? "w-4 bg-sky-400" : "w-1.5 bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function CareersAndEvents() {
  const jobs = useJobs();
  const events = useEvents();
  const [eventTab, setEventTab] = useState<"upcoming" | "past">("upcoming");
  const [selectedEvent, setSelectedEvent] = useState<EventPost | null>(null);

  const activeJobs = jobs.filter((job) => job.status === "Active");
  const upcomingEvents = events.filter((event) => event.status !== "Completed");
  const completedHackathons = events.filter(
    (event) => event.status === "Completed" || event.type === "Hackathon"
  );

  const displayedEvents = eventTab === "upcoming" ? upcomingEvents : completedHackathons;

  return (
    <>
      {/* =========================================
          CAREERS SECTION
      ========================================= */}
      <section id="careers" className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-2xl text-center anim-slide-up">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 border border-sky-100">
              <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
              We&apos;re Hiring
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Careers &amp; Open Positions
            </h2>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              Join a team building real-world enterprise software and mentoring the next generation of engineers.
            </p>
          </div>

          {activeJobs.length === 0 ? (
            <p className="mt-12 text-center text-sm text-slate-500">
              No open positions right now. Check back soon or reach out through our contact form.
            </p>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {activeJobs.map((job, idx) => (
                <div
                  key={job.id}
                  className={`anim-slide-up stagger-${(idx % 4) + 1} flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-sky-500/10 hover:border-[#0284c7] cursor-pointer`}
                >
                  <div>
                    {/* Top Image Banner with Pill Badge */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      {job.image ? (
                        <img
                          src={job.image}
                          alt={job.title}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                          <Briefcase className="h-12 w-12 text-slate-300" />
                        </div>
                      )}

                      <span className="absolute right-3.5 top-3.5 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm shadow-sm">
                        {job.type || "Full-time"}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs font-semibold text-sky-600">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5" />
                          {job.department || "Engineering"}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location || "Hybrid"}
                        </span>
                      </div>

                      <h3 className="mt-3 text-xl font-bold text-slate-900 tracking-tight line-clamp-1">
                        {job.title}
                      </h3>

                      <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-2">
                        {job.skills ? (
                          <>
                            <strong className="text-slate-800">Skills : </strong>
                            {job.skills}
                          </>
                        ) : (
                          job.description
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 pb-6">
                    <hr className="border-slate-100 mb-4" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{job.postedDate || "19-09-2026"}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => applyForJob(job)}
                        className="anim-ripple inline-flex items-center gap-2 rounded-xl bg-[#1d6bf3] hover:bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:scale-105"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================
          EVENTS & HACKATHONS
      ========================================= */}
      <section id="events" className="bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-2xl text-center anim-slide-up">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              Community &amp; Innovation
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Events &amp; Hackathons
            </h2>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
              Explore upcoming development workshops or review our completed national student hackathons.
            </p>

            {/* Filter Toggle */}
            <div className="mt-8 inline-flex p-1 bg-slate-200/80 rounded-xl">
              <button
                type="button"
                onClick={() => setEventTab("upcoming")}
                className={`anim-ripple px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  eventTab === "upcoming"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-300/50"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Upcoming Events ({upcomingEvents.length})
              </button>
              <button
                type="button"
                onClick={() => setEventTab("past")}
                className={`anim-ripple px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  eventTab === "past"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-300/50"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Completed Hackathons ({completedHackathons.length})
              </button>
            </div>
          </div>

          {displayedEvents.length === 0 ? (
            <p className="mt-12 text-center text-sm text-slate-500">
              {eventTab === "upcoming"
                ? "No upcoming events scheduled right now. Check back soon!"
                : "No past hackathon archives available."}
            </p>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {displayedEvents.map((event, idx) => {
                const isPast = event.status === "Completed";
                const isLongText = (event.summary || "").length > 110;

                return (
                  <div
                    key={event.id}
                    className={`anim-slide-up stagger-${(idx % 4) + 1} flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-sky-500/10 hover:border-[#0284c7]`}
                  >
                    <div>
                      {/* Banner Image / Auto-Scrollable Gallery */}
                      <EventCardBanner event={event} isPast={isPast} />

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5" />
                            {event.type || "Hackathon"}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {event.location || "Hybrid"}
                          </span>
                        </div>

                        <h3 className="mt-3 text-xl font-bold text-slate-900 tracking-tight line-clamp-1">
                          {event.title}
                        </h3>

                        <div className="mt-3">
                          <p className="text-xs leading-relaxed text-slate-600 line-clamp-2">
                            <strong className="text-slate-800">Highlights : </strong>
                            {event.summary}
                          </p>
                          {isLongText && (
                            <button
                              type="button"
                              onClick={() => setSelectedEvent(event)}
                              className="mt-1 text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline transition-all"
                            >
                              Read More →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6">
                      <hr className="border-slate-100 mb-4" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="truncate max-w-[130px] sm:max-w-[150px]">
                            {event.datetime}
                          </span>
                        </div>

                        {!isPast ? (
                          <button
                            type="button"
                            onClick={() => registerForEvent(event)}
                            className="anim-ripple inline-flex items-center gap-2 rounded-xl bg-[#1d6bf3] hover:bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:scale-105"
                          >
                            <Users className="h-3.5 w-3.5" />
                            Register Now
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================================
          MODAL POPUP
      ========================================= */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in-up">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="anim-ripple absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {selectedEvent.image && (
              <div className="mb-6 h-60 w-full overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-2">
              <span>{selectedEvent.type}</span>
              <span>•</span>
              <span>{selectedEvent.location}</span>
              <span>•</span>
              <span className="text-slate-500">{selectedEvent.datetime}</span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900">
              {selectedEvent.title}
            </h3>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Event Highlights &amp; Full Report
              </h4>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                {selectedEvent.summary}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="anim-ripple rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>

              {selectedEvent.status !== "Completed" && (
                <button
                  type="button"
                  onClick={() => {
                    const evt = selectedEvent;
                    setSelectedEvent(null);
                    registerForEvent(evt);
                  }}
                  className="anim-ripple inline-flex items-center gap-2 rounded-xl bg-[#1d6bf3] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-600 cursor-pointer"
                >
                  <Users className="h-4 w-4" />
                  Register for Event
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
"use client";

import { useSyncExternalStore } from "react";

export interface JobPost {
  id: string;
  title: string;
  department: string;
  type: "Full-time" | "Internship" | "Part-time" | string;
  location: "On-site Madurai" | "Hybrid" | "Remote" | string;
  experience: string;
  description: string;
  status: "Active" | "Closed";
  image?: string;
  skills?: string;
  postedDate?: string;
}

export interface EventPost {
  id: string;
  title: string;
  type: "Hackathon" | "Workshop" | "Bootcamp" | "Tech Talk";
  status: "Upcoming" | "Live" | "Completed";
  datetime: string;
  location: string;
  summary: string;
  registrationLink?: string;
  image?: string;
  images?: string[];
}

interface CmsState {
  jobs: JobPost[];
  events: EventPost[];
}

const STORAGE_KEY = "roweb-cms-v1";
const LOCAL_SYNC_EVENT = "roweb-cms-sync";

const defaultJobs: JobPost[] = [
  {
    id: "job-ml-spec",
    title: "Machine Learning specialist",
    department: "IT",
    type: "Full Time",
    location: "Madurai",
    experience: "1-3 years",
    description: "Build and deploy scalable machine learning architectures, statistical data models, and automated pipeline solutions.",
    skills: "Data Processing, Python, Machine learning concepts",
    postedDate: "18-09-2026",
    status: "Active",
    image: "",
  },
  {
    id: "job-fullstack",
    title: "Full Stack Developer (React / Node.js)",
    department: "Engineering",
    type: "Full-time",
    location: "Hybrid",
    experience: "1-3 years",
    description: "Build and ship production web apps across the stack using React, Node.js, and modern cloud tooling alongside a collaborative product team.",
    skills: "React, Node.js, Next.js, Tailwind CSS, REST APIs",
    postedDate: "18-09-2026",
    status: "Active",
    image: "",
  },
  {
    id: "job-ai-intern",
    title: "AI Automation Intern",
    department: "AI Solutions",
    type: "Internship",
    location: "Remote",
    experience: "Fresher / Student",
    description: "Work hands-on with LLM workflows, chatbots, and automation pipelines while being mentored on real client projects.",
    skills: "Python, OpenAI APIs, Prompt Engineering, Git",
    postedDate: "18-09-2026",
    status: "Active",
    image: "",
  },
];

const defaultEvents: EventPost[] = [
  {
    id: "event-hackathon-2026",
    title: "RoboWeb State-Level Hackathon 2026",
    type: "Hackathon",
    datetime: "March 14-15, 2026 • 24 Hours",
    location: "Hybrid",
    registrationLink: "",
    summary: "A 24-hour state-level hackathon where student teams build real solutions across web, AI, and IoT tracks with mentorship and prizes.",
    status: "Upcoming",
    image: "",
    images: [],
  },
  {
    id: "event-genai-bootcamp",
    title: "Hands-on Generative AI & Automation Bootcamp",
    type: "Workshop",
    datetime: "February 8, 2026 • 10:00 AM",
    location: "On-site Madurai",
    registrationLink: "",
    summary: "A practical technical workshop covering prompt engineering, building automations, and deploying generative AI features end to end.",
    status: "Upcoming",
    image: "",
    images: [],
  },
];

let state: CmsState = { jobs: defaultJobs, events: defaultEvents };
const listeners = new Set<() => void>();
let initialized = false;

function emit() {
  for (const listener of listeners) listener();
}

export function ensureHydrated() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CmsState>;
      state = {
        jobs: Array.isArray(parsed.jobs) && parsed.jobs.length > 0 ? parsed.jobs : defaultJobs,
        events: Array.isArray(parsed.events) && parsed.events.length > 0 ? parsed.events : defaultEvents,
      };
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (err) {
    console.warn("Storage hydration warning:", err);
  }

  // Cross-tab sync
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      state = JSON.parse(event.newValue) as CmsState;
      emit();
    } catch {}
  });

  // Same-window sync
  window.addEventListener(LOCAL_SYNC_EVENT, () => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        state = JSON.parse(raw) as CmsState;
        emit();
      }
    } catch {}
  });
}

function setState(next: CmsState) {
  state = next;
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(LOCAL_SYNC_EVENT));
    }
  } catch (err) {
    console.error("Storage full or unavailable. Could not save to localStorage:", err);
    alert("Warning: LocalStorage quota exceeded. Please upload optimized/smaller images.");
  }
  emit();
}

function subscribe(listener: () => void) {
  ensureHydrated();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Jobs Handlers
export function addJob(input: Omit<JobPost, "id">) {
  ensureHydrated();
  setState({ ...state, jobs: [{ ...input, id: createId("job") }, ...state.jobs] });
}

export function updateJob(id: string, updatedData: Partial<JobPost>) {
  ensureHydrated();
  setState({
    ...state,
    jobs: state.jobs.map((job) => (job.id === id ? { ...job, ...updatedData } : job)),
  });
}

export function toggleJobStatus(id: string) {
  ensureHydrated();
  setState({
    ...state,
    jobs: state.jobs.map((job) =>
      job.id === id ? { ...job, status: job.status === "Active" ? "Closed" : "Active" } : job
    ),
  });
}

export function deleteJob(id: string) {
  ensureHydrated();
  setState({ ...state, jobs: state.jobs.filter((job) => job.id !== id) });
}

// Events Handlers
export function addEvent(input: Omit<EventPost, "id">) {
  ensureHydrated();
  const normalizedImages =
    input.images && input.images.length > 0
      ? input.images
      : input.image
      ? [input.image]
      : [];

  const newEvent: EventPost = {
    ...input,
    id: createId("event"),
    image: normalizedImages[0] || "",
    images: normalizedImages,
  };

  setState({ ...state, events: [newEvent, ...state.events] });
}

export function updateEvent(id: string, updatedData: Partial<EventPost>) {
  ensureHydrated();
  setState({
    ...state,
    events: state.events.map((event) => {
      if (event.id !== id) return event;

      const mergedImages =
        updatedData.images && updatedData.images.length > 0
          ? updatedData.images
          : updatedData.image
          ? [updatedData.image]
          : event.images || (event.image ? [event.image] : []);

      return {
        ...event,
        ...updatedData,
        image: mergedImages[0] || "",
        images: mergedImages,
      };
    }),
  });
}

export function setEventStatus(id: string, status: EventPost["status"]) {
  ensureHydrated();
  setState({
    ...state,
    events: state.events.map((event) => (event.id === id ? { ...event, status } : event)),
  });
}

export function deleteEvent(id: string) {
  ensureHydrated();
  setState({ ...state, events: state.events.filter((event) => event.id !== id) });
}

// Sync Hooks
export function useJobs() {
  ensureHydrated();
  return useSyncExternalStore(
    subscribe,
    () => {
      ensureHydrated();
      return state.jobs;
    },
    () => defaultJobs
  );
}

export function useEvents() {
  ensureHydrated();
  return useSyncExternalStore(
    subscribe,
    () => {
      ensureHydrated();
      return state.events;
    },
    () => defaultEvents
  );
}

// Inter-component prefill bridge
export interface ApplyPrefill {
  tab: "business" | "internship";
  selection?: string;
  organization?: string;
  message?: string;
}

export const APPLY_EVENT = "roweb:apply";

export function requestApply(prefill: ApplyPrefill) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ApplyPrefill>(APPLY_EVENT, { detail: prefill }));
  window.requestAnimationFrame(() => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  });
}
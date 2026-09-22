// Central data source for RoboWeb Technologies.
// All site content (company info, services, training, process, events, jobs) is exported from here.

export interface CompanyInfo {
  name: string
  tagline: string
  founderBackground: string
  phone: string
  email: string
  address: string
  hours: string
  // Added for Whitelabeling:
  logoUrl: string
  mapEmbedUrl: string
  googleMapsUrl: string
}

export interface Stat {
  value: string
  label: string
}

export interface Service {
  id: string
  title: string
  description: string
  features: string[]
}

export interface Course {
  id: string
  title: string
  description: string
  technologies: string[]
}

export interface ProcessStep {
  step: string
  title: string
  description: string
}

export interface Industry {
  id: string
  name: string
  description: string
}

export interface EventItem {
  id: string
  title: string
  date: string
  type: "upcoming" | "past_hackathon"
  description: string
  location: string
  registrationLink?: string
}

export interface JobOpening {
  id: string
  role: string
  type: "Full-time" | "Part-time" | "Internship"
  location: string
  experience: string
  status: "Open" | "Closed"
}

export const companyInfo: CompanyInfo = {
  name: "Your Client Name", // <-- Change to client/brand name
  tagline: "Innovative Software • AI • Training • Robotics",
  founderBackground:
    "Founded by an IT professional with enterprise software engineering experience at Tata Consultancy Services (TCS).",
  phone: "+91-9150008650", // <-- Change to client phone number
  email: "contact@clientbrand.com", // <-- Change to client email
  address:
    "39, 1st floor, Gandhi Nagar, Sathamangalam, Sivagangai road, Near Anna Bus Stand, Opposite HP Petrol Bunk, Madurai, Tamil Nadu, India - 625020", // <-- Change to client address
  hours: "Monday - Saturday: 9:30 AM - 7:00 PM",
  // Logo & Maps:
  logoUrl: "/logo.png", // <-- Replace public/logo.png or place new image link here
  mapEmbedUrl:
    "https://maps.google.com/maps?q=39+Gandhi+Nagar+Sathamangalam+Madurai+625020&t=&z=15&ie=UTF8&iwloc=&output=embed",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=39+Gandhi+Nagar+Sathamangalam+Madurai+Tamil+Nadu+625020",
}

export const stats: Stat[] = [
  { value: "120+", label: "Software Solutions Delivered" },
  { value: "3,000+", label: "Students Mentored" },
  { value: "25+", label: "Hackathons & Tech Events" },
  { value: "99.4%", label: "Client Satisfaction" },
]

export const services: Service[] = [
  {
    id: "web-development",
    title: "Web Development",
    description:
      "Corporate websites, portals, e-commerce platforms, and custom web applications built for performance and scale.",
    features: ["Corporate Sites", "Portals", "E-Commerce", "Custom Web Apps"],
  },
  {
    id: "mobile-app-development",
    title: "Mobile App Development",
    description:
      "Native Android and cross-platform mobile applications delivering seamless experiences across devices.",
    features: ["Native Android", "Cross-Platform", "App Store Deployment", "UI/UX Focused"],
  },
  {
    id: "custom-software",
    title: "Custom Software",
    description:
      "Tailored ERP, CRM, inventory, and billing systems designed around your unique business workflows.",
    features: ["ERP Systems", "CRM", "Inventory Management", "Billing Systems"],
  },
  {
    id: "ai-automations-chatbots",
    title: "AI Automations & Chatbots",
    description:
      "Workflow automation, intelligent chatbots, and AI agents that reduce manual effort and boost productivity.",
    features: ["Workflow Automation", "Chatbots", "Intelligent Agents", "Process Optimization"],
  },
  {
    id: "cloud-deployment",
    title: "Cloud & Deployment",
    description:
      "End-to-end cloud hosting, domain setup, and infrastructure management for reliable, scalable deployments.",
    features: ["Cloud Hosting", "Domain Setup", "Infrastructure", "Scalability"],
  },
  {
    id: "support-maintenance",
    title: "Support & Maintenance",
    description:
      "Ongoing bug fixes, security updates, and feature upgrades to keep your systems secure and up to date.",
    features: ["Bug Fixes", "Security Updates", "Feature Upgrades", "24/7 Monitoring"],
  },
]

export const trainingCourses: Course[] = [
  {
    id: "full-stack-web-development",
    title: "Full Stack Web Development",
    description:
      "Master modern front-end and back-end development to build production-ready web applications.",
    technologies: ["React", "Next.js", "Node.js", "Express", "PostgreSQL"],
  },
  {
    id: "ai-machine-learning",
    title: "AI & Machine Learning",
    description:
      "Learn to build and deploy machine learning models and generative AI-powered automation systems.",
    technologies: ["Python", "ML Models", "Generative AI", "Automation"],
  },
  {
    id: "data-science-analytics",
    title: "Data Science & Analytics",
    description:
      "Turn raw data into actionable insights with analytics, visualization, and business intelligence.",
    technologies: ["SQL", "Python", "Data Visualization", "Business Intelligence"],
  },
  {
    id: "cyber-security",
    title: "Cyber Security",
    description:
      "Develop practical security skills across ethical hacking, network defense, and penetration testing.",
    technologies: ["Ethical Hacking", "Network Security", "Penetration Testing"],
  },
  {
    id: "robotics-embedded-systems",
    title: "Robotics & Embedded Systems",
    description:
      "Build hardware automation projects using sensors, microcontrollers, and embedded programming.",
    technologies: ["Sensors", "Microcontrollers", "Hardware Automation"],
  },
]

// Internships mirror the training tracks, offered as hands-on, project-based programs.
export const internships: Course[] = trainingCourses

export const developmentProcess: ProcessStep[] = [
  {
    step: "01",
    title: "Requirement Analysis",
    description: "We deeply understand your goals, users, and constraints to define clear project requirements.",
  },
  {
    step: "02",
    title: "Strategic Planning",
    description: "We map out architecture, timelines, and milestones to ensure a smooth delivery.",
  },
  {
    step: "03",
    title: "UI / UX Design",
    description: "We craft intuitive, engaging interfaces focused on usability and brand consistency.",
  },
  {
    step: "04",
    title: "Agile Development",
    description: "We build in iterative sprints with continuous feedback and transparent progress.",
  },
  {
    step: "05",
    title: "Testing & QA",
    description: "We rigorously test for functionality, performance, and security before release.",
  },
  {
    step: "06",
    title: "Deployment & Support",
    description: "We deploy to production and provide ongoing support, updates, and maintenance.",
  },
]

export const industriesServed: Industry[] = [
  {
    id: "education",
    name: "Education",
    description: "Learning platforms, student portals, and institutional management systems.",
  },
  {
    id: "corporate-businesses",
    name: "Corporate Businesses",
    description: "Enterprise software, internal tools, and digital transformation solutions.",
  },
  {
    id: "retail-ecommerce",
    name: "Retail & E-Commerce",
    description: "Online stores, inventory systems, and customer engagement platforms.",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Patient management, scheduling, and secure health information systems.",
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    description: "Automation, ERP, and production tracking for operational efficiency.",
  },
  {
    id: "startups-smes",
    name: "Startups & SMEs",
    description: "Cost-effective, scalable software to help growing businesses thrive.",
  },
]

// Initial seed data for Events, Completed Hackathons, and Job Openings
export const initialEvents: EventItem[] = [
  {
    id: "evt-1",
    title: "National AI & Robotics Hackathon 2026",
    date: "October 10-12, 2026",
    type: "upcoming",
    description: "48-hour national hackathon focused on edge robotics perception and LLM pipelines.",
    location: "Hybrid / Madurai Campus",
    registrationLink: "https://www.robowebtechnologies.co.in",
  },
  {
    id: "evt-2",
    title: "RoboWeb Web3 & AI Hackathon Sprint",
    date: "Completed",
    type: "past_hackathon",
    description: "Over 400+ student participants and 45 projects built and evaluated under enterprise mentor standards.",
    location: "Madurai Campus",
  },
]

export const initialJobs: JobOpening[] = [
  {
    id: "job-1",
    role: "Full-Stack Web Engineering Intern",
    type: "Internship",
    location: "Hybrid / Madurai",
    experience: "Freshers / Students",
    status: "Open",
  },
  {
    id: "job-2",
    role: "AI & Embedded Systems Mentor",
    type: "Full-time",
    location: "Madurai",
    experience: "1-3 Years",
    status: "Open",
  },
]
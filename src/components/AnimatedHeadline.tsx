"use client";

import React, { useState, useEffect } from "react";

interface AnimatedHeadlineProps {
  phrases?: string[];
  prefix?: string;
  className?: string;
}

export default function AnimatedHeadline({
  phrases = [
    "Enterprise Software Solutions",
    "Real-World Hands-on Internships",
    "Generative AI & Automation Tools",
  ],
  prefix = "Building Next-Gen",
  className = "",
}: AnimatedHeadlineProps) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (subIndex === phrases[index].length + 1 && !isDeleting) {
      const timeout = setTimeout(() => setIsDeleting(true), 1800);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? 30 : 65);

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, phrases]);

  return (
    <h1 className={`font-extrabold tracking-tight ${className}`}>
      <span>{prefix} </span>
      <span className="text-sky-500 inline-block">
        {phrases[index].substring(0, subIndex)}
        <span className="animate-pulse text-sky-400">|</span>
      </span>
    </h1>
  );
}
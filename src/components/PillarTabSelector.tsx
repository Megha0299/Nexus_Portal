"use client";

import React, { useRef, useState, useEffect } from "react";

interface TabSelectorProps {
  activeTab: "enterprise" | "edtech";
  onChange: (tab: "enterprise" | "edtech") => void;
}

export default function PillarTabSelector({
  activeTab,
  onChange,
}: TabSelectorProps) {
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
  const enterpriseRef = useRef<HTMLButtonElement>(null);
  const edtechRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const target = activeTab === "enterprise" ? enterpriseRef.current : edtechRef.current;
    if (target) {
      setSliderStyle({
        left: target.offsetLeft,
        width: target.offsetWidth,
      });
    }
  }, [activeTab]);

  return (
    <div className="relative inline-flex items-center p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl">
      {/* Sliding Underlay with Soft Cyan/Purple Gradient */}
      <div
        className="tab-slider absolute top-1.5 bottom-1.5 rounded-xl pointer-events-none"
        style={{
          transform: `translateX(${sliderStyle.left}px)`,
          width: `${sliderStyle.width}px`,
          background:
            activeTab === "enterprise"
              ? "linear-gradient(135deg, #0284c7, #0369a1)"
              : "linear-gradient(135deg, #9333ea, #7e22ce)",
          boxShadow:
            activeTab === "enterprise"
              ? "0 0 20px rgba(14, 165, 233, 0.45)"
              : "0 0 20px rgba(168, 85, 247, 0.45)",
        }}
      />

      <button
        ref={enterpriseRef}
        type="button"
        onClick={() => onChange("enterprise")}
        className={`relative z-10 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-200 ${
          activeTab === "enterprise" ? "text-white" : "text-slate-400 hover:text-slate-200"
        }`}
      >
        Enterprise Engineering
      </button>

      <button
        ref={edtechRef}
        type="button"
        onClick={() => onChange("edtech")}
        className={`relative z-10 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-200 ${
          activeTab === "edtech" ? "text-white" : "text-slate-400 hover:text-slate-200"
        }`}
      >
        EdTech &amp; Academy
      </button>
    </div>
  );
}
"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  ShareNetwork,
  Brain,
  ChatTeardropText,
  At,
  MapPin,
  CurrencyDollarSimple,
  ArrowsClockwise,
} from "@phosphor-icons/react"

const FEATURES = [
  {
    icon: ShareNetwork,
    color: "var(--terracotta)",
    title: "Share Your Notes",
    desc: "Upload class notes and make them available to every UIUC student studying the same course. Post rich text, attach PDFs or images, and tag your course code.",
    number: "01",
  },
  {
    icon: Brain,
    color: "var(--ochre)",
    title: "AI Summarizer",
    desc: "Instantly condense long lecture notes into crisp, scannable summaries powered by GPT-4o-mini. Stop re-reading — start reviewing.",
    number: "02",
  },
  {
    icon: ChatTeardropText,
    color: "var(--indigo-brand)",
    title: "AI Tutor Chat",
    desc: "Ask questions about any note and get context-aware answers from your personal AI tutor. The AI reads the note so your questions actually make sense.",
    number: "03",
  },
  {
    icon: At,
    color: "var(--sage)",
    title: "Comments & @Mentions",
    desc: "Discuss notes with classmates, ask questions in context, and @mention people to notify them directly. Study groups built in.",
    number: "04",
  },
  {
    icon: MapPin,
    color: "var(--terracotta)",
    title: "Built for UIUC",
    desc: "Covers 350+ UIUC courses. Search by subject, course code, or professor — not a generic notes app, this is made for Illinois.",
    number: "05",
  },
  {
    icon: CurrencyDollarSimple,
    color: "var(--sage)",
    title: "Completely Free",
    desc: "Share one note to unlock the entire feed. No subscriptions, no paywalls, no hidden tiers — ever. Study tools shouldn't cost money.",
    number: "06",
  },
  {
    icon: ArrowsClockwise,
    color: "var(--ochre)",
    title: "Real-Time Updates",
    desc: "New notes appear instantly. See likes and comments update live without refreshing. The feed is always current.",
    number: "07",
  },
]

export function FeaturesCarousel() {
  const [active, setActive] = useState(0)
  const [openMobile, setOpenMobile] = useState<number | null>(0)
  const pausedRef = useRef(false)
  const feature = FEATURES[active]
  const Icon = feature.icon

  const advance = useCallback(() => {
    setActive((i) => (i + 1) % FEATURES.length)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) advance()
    }, 3500)
    return () => clearInterval(id)
  }, [advance])

  function selectFeature(i: number) {
    setActive(i)
    // Reset the interval implicitly by letting the effect re-run isn't needed;
    // the timer will just fire at its normal cadence after manual selection.
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* ── Desktop: two-column selector layout ── */}
      <div
        className="hidden md:grid md:grid-cols-[260px_1fr] gap-3"
        onMouseEnter={() => { pausedRef.current = true }}
        onMouseLeave={() => { pausedRef.current = false }}
      >
        {/* Left: feature list */}
        <div className="flex flex-col gap-1">
          {FEATURES.map((f, i) => {
            const FIcon = f.icon
            const isActive = i === active
            return (
              <button
                key={i}
                onClick={() => selectFeature(i)}
                className={`
                  group flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                  ${isActive
                    ? "bg-card border border-border shadow-[var(--shadow-sm)]"
                    : "hover:bg-muted/60 border border-transparent"
                  }
                `}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
                  style={{
                    backgroundColor: isActive
                      ? `color-mix(in srgb, ${f.color} 16%, transparent)`
                      : "transparent",
                  }}
                >
                  <FIcon
                    size={17}
                    weight="bold"
                    style={{ color: isActive ? f.color : "var(--muted-foreground)" }}
                    className="transition-colors duration-200"
                  />
                </div>
                <span
                  className={`text-sm transition-colors duration-200 ${
                    isActive ? "font-semibold text-foreground" : "font-medium text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {f.title}
                </span>
                {isActive && (
                  <span
                    className="ml-auto text-xs font-mono tabular-nums"
                    style={{ color: f.color }}
                  >
                    {f.number}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Right: detail panel */}
        <div
          key={active}
          className="relative bg-card border border-border rounded-2xl p-8 shadow-[var(--shadow-md)] overflow-hidden"
          style={{
            borderLeft: `3px solid ${feature.color}`,
            animation: "featureFadeIn 0.25s ease forwards",
          }}
        >
          {/* Large background number */}
          <span
            className="absolute right-6 top-4 text-[120px] font-black font-serif leading-none select-none pointer-events-none"
            style={{ color: `color-mix(in srgb, ${feature.color} 6%, transparent)` }}
          >
            {feature.number}
          </span>

          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
            style={{ backgroundColor: `color-mix(in srgb, ${feature.color} 12%, transparent)` }}
          >
            <Icon size={28} weight="bold" style={{ color: feature.color }} />
          </div>

          {/* Text */}
          <h3 className="font-serif font-bold text-2xl mb-3 leading-snug">{feature.title}</h3>
          <p className="text-muted-foreground leading-relaxed max-w-md">{feature.desc}</p>

          {/* Subtle bottom accent line */}
          <div
            className="absolute bottom-0 left-0 h-0.5 w-24 rounded-full"
            style={{ background: `linear-gradient(to right, ${feature.color}, transparent)` }}
          />
        </div>
      </div>

      {/* ── Mobile: accordion ── */}
      <div className="flex flex-col gap-2 md:hidden">
        {FEATURES.map((f, i) => {
          const FIcon = f.icon
          const isOpen = openMobile === i
          return (
            <div
              key={i}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen ? "bg-card border-border shadow-[var(--shadow-sm)]" : "border-transparent bg-muted/40"
              }`}
            >
              <button
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                onClick={() => setOpenMobile(isOpen ? null : i)}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    backgroundColor: isOpen ? `color-mix(in srgb, ${f.color} 16%, transparent)` : "transparent",
                  }}
                >
                  <FIcon size={17} weight="bold" style={{ color: isOpen ? f.color : "var(--muted-foreground)" }} />
                </div>
                <span className={`text-sm flex-1 ${isOpen ? "font-semibold text-foreground" : "font-medium text-muted-foreground"}`}>
                  {f.title}
                </span>
                <span
                  className="text-xs font-mono"
                  style={{ color: isOpen ? f.color : "var(--muted-foreground)" }}
                >
                  {f.number}
                </span>
              </button>
              {isOpen && (
                <div
                  className="px-4 pb-4"
                  style={{ animation: "featureFadeIn 0.2s ease forwards" }}
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes featureFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

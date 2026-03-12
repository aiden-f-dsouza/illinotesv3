"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { CaretLeft, CaretRight, ShareNetwork, Brain, ChatTeardropText, At, MapPin, CurrencyDollarSimple, ArrowsClockwise } from "@phosphor-icons/react"

const FEATURES = [
  {
    icon: ShareNetwork,
    color: "var(--terracotta)",
    title: "Share Your Notes",
    desc: "Upload class notes and make them available to every UIUC student studying the same course.",
  },
  {
    icon: Brain,
    color: "var(--ochre)",
    title: "AI Summarizer",
    desc: "Instantly condense long lecture notes into crisp, scannable summaries powered by GPT-4o-mini.",
  },
  {
    icon: ChatTeardropText,
    color: "var(--indigo-brand)",
    title: "AI Tutor Chat",
    desc: "Ask questions about any note and get context-aware answers from your personal AI tutor.",
  },
  {
    icon: At,
    color: "var(--sage)",
    title: "Comments & @Mentions",
    desc: "Discuss notes with classmates, ask questions in context, and @mention people to notify them.",
  },
  {
    icon: MapPin,
    color: "var(--terracotta)",
    title: "Built for UIUC",
    desc: "Covers 350+ UIUC courses. Search by subject, course code, or professor.",
  },
  {
    icon: CurrencyDollarSimple,
    color: "var(--sage)",
    title: "Completely Free",
    desc: "Share one note to unlock the entire feed. No subscriptions, no paywalls — ever.",
  },
  {
    icon: ArrowsClockwise,
    color: "var(--ochre)",
    title: "Real-Time Updates",
    desc: "New notes appear instantly. See likes and comments update live without refreshing.",
  },
]

const SPEED = 0.5
const CARD_WIDTH = 280
const CARD_GAP = 20

export function FeaturesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const posRef = useRef(0)
  const pausedRef = useRef(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const totalWidth = FEATURES.length * (CARD_WIDTH + CARD_GAP)

  const updateDot = useCallback(() => {
    const idx = Math.round((posRef.current % totalWidth) / (CARD_WIDTH + CARD_GAP)) % FEATURES.length
    setActiveIndex((FEATURES.length - idx) % FEATURES.length)
  }, [totalWidth])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    function step() {
      if (!pausedRef.current) {
        posRef.current = (posRef.current + SPEED) % totalWidth
        if (track) {
          track.style.transform = `translateX(-${posRef.current}px)`
        }
        updateDot()
      }
      animRef.current = requestAnimationFrame(step)
    }

    animRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animRef.current)
  }, [totalWidth, updateDot])

  function scrollBy(delta: number) {
    posRef.current = ((posRef.current + delta * (CARD_WIDTH + CARD_GAP)) % totalWidth + totalWidth) % totalWidth
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`
    }
    updateDot()
  }

  function goToDot(index: number) {
    const target = ((FEATURES.length - index) % FEATURES.length) * (CARD_WIDTH + CARD_GAP)
    posRef.current = target % totalWidth
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`
    }
    setActiveIndex(index)
  }

  return (
    <div className="w-full">
      {/* Carousel viewport */}
      <div
        className="overflow-hidden relative"
        onMouseEnter={() => { pausedRef.current = true }}
        onMouseLeave={() => { pausedRef.current = false }}
        onTouchStart={() => { pausedRef.current = true }}
        onTouchEnd={() => { pausedRef.current = false }}
      >
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ gap: CARD_GAP, paddingLeft: 24, paddingRight: 24, paddingTop: 16, paddingBottom: 24 }}
        >
          {/* Render two copies for seamless loop */}
          {[...FEATURES, ...FEATURES].map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={i}
                className="shrink-0 bg-card border border-border rounded-xl p-6 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow"
                style={{ width: CARD_WIDTH }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `color-mix(in srgb, ${feature.color} 12%, transparent)` }}
                >
                  <Icon size={22} weight="bold" style={{ color: feature.color }} />
                </div>
                <h3 className="font-serif font-bold text-base mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => scrollBy(-1)}
          className="w-8 h-8 rounded-full border border-border bg-background hover:bg-accent flex items-center justify-center transition-colors"
          aria-label="Previous"
        >
          <CaretLeft size={14} weight="bold" />
        </button>

        <div className="flex items-center gap-1.5">
          {FEATURES.map((_, i) => (
            <button
              key={i}
              onClick={() => goToDot(i)}
              className={`rounded-full transition-all ${
                activeIndex === i
                  ? "w-5 h-2 bg-[var(--terracotta)]"
                  : "w-2 h-2 bg-border hover:bg-muted-foreground"
              }`}
              aria-label={`Go to feature ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => scrollBy(1)}
          className="w-8 h-8 rounded-full border border-border bg-background hover:bg-accent flex items-center justify-center transition-colors"
          aria-label="Next"
        >
          <CaretRight size={14} weight="bold" />
        </button>
      </div>
    </div>
  )
}

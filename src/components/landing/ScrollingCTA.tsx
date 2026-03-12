"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function ScrollingCTA() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Hero button */}
      <div ref={heroRef} className="flex justify-center">
        <Link href="/signup">
          <Button
            size="lg"
            className="border-0 bg-gradient-to-br from-[var(--terracotta)] to-[var(--ochre)] text-white hover:opacity-90 text-base px-8 h-12"
            style={{ boxShadow: "0 0 32px 6px color-mix(in srgb, var(--terracotta) 45%, transparent)" }}
          >
            Start Sharing Notes
          </Button>
        </Link>
      </div>

      {/* Sticky version — floats into top-right when hero button leaves viewport */}
      <div
        aria-hidden={!showSticky}
        className="fixed top-4 right-4 z-[1002] flex items-center transition-[opacity,transform] duration-300 ease-out"
        style={{
          opacity: showSticky ? 1 : 0,
          transform: showSticky ? "translateZ(0)" : "translateY(-4px) translateZ(0)",
          pointerEvents: showSticky ? "auto" : "none",
        }}
      >
        <Link href="/signup" tabIndex={showSticky ? 0 : -1}>
          <Button
            className="border-0 bg-[var(--terracotta)] hover:bg-[var(--terracotta)]/90 text-white px-5 h-9 text-sm"
            style={{ boxShadow: "0 0 18px 4px color-mix(in srgb, var(--terracotta) 40%, transparent)" }}
          >
            Start Sharing Notes
          </Button>
        </Link>
      </div>
    </>
  )
}

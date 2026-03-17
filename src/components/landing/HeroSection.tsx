"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ScrollingCTA } from "./ScrollingCTA"
import { BrowserMockup } from "./BrowserMockup"

const ease = [0.16, 1, 0.3, 1] as const
const IMAGE_SRC = "/hero-campus-background.png"

export function HeroSection() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let done = false
    function reveal() {
      if (done) return
      done = true
      setReady(true)
    }

    const img = new window.Image()
    img.onload = reveal
    img.onerror = reveal // reveal even on failure so page never hangs
    img.src = IMAGE_SRC

    // Fallback: reveal after 2.5s regardless
    const timer = setTimeout(reveal, 2500)
    return () => clearTimeout(timer)
  }, [])

  const word = (delayMs: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.6, ease, delay: delayMs / 1000 },
  })

  const fadeUp = (delayMs: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.6, ease, delay: delayMs / 1000 },
  })

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Background image — direct child of relative section so fill works correctly */}
      <Image
        src={IMAGE_SRC}
        alt=""
        fill
        className="object-cover opacity-55 dark:opacity-35"
        priority
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[var(--paper)]/30 via-[var(--paper)]/55 to-[var(--paper)]" />
      <div className="absolute bottom-0 left-0 right-0 z-[1] h-64 bg-gradient-to-t from-[var(--terracotta)]/6 to-transparent" />

      {/* Hero text */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full px-4 pt-28 pb-10 text-center">
        <h1 className="font-serif font-black text-5xl md:text-6xl leading-[0.92] tracking-tight mb-8">
          <motion.span {...word(0)}   style={{ display: "inline-block", marginRight: "0.15em" }}>Share</motion.span>
          <motion.span {...word(80)}  style={{ display: "inline-block", marginRight: "0.15em" }}>notes,</motion.span>
          <motion.span {...word(160)} style={{ display: "inline-block", marginRight: "0.15em" }} className="text-[var(--terracotta)] italic">ace</motion.span>
          <br />
          <motion.span {...word(240)} style={{ display: "inline-block", marginRight: "0.15em" }}>your</motion.span>
          <motion.span {...word(320)} style={{ display: "inline-block" }}>classes</motion.span>
        </h1>

        <motion.p
          {...fadeUp(520)}
          className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Illinotes is where UIUC students share class notes, collaborate on coursework,
          and get AI-powered study help — all in one place.
        </motion.p>

        <motion.div {...fadeUp(650)}>
          <ScrollingCTA />
        </motion.div>
      </div>

      {/* Mockup */}
      <motion.div
        {...fadeUp(780)}
        className="relative z-10 max-w-4xl mx-auto w-full px-4 mb-20"
      >
        <BrowserMockup />
      </motion.div>
    </section>
  )
}

export function BrowserMockup() {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-[var(--shadow-lg)] border border-border">
      {/* Browser chrome */}
      <div className="bg-[#2A2825] px-4 py-3 flex items-center gap-3">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>

        {/* Nav buttons */}
        <div className="flex items-center gap-1 text-[#6B6860] shrink-0">
          <button className="p-1 rounded hover:bg-white/10 transition-colors" aria-label="Back">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="p-1 rounded hover:bg-white/10 transition-colors" aria-label="Forward">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Address bar */}
        <div className="flex-1 flex items-center gap-2 bg-[#1C1A18] rounded-md px-3 py-1.5 text-sm text-[#9B9890] min-w-0">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[#7A9B76]">
            <rect x="2" y="7" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="truncate">illinotes.com/notes</span>
        </div>
      </div>

      {/* Video content */}
      <div className="bg-[var(--paper)] aspect-video">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          src="https://yjnwgyqjgowhfpqwqvrx.supabase.co/storage/v1/object/public/assets/demo-video.mp4"
        />
      </div>
    </div>
  )
}

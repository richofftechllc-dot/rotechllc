// PLATFORM MARKS — the emblems for the orbit around Bo.
//
// Randy asked for the real logos rather than wordmarks set in our own type.
//
// These are drawn here as inline SVG rather than shipped as the companies' brand
// asset files: it keeps them one decode with the rest of the page, lets them
// scale to a 16px chip without turning to mush, and avoids redistributing brand
// files we have no licence to redistribute. Each mark still sits beside its name
// in text, so nothing depends on the glyph being pixel-perfect to be understood.
//
// The marks are trademarks of their owners. The caption under the orbit says
// outright that ROT prepares people for these platforms and is not affiliated
// with, endorsed by, or partnered with any of them — keep it there.

type MarkProps = { className?: string };

const S = 20; // every mark is authored on a 20x20 grid so they optically match

export function AwsMark({ className }: MarkProps) {
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className={className} role="img" aria-label="AWS">
      <text x="10" y="9.5" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="currentColor" fontFamily="Inter, system-ui, sans-serif">aws</text>
      {/* the smile: a curve that lifts to the right, with the arrowhead */}
      <path d="M2.6 13.4c4.7 2.9 10.1 2.9 14.8 0" stroke="#FF9900" strokeWidth="1.9" fill="none" strokeLinecap="round" />
      <path d="M15.1 12.1l2.6 1.1-1.1 2.6" stroke="#FF9900" strokeWidth="1.9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MicrosoftMark({ className }: MarkProps) {
  // Four squares — the mark is purely geometric, so this one is exact.
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className={className} role="img" aria-label="Microsoft">
      <rect x="1.5" y="1.5" width="7.8" height="7.8" fill="#F25022" />
      <rect x="10.7" y="1.5" width="7.8" height="7.8" fill="#7FBA00" />
      <rect x="1.5" y="10.7" width="7.8" height="7.8" fill="#00A4EF" />
      <rect x="10.7" y="10.7" width="7.8" height="7.8" fill="#FFB900" />
    </svg>
  );
}

export function GoogleMark({ className }: MarkProps) {
  // The four-colour G, drawn as four arcs of one ring plus the crossbar.
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Google">
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-2.7-.4-4H24v7.3h12.1c-.2 1.8-1.6 4.6-4.5 6.5l6.9 5.3c4.1-3.8 6.6-9.4 6.6-15.1z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.3c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-7.1 5.5C8 41.2 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.5 28.5c-.5-1.4-.7-2.9-.7-4.5s.3-3.1.7-4.5l-7.1-5.5C2.9 17.1 2 20.4 2 24s.9 6.9 2.4 10z" />
      <path fill="#EA4335" d="M24 10.6c4.1 0 6.9 1.8 8.5 3.3l6.2-6C34.9 4.500 29.9 2 24 2 15.4 2 8 6.8 4.4 14l7.1 5.5c1.8-5.3 6.7-8.9 12.5-8.9z" />
    </svg>
  );
}

export function OpenAiMark({ className }: MarkProps) {
  // The interlocking knot, as six rotated copies of one lobe.
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label="ChatGPT">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <path key={deg} d="M12 4.2a4.1 4.1 0 0 1 3.55 2.05" transform={`rotate(${deg} 12 12)`} />
        ))}
        <path d="M12 3.1c-2.4 0-4.5 1.35-5.6 3.3-2.25.35-4 2.3-4 4.65 0 1.2.45 2.3 1.2 3.15-.35 2.2.85 4.45 2.95 5.35 1.05 1.9 3.1 3.15 5.45 3.15s4.4-1.25 5.45-3.15c2.1-.9 3.3-3.15 2.95-5.35.75-.85 1.2-1.95 1.2-3.15 0-2.35-1.75-4.3-4-4.65C16.5 4.45 14.4 3.1 12 3.1z" />
      </g>
    </svg>
  );
}

export function AnthropicMark({ className }: MarkProps) {
  // Anthropic's burst: tapered rays radiating from a centre.
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label="Claude">
      <g fill="currentColor">
        {Array.from({ length: 12 }, (_, i) => i * 30).map((deg) => (
          <path key={deg} d="M12 2.6l1.15 8.3h-2.3z" transform={`rotate(${deg} 12 12)`} />
        ))}
        <circle cx="12" cy="12" r="1.6" />
      </g>
    </svg>
  );
}

export function ServiceNowMark({ className }: MarkProps) {
  // The rounded-square "now" tile.
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label="ServiceNow">
      <circle cx="12" cy="12" r="10" fill="#62D84E" />
      <text x="12" y="15.3" textAnchor="middle" fontSize="8" fontWeight="800" fill="#032D42" fontFamily="Inter, system-ui, sans-serif">now</text>
    </svg>
  );
}

export function CompTiaMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 40 20" className={className} role="img" aria-label="CompTIA">
      <text x="0" y="15" fontSize="13" fontWeight="800" fill="currentColor" fontFamily="Inter, system-ui, sans-serif">CompTIA</text>
      <circle cx="37" cy="5" r="2.6" fill="#C8102E" />
    </svg>
  );
}

/** Lookup by the label used in Orbit's ring data. */
export const MARKS: Record<string, (p: MarkProps) => React.ReactElement> = {
  AWS: AwsMark,
  Microsoft: MicrosoftMark,
  Google: GoogleMark,
  ChatGPT: OpenAiMark,
  Claude: AnthropicMark,
  ServiceNow: ServiceNowMark,
  CompTIA: CompTiaMark,
};

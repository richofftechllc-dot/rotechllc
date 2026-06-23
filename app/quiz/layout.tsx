import type { ReactNode } from "react";

// Light theme wrapper for the Quiz Center. The site's root layout is dark
// (bg-black text-white); this overrides it for /quiz so the quiz reads like the
// CRM — white surfaces, near-black text — per request. Scoped to /quiz only, so
// the marketing site stays dark.
export default function QuizLayout({ children }: { children: ReactNode }) {
  return <div className="bg-[#f8f9fa] text-[#202124] min-h-screen">{children}</div>;
}

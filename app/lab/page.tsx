"use client";

// LAB INDEX.
//
// This route did not exist. /plan linked every milestone's "🧪 Lab (n)" button
// at bare /lab, but the only lab route is /lab/[labId], so a member following
// their own study plan hit a 404 — on a page they are paying for.
//
// Rather than repoint the buttons at some arbitrary first lab, this is the index
// they were always implying: every lab, grouped by cert, filterable. The plan
// buttons pass ?domain=<domainId> so the list lands scoped to the milestone the
// member clicked from, with a clear way back out to everything.

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LABS } from "@/lib/labs";

function LabList() {
  const params = useSearchParams();
  const domain = params.get("domain");
  const cert = params.get("cert");

  const shown = LABS.filter(
    (l) => (!domain || l.domainId === domain) && (!cert || l.cert === cert),
  );

  // Group by cert so the page reads as a shelf rather than one long list.
  const certs = [...new Set(shown.map((l) => l.cert))];
  const filtered = Boolean(domain || cert);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="rot-kicker mb-4">Hands-on labs</div>
      <h1 className="text-4xl md:text-6xl font-semibold mb-5 leading-[0.98]">
        Do it, don&apos;t just read it.
      </h1>
      <p className="text-rot-muted text-lg leading-relaxed max-w-2xl mb-10">
        Each lab walks you through a real task in your own environment, one step at a
        time, with a coach checking your work as you go. Nothing here touches your
        instance — you drive, it guides.
      </p>

      {filtered && (
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <span className="text-sm text-rot-muted">
            Showing {shown.length} lab{shown.length === 1 ? "" : "s"} for this milestone.
          </span>
          <Link href="/lab" className="rot-btn-ghost px-4 py-2 text-sm">
            See every lab
          </Link>
        </div>
      )}

      {shown.length === 0 ? (
        // A filter that matches nothing must say so. Silently showing an empty
        // page is how the 404 felt in the first place.
        <div className="rot-card p-8 rounded-xl">
          <p className="text-rot-fg font-medium mb-2">No labs for this domain yet.</p>
          <p className="text-rot-muted text-sm mb-6">
            The written track and quiz cover it — labs are still being added.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/lab" className="rot-btn-ghost px-5 py-3 text-sm">See every lab</Link>
            <Link href="/quiz" className="rot-btn px-5 py-3 text-sm">Go to the quiz</Link>
          </div>
        </div>
      ) : (
        certs.map((c) => (
          <section key={c} className="mb-12">
            <h2 className="text-sm font-bold tracking-widest uppercase text-rot-faint mb-5">{c}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {shown
                .filter((l) => l.cert === c)
                .map((l) => (
                  <Link
                    key={l.id}
                    href={`/lab/${l.id}`}
                    className="rot-card rounded-xl p-6 flex flex-col group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-semibold leading-snug text-rot-fg group-hover:text-rot-accent transition-colors">
                        {l.title}
                      </h3>
                      <span className="text-xs text-rot-faint whitespace-nowrap shrink-0">{l.est}</span>
                    </div>
                    <p className="text-sm text-rot-muted leading-relaxed mb-5">{l.objective}</p>
                    <div className="mt-auto flex items-center gap-2 text-xs text-rot-faint">
                      <span>{l.steps.length} steps</span>
                      <span>·</span>
                      <span>Guided by {l.coach === "bo" ? "Bo" : "Flo"}</span>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        ))
      )}

      <p className="text-center mt-4">
        <Link href="/plan" className="text-sm text-rot-fg underline underline-offset-4 decoration-rot-line-strong hover:decoration-rot-fg">
          Back to my study plan →
        </Link>
      </p>
    </div>
  );
}

// useSearchParams needs a Suspense boundary or the whole route opts out of
// static rendering and the build warns.
export default function LabIndexPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-6 py-16 text-rot-muted">Loading labs…</div>}>
      <LabList />
    </Suspense>
  );
}

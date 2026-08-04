"use client";

import { use } from "react";
import Link from "next/link";
import LessonPlayer from "@/app/components/LessonPlayer";

// Gated lesson page. The player calls /api/video-token, which enforces the SAME
// access gate as the quiz (cookie session → track → lesson.requiredAccess) before
// minting a signed, expiring Mux token. No access logic lives in the client.
export default function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  return (
    <main className="min-h-screen bg-rot-bg px-4 py-10 text-rot-fg">
      <div className="mx-auto max-w-3xl">
        <Link href="/quiz" className="text-sm text-rot-faint hover:text-rot-accent">
          ← Back to tracks
        </Link>
        <h1 className="mb-5 mt-3 text-2xl font-black">Lesson</h1>
        <LessonPlayer lessonId={lessonId} />
        <p className="mt-4 text-xs text-rot-faint">
          Signed, expiring playback · access tied to your ROT plan.
        </p>
      </div>
    </main>
  );
}

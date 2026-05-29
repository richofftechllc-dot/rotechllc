import { NextResponse } from "next/server";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/resume/prompts";
import { auditGeneration } from "@/lib/resume/audit";
import type { StructuredResume, TargetJob } from "@/lib/resume/types";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const rateLimit = new Map<string, { count: number; reset: number }>();
const LIMIT = 5;
const WINDOW_MS = 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const now = Date.now();
  const rec = rateLimit.get(ip);
  if (rec && now < rec.reset) {
    if (rec.count >= LIMIT) {
      return NextResponse.json(
        { ok: false, error: "rate_limited", message: `${LIMIT} generations per 24h — try again later.` },
        { status: 429 }
      );
    }
    rec.count++;
  } else {
    rateLimit.set(ip, { count: 1, reset: now + WINDOW_MS });
  }

  let body: { resume: StructuredResume; job: TargetJob };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  if (!body?.resume?.contact?.name?.trim()) {
    return NextResponse.json({ ok: false, error: "missing_name" }, { status: 400 });
  }
  if (!body?.job?.description?.trim() || !body?.job?.title?.trim()) {
    return NextResponse.json({ ok: false, error: "missing_target_job" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "no_api_key", message: "ANTHROPIC_API_KEY not configured." }, { status: 500 });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        temperature: 0.2,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserPrompt(body.resume, body.job) }],
      }),
    });
    const data = await res.json();
    const text: string = data?.content?.[0]?.text || "";
    if (!text) {
      return NextResponse.json(
        { ok: false, error: "empty_response", detail: data?.error || data },
        { status: 500 }
      );
    }
    const audit = auditGeneration(text, body.resume);
    return NextResponse.json({
      ok: true,
      content_markdown: text,
      flagged_unverifiable: audit.flagged,
      audit_stats: { total_specific_claims: audit.total_specific_claims },
      generated_at: new Date().toISOString(),
      model: "claude-sonnet-4-6",
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "anthropic_failed", detail: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

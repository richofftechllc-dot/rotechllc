import { NextRequest, NextResponse } from "next/server";
import { coll, IS_PROD } from "@/lib/firebase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type EstimatePayload = {
  client_name?: string;
  business?: string;
  email?: string;
  phone?: string;
  selected_ids?: string[];
  line_items?: Array<{ id: string; name: string; price: number; recur?: boolean }>;
  one_time_total?: number;
  monthly_total?: number;
  sprint_cadence?: string;
  fast_track_fee?: number;
  testing_weeks?: number;
  warranty_days?: number;
  hourly_rate_after_warranty?: number;
  payment_plan?: string | null;
  payment_plan_label?: string | null;
  deposit_required?: number;
  deposit_pct?: number | null;
  milestones?: unknown;
  retainer_terms?: unknown;
  notes?: string;
};

async function postWebhook(url: string | undefined, body: unknown): Promise<{ ok: boolean; status?: number; err?: string }> {
  if (!url) return { ok: true };
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return { ok: r.ok, status: r.status };
  } catch (e) {
    return { ok: false, err: e instanceof Error ? e.message : String(e) };
  }
}

function discordEmbed(p: EstimatePayload, id: string) {
  const lines = (p.line_items || []).map(li => `• ${li.name} — $${li.price.toLocaleString()}${li.recur ? "/mo" : ""}`).join("\n");
  return {
    content: `📬 **New Estimate** from **${p.client_name || "Unnamed"}**${p.business ? ` (${p.business})` : ""}`,
    embeds: [{
      title: `Estimate · $${(p.one_time_total || 0).toLocaleString()}${p.monthly_total ? ` + $${p.monthly_total}/mo` : ""}`,
      description: lines.slice(0, 1900) || "(no items)",
      color: 0xE0A53C,
      fields: [
        { name: "Payment plan", value: p.payment_plan_label || "—", inline: true },
        { name: "Deposit", value: p.deposit_required ? `$${p.deposit_required.toLocaleString()}` : "—", inline: true },
        { name: "Sprint cadence", value: p.sprint_cadence || "—", inline: true },
        ...(p.email ? [{ name: "Email", value: p.email, inline: true }] : []),
        ...(p.phone ? [{ name: "Phone", value: p.phone, inline: true }] : []),
      ],
      footer: { text: `ID: ${id}${IS_PROD ? "" : " · TEST"}` },
      timestamp: new Date().toISOString(),
    }],
  };
}

export async function POST(req: NextRequest) {
  let p: EstimatePayload;
  try {
    p = (await req.json()) as EstimatePayload;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // Light validation — must have at least one selected item OR a name
  if (!p.client_name && !(p.selected_ids && p.selected_ids.length)) {
    return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
  }

  const doc = {
    ...p,
    status: "estimate" as const,
    created_at: new Date().toISOString(),
    env: IS_PROD ? "production" : "preview",
  };

  // 1) Save to Firestore (CRM)
  let id = "";
  try {
    const ref = await coll("estimates").add(doc);
    id = ref.id;
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "firestore_failed", detail: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }

  // 2 + 3) Fan out to Zapier (email) and Discord — both env-gated, both best-effort
  const [zap, disc] = await Promise.all([
    postWebhook(process.env.ZAPIER_WEBHOOK_URL, { id, ...doc }),
    postWebhook(process.env.DISCORD_WEBHOOK_URL, discordEmbed(p, id)),
  ]);

  return NextResponse.json({
    ok: true,
    id,
    fanout: {
      zapier: process.env.ZAPIER_WEBHOOK_URL ? zap : "not_configured",
      discord: process.env.DISCORD_WEBHOOK_URL ? disc : "not_configured",
    },
  });
}

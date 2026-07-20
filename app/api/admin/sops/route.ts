import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// SOPs the team can read + edit, one per service. Firestore `sops`, doc id = slug.
const SEED = [
  { id: "onboarding", title: "Member Onboarding", body: "1) Join Discord with the checkout Discord name → Bo auto-assigns the role on sight (no commands). 2) Bo DMs their login code + a Start button for the 30-second intro (posts to #introductions). 3) Not auto-linked? Randy runs !linkemail <email> <discordId>. 4) Add to roster: rotechllc.com/roster.\n\nFounding ($227) includes the study/quiz engine. 1-on-1 cert coaching tracks are a paid add-on." },
  { id: "security-plus", title: "Security+ Track", body: "Study engine + practice quizzes. Coaching track (paid add-on) = 1-on-1 to exam day. Book test support, proctor via #rotech-trainer." },
  { id: "servicenow-csa", title: "ServiceNow CSA Track", body: "9 CSA modules (Flo). Quiz engine for practice. Coaching track (paid add-on) for hands-on + exam prep." },
  { id: "clearance", title: "Clearance Guidance", body: "Clearance Qualifier voice agent first, then a strategy call. Secret/TS/TS-SCI packages are paid." },
  { id: "invoicing", title: "Sending Invoices", body: "Owner-only. Member card → Send invoice → pick the Square item → it emails them. Tagged to the coach code." },
  { id: "booking", title: "Booking a 1-on-1", body: "Member DMs Bo 'book' → picks coach (Randy/Tyler/Daquan) → time → topic. Coach gets pinged; it shows in the CRM." },
];

export async function GET(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  try {
    const snap = await coll("sops").limit(200).get();
    let sops = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }));
    // First load: seed the defaults so coaches have something to edit.
    if (!sops.length) {
      await Promise.all(SEED.map((s) => coll("sops").doc(s.id).set({ title: s.title, body: s.body, updatedAt: new Date().toISOString() })));
      sops = SEED.map((s) => ({ id: s.id, title: s.title, body: s.body }));
    }
    sops.sort((a, b) => String((a as { title?: string }).title || "").localeCompare(String((b as { title?: string }).title || "")));
    return NextResponse.json({ ok: true, sops });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}

// POST — upsert a SOP { id?, title, body }  |  delete { delete: id }
export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  let body: { id?: string; title?: string; body?: string; delete?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }
  try {
    if (body.delete) { await coll("sops").doc(String(body.delete)).delete(); return NextResponse.json({ ok: true }); }
    const id = (body.id || String(body.title || "sop").toLowerCase().replace(/[^a-z0-9]+/g, "-")).slice(0, 60) || "sop";
    await coll("sops").doc(id).set({
      title: String(body.title || "Untitled SOP").slice(0, 120),
      body: String(body.body || "").slice(0, 8000),
      updatedBy: admin.name,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return NextResponse.json({ ok: true, id });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}

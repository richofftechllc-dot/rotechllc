"use client";
import { useEffect, useMemo, useState } from "react";

type Bundle = {
  id: string;
  cls: "silver" | "gold" | "platinum" | "premier";
  name: string;
  price: number;
  save: number;
  line: string;
  items: string[];
  quote?: boolean;
  popular?: boolean;
};

const BUNDLES: Bundle[] = [
  {
    id: "silver", cls: "silver", name: "Silver", price: 1000, save: 350,
    line: "Get online and get found.",
    items: ["Full website on your own domain", "What you offer + photos", "Google profile cleanup", "Review link + QR codes"],
  },
  {
    id: "gold", cls: "gold", name: "Gold", price: 2500, save: 550, popular: true,
    line: "Take orders and money direct — socials handled.",
    items: ["Everything in Silver", "Online ordering + payments (card / Apple Pay / Cash App)", "1 month of social content"],
  },
  {
    id: "platinum", cls: "platinum", name: "Platinum", price: 4200, save: 1800,
    line: "The full self-running setup.",
    items: ["Everything in Gold", "Booking system", "The one-text command center", "An AI agent of your choice", "3 months of management included"],
  },
  {
    id: "premier", cls: "premier", name: "Premier", price: 10000, save: 0, quote: true,
    line: "A complete AI-operated business stack — built to scope.",
    items: ["Everything in Platinum", "Voice AI receptionist", "CRM + retention automations", "Priority support", "6 months of management included"],
  },
];

type ALItem = { id: string; nm: string; pr: number; inc: string; ex: string; ai?: boolean };
type Cat = { title: string; kicker: string; sub: string; items: ALItem[] };

const CATS: Cat[] = [
  {
    title: "Audits & Strategy", kicker: "Start here",
    sub: "Not sure what you need? Start with an audit. I map what you're running, find where you're leaking time and money, and hand you a plan — credited toward your build if you move forward.",
    items: [
      { id: "audit_ai", nm: "AI & Workflow Audit", pr: 500, inc: "I review your tools + processes (POS, ordering, social, phone, the manual stuff) and deliver a one-page plan: what to automate, what to fix, rough ROI.", ex: "Running everything by hand → walk out with a prioritized automation plan." },
    ],
  },
  {
    title: "Websites & Pages", kicker: "Build",
    sub: "Your home base online. (Already covered if you picked a tier above.)",
    items: [
      { id: "web_full", nm: "Full website", pr: 1000, inc: "Up to 6 sections, your services, photos, map, mobile layout, going live.", ex: "No site at all → a live, professional site people can find." },
      { id: "web_page", nm: "Extra page", pr: 250, inc: "One more page — layout, copy formatting, links.", ex: "A dedicated Services, Events, or About page." },
      { id: "web_redesign", nm: "Redesign / refresh", pr: 800, inc: "New layout, colors, fonts, mobile polish. (Look only — features are below.)", ex: "An old, dated site → a clean modern look." },
      { id: "web_feature", nm: "New section or feature", pr: 150, inc: "One block added to a page.", ex: "A gallery, an FAQ, a live 'Open Now' badge, or a countdown." },
    ],
  },
  {
    title: "Forms & Booking", kicker: "Capture",
    sub: "Capture leads, take requests, fill the calendar.",
    items: [
      { id: "form_contact", nm: "Contact / signup form", pr: 150, inc: "Wired to email you or save to a sheet (~6 fields).", ex: "A 'Request a Quote' form straight to your inbox." },
      { id: "form_smart", nm: "Smart multi-step form", pr: 350, inc: "Guided form with logic + routing to you.", ex: "A booking flow: date, details, budget → routed to you." },
      { id: "form_booking", nm: "Booking + deposit", pr: 600, inc: "Booking form, deposit checkout, confirmation. (Your own Stripe — free to start.)", ex: "Take appointments with a deposit so no-shows stop costing you." },
      { id: "form_field", nm: "Add a field", pr: 40, inc: "One new field on a form you already have.", ex: "Adding 'how'd you hear about us' to a form." },
    ],
  },
  {
    title: "Sell Online & Take Payments", kicker: "Earn",
    sub: "Take money directly — keep what the apps take. Payments run through your own Stripe; your money goes straight to your bank, we never touch it.",
    items: [
      { id: "sell_full", nm: "Online store / ordering + checkout", pr: 1200, inc: "Catalog + cart, options, checkout (card / Apple Pay / Cash App), tax, order alert to you.", ex: "Customers buy from you direct instead of a platform skimming 15–30%." },
      { id: "sell_cart", nm: "Cart / catalog only", pr: 600, inc: "Browsable catalog + cart, no payment processing.", ex: "A build-your-order menu where you take payment another way." },
      { id: "sell_checkout", nm: "Checkout only (payments)", pr: 700, inc: "Card / Apple Pay / Cash App checkout for a set item or amount.", ex: "A 'Pay your invoice' or 'Buy a gift card' button." },
      { id: "sell_recurring", nm: "Recurring billing", pr: 300, inc: "Plan setup + recurring charge logic.", ex: "A membership or VIP club that bills every month." },
    ],
  },
  {
    title: "Automations", kicker: "Hands-off",
    sub: "The system does the repetitive stuff so you don't have to. Texting / email runs through your own account at cost — usually pennies.",
    items: [
      { id: "auto_alert", nm: "Instant alerts", pr: 120, inc: "One trigger → one text or email.", ex: "New order or booking → you get a text the second it happens." },
      { id: "auto_seq", nm: "Auto follow-up sequence", pr: 200, inc: "A timed sequence of up to 3 messages.", ex: "Confirmation → reminder → review request, all on its own." },
      { id: "auto_email", nm: "Auto-email after a booking/order", pr: 200, inc: "One triggered email with your content.", ex: "Someone books → instantly gets a 'here's what's next' email." },
      { id: "auto_log", nm: "Auto note-taking / logging", pr: 250, inc: "Auto-save to a sortable sheet / CRM.", ex: "Every request auto-saved — no manual entry." },
      { id: "auto_inv", nm: "Inventory / stock tracking", pr: 350, inc: "Sold-out toggle that syncs everywhere + low-stock alerts.", ex: "Mark something sold out once → it updates everywhere." },
      { id: "auto_blast", nm: "Text-blast system", pr: 300, inc: "List setup, send tool, opt-out handling.", ex: "Slow day? Blast a deal to everyone who's bought before." },
      { id: "auto_connect", nm: "Connect outside platforms", pr: 400, inc: "One integration set up and tested.", ex: "Sync your email list, calendar, or accounting so they stay in step." },
    ],
  },
  {
    title: "AI Agents", kicker: "Runs itself",
    sub: "Smart helpers that handle tasks live, 24/7. Each running agent needs a Care Plan + AI management so it keeps working. Usage runs through your own accounts at cost.",
    items: [
      { id: "ai_voice", nm: "Voice agent (answers the phone)", pr: 2500, ai: true, inc: "Phone setup, custom script, order/booking handling, texts a pay link.", ex: "Rush hour, phone won't stop → AI answers every call, never misses a sale." },
      { id: "ai_onetext", nm: "One-text command center", pr: 1500, ai: true, inc: "Text one line → dispatches to your site + text list + social caption.", ex: "Text a special → site, list, and caption all update in under 30 seconds." },
      { id: "ai_chat", nm: "Conversational website chat", pr: 850, ai: true, inc: "Trained on your business, captures leads, hands off to you.", ex: "Answers 'are you open?', grabs their number, books them — even at 3am." },
      { id: "ai_manager", nm: "AI task / order manager", pr: 700, ai: true, inc: "Unified view, late-flagging, alerts to you.", ex: "Pulls every order or lead into one view, flags what's late." },
      { id: "ai_discord", nm: "Discord / community bot", pr: 500, ai: true, inc: "Auto-welcome + onboarding, FAQ answers, scheduled posts, staff pings.", ex: "New member joins → bot welcomes, onboards, posts updates." },
      { id: "ai_custom", nm: "Custom AI workflow", pr: 1500, ai: true, inc: "A scoped build around your exact problem.", ex: "Reads incoming emails and drafts a reply or quote automatically." },
    ],
  },
  {
    title: "Google & Reviews", kicker: "Get found",
    sub: "Show up when people search. Stack honest 5-star reviews — the safe way.",
    items: [
      { id: "rev_all", nm: "Scan-to-Review system (all-in-one)", pr: 500, inc: "Google cleanup + review link + printable QR + scan → live staff alert.", ex: "Reward is for scanning in / joining your list — never for the review itself. Keeps your listing 100% safe." },
      { id: "rev_clean", nm: "Google profile cleanup only", pr: 200, inc: "Claim, fix hours / photos / categories, optimize.", ex: "Unclaimed, wrong hours → fully optimized so you show up nearby." },
      { id: "rev_link", nm: "Review link + QR only", pr: 150, inc: "Review link + printable QR codes. (Already in the all-in-one.)", ex: "A QR on the receipt that opens your review box." },
      { id: "rev_seo", nm: "Local SEO pass", pr: 300, inc: "On-page SEO, local keywords, listing consistency.", ex: "Show up on page one for 'your service near me.'" },
    ],
  },
  {
    title: "Design & Content", kicker: "Look good",
    sub: "Look good everywhere. Social comes in two flavors — pics cost less, reels reach more. Pick the mix that fits.",
    items: [
      { id: "soc_pics", nm: "Social — Pics & Graphics (30 days)", pr: 500, inc: "~12 designed posts/mo: branded graphics + captions, scheduled & posted. No video.", ex: "A month of clean static posts — you just approve." },
      { id: "soc_reels", nm: "Social — Pics + Reels (30 days)", pr: 950, inc: "~12 posts + 6 short reels/mo (reels edited from your clips), scheduled & posted.", ex: "Reels reach far more people than static — this mixes both." },
      { id: "soc_full", nm: "Social — Full Push (30 days)", pr: 1600, inc: "~20 posts + 10 reels + daily stories, scheduled & posted.", ex: "Maximum presence — looks like you never stop posting." },
      { id: "soc_reel1", nm: "Single reel (one-off)", pr: 100, inc: "One short-form video edited from your footage.", ex: "A one-off reel for a launch or event." },
      { id: "con_logo", nm: "Logo design", pr: 250, inc: "2–3 concepts, revisions, and final files (PNG + SVG) you own.", ex: "No logo yet → a clean mark in every format." },
      { id: "con_flyer", nm: "Custom graphic / flyer (one-off)", pr: 150, inc: "One designed piece with revisions.", ex: "An event flyer or a 'now open' announcement." },
      { id: "con_camp", nm: "Themed campaign", pr: 400, inc: "Each day's post + graphic + deal, scheduled to run on its own.", ex: "A full holiday-week push, scheduled in advance." },
      { id: "con_pdf", nm: "Branded PDF / one-pager", pr: 150, inc: "One designed PDF.", ex: "A proposal or packet you can hand a client." },
      { id: "con_media", nm: "Photo / video edit pass", pr: 150, inc: "Cropping, color, sizing for web + social.", ex: "Your phone photos cleaned up and sized for the site." },
    ],
  },
];

type CarePlan = { id: string; cls: "silver" | "gold"; name: string; price: number; line: string; items: string[] };
const CARE: CarePlan[] = [
  {
    id: "care_basic", cls: "silver", name: "Care Plan", price: 250,
    line: "On-call upkeep.",
    items: ["Bug fixes + updates", "Hours / price / content changes", "Monitoring + review watching", "Same-day small tweaks"],
  },
  {
    id: "care_content", cls: "gold", name: "Care Plan + Content", price: 400,
    line: "Upkeep + I post for you.",
    items: ["Everything in Care Plan", "Weekly pic posts written + posted (reels = add a Social package)"],
  },
];

type CareAddon = { id: string; nm: string; pr: number; inc: string; ex: string };
const CARE_ADDONS: CareAddon[] = [
  { id: "add_priority", nm: "Priority Support", pr: 150, inc: "Front-of-line, same-hour turnaround on urgent changes. (Requires a Care Plan.)", ex: "Need a change RIGHT NOW during a rush → it jumps the queue." },
];

const AI_FEE = 125;

const PLANS = [
  { id: "full", label: "Pay in full" },
  { id: "dep3", label: "Deposit + 3 monthly" },
  { id: "dep6", label: "Deposit + 6 monthly" },
  { id: "after", label: "Afterpay (Pay in 4)" },
];

const fmt = (n: number) => "$" + n.toLocaleString();

function depositInfo(total: number): { rate: number; min: number; pct: number; amount: number } {
  let rate = 0.5, min = 0, pct = 50;
  if (total < 1000) { rate = 0.25; min = 250; pct = 25; }
  else if (total < 2500) { rate = 0.30; pct = 30; }
  else if (total < 5000) { rate = 0.40; pct = 40; }
  const amount = Math.max(Math.round(total * rate), min);
  return { rate, min, pct, amount };
}

export default function EstimateBuilder() {
  const [bundle, setBundle] = useState<string | null>(null);
  const [items, setItems] = useState<Set<string>>(new Set());
  const [care, setCare] = useState<string | null>(null);
  const [addons, setAddons] = useState<Set<string>>(new Set());
  const [plan, setPlan] = useState("full");
  const [name, setName] = useState("");
  const [biz, setBiz] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const byId = useMemo(() => {
    const m: Record<string, ALItem> = {};
    CATS.forEach(c => c.items.forEach(i => { m[i.id] = i; }));
    return m;
  }, []);

  const calc = useMemo(() => {
    let oneTime = 0;
    const b = BUNDLES.find(x => x.id === bundle);
    if (b) oneTime += b.price;
    items.forEach(id => { oneTime += byId[id]?.pr || 0; });

    const itemAi = [...items].filter(id => byId[id]?.ai).length;
    const bundleAi = bundle === "platinum" ? 1 : bundle === "premier" ? 2 : 0;
    const aiCount = itemAi + bundleAi;

    let monthly = 0;
    const carePlan = CARE.find(x => x.id === care);
    if (carePlan) monthly += carePlan.price;
    const aiFee = carePlan && aiCount > 0 ? aiCount * AI_FEE : 0;
    monthly += aiFee;
    addons.forEach(id => {
      const a = CARE_ADDONS.find(x => x.id === id);
      if (a) monthly += a.pr;
    });

    return { oneTime, monthly, aiCount, aiFee };
  }, [bundle, items, care, addons, byId]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const warn = useMemo(() => {
    if (calc.aiCount > 0 && !care) return "⚠ You picked an AI agent. A Care Plan + AI management is required to keep it running — pick one under Keep It Running.";
    if (addons.has("add_priority") && !care) return "⚠ Priority Support is an add-on to a Care Plan — pick a Care Plan to use it.";
    return null;
  }, [calc.aiCount, care, addons]);

  function pickBundle(id: string) { setBundle(b => (b === id ? null : id)); }
  function toggleItem(id: string) {
    setItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  function pickCare(id: string) {
    setCare(c => {
      const next = c === id ? null : id;
      if (!next && addons.has("add_priority")) {
        setAddons(a => { const n = new Set(a); n.delete("add_priority"); return n; });
        setToast("Priority removed — needs a Care Plan");
      }
      return next;
    });
  }
  function toggleAddon(id: string) {
    if (id === "add_priority" && !care && !addons.has(id)) {
      setToast("Pick a Care Plan first — Priority is an add-on");
      return;
    }
    setAddons(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  function resetAll() {
    setBundle(null); setItems(new Set()); setCare(null); setAddons(new Set());
    setPlan("full"); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function buildLineItems() {
    const lines: Array<{ id: string; name: string; price: number; recur?: boolean }> = [];
    const b = BUNDLES.find(x => x.id === bundle);
    if (b) lines.push({ id: b.id, name: `${b.name} package`, price: b.price });
    items.forEach(id => { const it = byId[id]; if (it) lines.push({ id: it.id, name: it.nm, price: it.pr }); });
    const c = CARE.find(x => x.id === care);
    if (c) lines.push({ id: c.id, name: c.name, price: c.price, recur: true });
    if (calc.aiFee > 0) lines.push({ id: "_ai_fee", name: `AI management (${calc.aiCount}×$${AI_FEE})`, price: calc.aiFee, recur: true });
    addons.forEach(id => { const a = CARE_ADDONS.find(x => x.id === id); if (a) lines.push({ id: a.id, name: a.nm, price: a.pr, recur: true }); });
    return lines;
  }

  function copyEstimate() {
    const lines = buildLineItems();
    let txt = `RICH OFF TECH — ESTIMATE\n${name || "(no name)"}${biz ? " / " + biz : ""}\n${email}${phone ? "  ·  " + phone : ""}\n\n`;
    lines.filter(l => !l.recur).forEach(l => { txt += `• ${l.name} — ${fmt(l.price)}\n`; });
    if (calc.oneTime) txt += `\nBUILD (one-time): ${fmt(calc.oneTime)}\n`;
    const recurLines = lines.filter(l => l.recur);
    if (recurLines.length) {
      txt += `\nMONTHLY:\n`;
      recurLines.forEach(l => { txt += `• ${l.name} — ${fmt(l.price)}/mo\n`; });
      txt += `MONTHLY TOTAL: ${fmt(calc.monthly)}/mo\n`;
    }
    txt += `\nrichofftechllc@gmail.com`;
    navigator.clipboard.writeText(txt).then(() => setToast("Estimate copied ✓"));
  }

  async function save() {
    if (savedId) return;
    if (!calc.oneTime && !calc.monthly) {
      setToast("Pick a tier or any item first");
      return;
    }
    if (warn) {
      setToast(warn);
      document.getElementById("eb-care")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const planObj = PLANS.find(p => p.id === plan);
    const dep = depositInfo(calc.oneTime);
    const payload = {
      client_name: name.trim() || undefined,
      business: biz.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      selected_ids: [bundle, ...items, care, ...addons].filter(Boolean) as string[],
      line_items: buildLineItems(),
      one_time_total: calc.oneTime,
      monthly_total: calc.monthly,
      payment_plan: plan,
      payment_plan_label: planObj?.label || null,
      deposit_required: plan === "full" ? calc.oneTime : (plan.startsWith("dep") ? dep.amount : 0),
      deposit_pct: plan.startsWith("dep") ? dep.pct : null,
      warranty_days: calc.oneTime > 0 ? 90 : 0,
      hourly_rate_after_warranty: 75,
    };
    setSubmitting(true);
    try {
      const r = await fetch("/api/estimate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await r.json();
      if (data?.ok) { setSavedId(data.id); setToast("Saved ✓"); }
      else { setToast("Couldn't save — try again"); }
    } catch {
      setToast("Couldn't save — try again");
    } finally {
      setSubmitting(false);
    }
  }

  const dep = depositInfo(calc.oneTime);

  if (savedId) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-zinc-950 border border-green-500/40 rounded-2xl p-10 text-center">
          <div className="text-green-500 font-bold tracking-widest text-xs mb-3">SAVED ✓</div>
          <h3 className="text-3xl font-black mb-4">Your estimate is in.</h3>
          <p className="text-gray-400 mb-3">
            We&apos;ll email you a fixed quote within 24 hours{email ? <> at <b className="text-white">{email}</b></> : null}.
          </p>
          <p className="text-gray-500 text-xs mt-6">Reference: <code className="bg-zinc-900 px-2 py-1 rounded text-orange-500 font-mono">{savedId}</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="eb-root">
      <div className="eb-wrap">

        <header className="eb-header">
          <div className="kicker">Rich Off Tech LLC</div>
          <h1>Build Your Estimate</h1>
          <p className="sub">
            Tap anything you want. Your total builds as you go — no surprises. Start with what you need today, add the rest whenever you&apos;re ready.
          </p>
          <p className="note">
            Starting prices shown. Final quote confirmed once we talk through the details. You own everything we build — site, accounts, and data. We never take a cut of your sales. Third-party fees (payments, texting, domain) are billed to you at cost.
          </p>
        </header>

        <div className="contact">
          <div className="fld full"><label>Your name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" /></div>
          <div className="fld"><label>Business name</label><input value={biz} onChange={e => setBiz(e.target.value)} placeholder="Business name" /></div>
          <div className="fld"><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} placeholder="So we can send your quote" type="email" /></div>
          <div className="fld full"><label>Phone (optional)</label><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" type="tel" /></div>
        </div>

        {/* BUNDLES */}
        <section>
          <div className="sec-head"><span className="sec-kick">Packages</span><h2 className="sec-h2">Pick a tier</h2></div>
          <p className="sec-sub">Most clients start with one of these. Pick a tier, then add anything below. Bundling saves vs buying à la carte.</p>
          <div className="tiers">
            {BUNDLES.map(b => (
              <div key={b.id} className={`tier ${b.cls}${bundle === b.id ? " sel" : ""}`} onClick={() => pickBundle(b.id)}>
                <div className="metal" />
                {b.popular && <span className="pop">Most popular</span>}
                <div className="tname">{b.name}</div>
                <div className="price">{b.quote ? "from " + fmt(b.price) : fmt(b.price)}</div>
                <div className="save">{b.save ? `Saves ${fmt(b.save)} vs separate` : (b.quote ? "By quote · custom scope" : "")}</div>
                <div className="tline">{b.line}</div>
                <ul>{b.items.map(i => <li key={i}>{i}</li>)}</ul>
                <div className="pick">{bundle === b.id ? "● selected" : "tap to choose"}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        {CATS.map(c => (
          <section key={c.title}>
            <div className="sec-head"><span className="sec-kick">{c.kicker}</span><h2 className="sec-h2">{c.title}</h2></div>
            <p className="cat-sub">{c.sub}</p>
            <div className="items">
              {c.items.map(i => (
                <div key={i.id} className={`item${items.has(i.id) ? " sel" : ""}`} onClick={() => toggleItem(i.id)}>
                  <div className="top"><span className="nm">{i.nm}</span><span className="pr">from {fmt(i.pr)}</span></div>
                  <div className="inc">{i.inc}</div>
                  <div className="ex">{i.ex}</div>
                  {i.ai && <span className="badge">needs Care Plan + AI mgmt</span>}
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* MONTHLY */}
        <section id="eb-care">
          <div className="sec-head"><span className="sec-kick">Monthly</span><h2 className="sec-h2">Keep It Running</h2></div>
          <p className="cat-sub">
            Optional — your site stays live either way. A Care Plan keeps me on call to make changes for you. Cancel anytime.
          </p>
          <div className="tiers care-tiers">
            {CARE.map(c => (
              <div key={c.id} className={`tier ${c.cls}${care === c.id ? " sel" : ""}`} onClick={() => pickCare(c.id)}>
                <div className="metal" />
                <div className="tname">{c.name}</div>
                <div className="price">{fmt(c.price)}<span className="mo">/mo</span></div>
                <div className="tline">{c.line}</div>
                <ul>{c.items.map(i => <li key={i}>{i}</li>)}</ul>
                <div className="pick">{care === c.id ? "● selected" : "tap to choose"}</div>
              </div>
            ))}
          </div>
          <div className="items care-add">
            {CARE_ADDONS.map(a => (
              <div key={a.id} className={`item${addons.has(a.id) ? " sel" : ""}`} onClick={() => toggleAddon(a.id)}>
                <div className="top"><span className="nm">{a.nm}</span><span className="pr">+{fmt(a.pr)}/mo</span></div>
                <div className="inc">{a.inc}</div>
                <div className="ex">{a.ex}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PAYMENT INFO */}
        <div className="info">
          <h3>How payment works</h3>
          <div className="plans">
            {PLANS.map(p => (
              <div key={p.id} className={`plan${plan === p.id ? " sel" : ""}`} onClick={() => setPlan(p.id)}>{p.label}</div>
            ))}
          </div>
          <div className="ginfo">
            <p><b>Deposit</b> scales with the project: 25% (min $250) under $1k · 30% to $2.5k · 40% to $5k · 50% above $5k.</p>
            <p><b>Sprints &amp; testing</b> included: 2-week build sprints with demos, then a staging URL you test before launch.</p>
            <p><b>Warranty:</b> 90 days of free bug fixes after launch. After that, free while on a Care Plan.</p>
            <p><b>Cancellation, fair both ways:</b> you pay for milestones done — never for work that didn&apos;t happen.</p>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="summary">
          <h3>Your estimate</h3>
          <div className="lines">
            {bundle && (() => {
              const b = BUNDLES.find(x => x.id === bundle);
              return b ? <div className="srow"><span>{b.name} package</span><span className="v">{fmt(b.price)}</span></div> : null;
            })()}
            {[...items].map(id => byId[id] && (
              <div key={id} className="srow"><span>{byId[id].nm}</span><span className="v">{fmt(byId[id].pr)}</span></div>
            ))}
            {calc.oneTime > 0 ? (
              <>
                <div className="srow tot"><span>Build total (one-time)</span><span className="v">{fmt(calc.oneTime)}</span></div>
                <div className="srow sub">
                  {plan === "full" && `Pay in full: ${fmt(calc.oneTime)}`}
                  {plan === "dep3" && `Deposit ${fmt(dep.amount)} now, then ${fmt(Math.ceil((calc.oneTime - dep.amount) / 3))}/mo × 3`}
                  {plan === "dep6" && `Deposit ${fmt(dep.amount)} now, then ${fmt(Math.ceil((calc.oneTime - dep.amount) / 6))}/mo × 6`}
                  {plan === "after" && `Afterpay: 4 payments of ${fmt(Math.ceil(calc.oneTime / 4))}`}
                </div>
              </>
            ) : (
              <div className="srow sub" style={{ borderBottom: "none" }}>Nothing selected yet — tap a tier or any item above.</div>
            )}
            {calc.monthly > 0 && (
              <>
                <div className="srow sub" style={{ marginTop: 10, borderBottom: "none" }}>— Monthly —</div>
                {(() => { const c = CARE.find(x => x.id === care); return c && <div className="srow"><span>{c.name}</span><span className="v">{fmt(c.price)}/mo</span></div>; })()}
                {calc.aiFee > 0 && <div className="srow"><span>AI management ({calc.aiCount} {calc.aiCount > 1 ? "systems" : "system"} × ${AI_FEE})</span><span className="v">{fmt(calc.aiFee)}/mo</span></div>}
                {[...addons].map(id => { const a = CARE_ADDONS.find(x => x.id === id); return a && <div key={id} className="srow"><span>{a.nm}</span><span className="v">+{fmt(a.pr)}/mo</span></div>; })}
                <div className="srow tot"><span>Monthly total</span><span className="v">{fmt(calc.monthly)}/mo</span></div>
              </>
            )}
          </div>
          {warn && <div className="warnbox">{warn}</div>}
          <div className="actions">
            <button className="btn primary" onClick={save} disabled={submitting}>{submitting ? "Saving…" : "Save & Send to Bo"}</button>
            <button className="btn ghost" onClick={copyEstimate}>Copy my estimate</button>
            <button className="btn ghost" onClick={resetAll}>Start over</button>
          </div>
        </div>

        <footer className="eb-footer">
          Pick what you want → save or copy → we send a fixed quote.<br />
          Rich Off Tech LLC · <a href="mailto:richofftechllc@gmail.com">richofftechllc@gmail.com</a>
        </footer>
      </div>

      <div className="stick">
        <div className="stick-in">
          <div className="nums">
            <div><div className="lbl">Build (one-time)</div><div className="amt">{fmt(calc.oneTime)}</div></div>
            <div><div className="lbl">Monthly</div><div className="amt m">{calc.monthly ? fmt(calc.monthly) + "/mo" : "$0"}</div></div>
          </div>
          <div className="jump" onClick={() => document.querySelector(".summary")?.scrollIntoView({ behavior: "smooth" })}>View estimate ↓</div>
        </div>
      </div>

      {toast && <div className="toast show">{toast}</div>}

      <style jsx>{styles}</style>
    </div>
  );
}

const styles = `
.eb-root { color: #fff; padding-bottom: 120px; font-family: inherit; }
.eb-root :global(*) { box-sizing: border-box; }
.eb-wrap { max-width: 920px; margin: 0 auto; padding: 0 18px; }

.eb-header { padding: 30px 0 16px; }
.kicker { font-size: 12px; letter-spacing: .28em; text-transform: uppercase; color: #f97316; font-weight: 700; }
.eb-header h1 { font-size: clamp(34px, 7vw, 56px); font-weight: 900; line-height: 1.02; margin: 10px 0 10px; letter-spacing: -.02em; }
.sub { color: #a1a1aa; font-size: 16px; max-width: 46ch; line-height: 1.55; }
.note { color: #71717a; font-size: 13px; margin-top: 14px; max-width: 60ch; line-height: 1.55; }

.contact { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 22px 0 8px; }
.contact .full { grid-column: 1 / -1; }
.fld label { display: block; font-size: 11px; letter-spacing: .08em; color: #a1a1aa; margin-bottom: 6px; text-transform: uppercase; font-weight: 700; }
.fld input { width: 100%; background: #18181b; border: 1px solid rgba(255,255,255,.10); color: #fff; padding: 13px 14px; border-radius: 12px; font-size: 15px; font-family: inherit; outline: none; transition: .18s; }
.fld input:focus { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,.15); }
.fld input::placeholder { color: #52525b; }
@media(max-width:560px) { .contact { grid-template-columns: 1fr; } }

section { margin-top: 40px; }
.sec-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 6px; }
.sec-h2 { font-size: 26px; font-weight: 800; letter-spacing: -.02em; }
.sec-kick { font-size: 12px; letter-spacing: .18em; text-transform: uppercase; color: #f97316; font-weight: 700; }
.sec-sub, .cat-sub { color: #a1a1aa; font-size: 14px; margin-bottom: 16px; max-width: 62ch; line-height: 1.55; }

.tiers { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.care-tiers { grid-template-columns: 1fr 1fr; }
@media(max-width:860px) { .tiers { grid-template-columns: repeat(2,1fr); } }
@media(max-width:520px) { .tiers, .care-tiers { grid-template-columns: 1fr; } }

.tier { position: relative; border: 1px solid rgba(255,255,255,.10); border-radius: 16px; padding: 22px 18px 18px; cursor: pointer; overflow: hidden; transition: .2s; background: #18181b; }
.tier:hover { border-color: rgba(255,255,255,.18); transform: translateY(-2px); }
.tier .metal { position: absolute; inset: 0 0 auto 0; height: 5px; }
.tier.silver .metal { background: linear-gradient(90deg,#71717a,#e4e4e7,#71717a); }
.tier.gold .metal { background: linear-gradient(90deg,#ea580c,#fb923c,#ef4444); }
.tier.platinum .metal { background: linear-gradient(90deg,#d4d4d8,#ffffff,#a1a1aa); }
.tier.premier .metal { background: linear-gradient(90deg,#0a0a0a,#f97316,#0a0a0a); }
.tier .tname { font-weight: 900; font-size: 22px; letter-spacing: -.01em; }
.tier.silver .tname { color: #d4d4d8; }
.tier.gold .tname { color: #fb923c; }
.tier.platinum .tname { color: #f4f4f5; }
.tier.premier .tname { color: #fdba74; }
.tier .price { font-size: 30px; font-weight: 900; margin: 4px 0 2px; letter-spacing: -.02em; }
.tier .price .mo { font-size: 14px; color: #a1a1aa; font-weight: 600; margin-left: 2px; }
.tier .save { font-size: 12px; color: #22c55e; font-weight: 600; margin-bottom: 12px; min-height: 14px; }
.tier .tline { font-size: 13.5px; color: #a1a1aa; margin-bottom: 12px; min-height: 36px; line-height: 1.4; }
.tier ul { list-style: none; font-size: 13.5px; display: flex; flex-direction: column; gap: 7px; padding: 0; margin: 0; }
.tier li { position: relative; padding-left: 18px; color: #d4d4d8; }
.tier li::before { content: "✓"; position: absolute; left: 0; color: #f97316; font-weight: 700; }
.pop { position: absolute; top: 14px; right: 14px; background: linear-gradient(90deg,#ea580c,#fb923c); color: #18181b; font-size: 10.5px; font-weight: 800; letter-spacing: .06em; padding: 4px 9px; border-radius: 99px; text-transform: uppercase; }
.tier.sel { border-color: #f97316; box-shadow: 0 0 0 1px #f97316, 0 18px 40px -20px rgba(249,115,22,.5); }
.tier .pick { margin-top: 14px; font-size: 11px; letter-spacing: .08em; color: #52525b; text-transform: uppercase; font-weight: 700; }
.tier.sel .pick { color: #f97316; }

.items { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; }
.care-add { margin-top: 11px; }
@media(max-width:640px) { .items { grid-template-columns: 1fr; } }
.item { border: 1px solid rgba(255,255,255,.10); border-radius: 13px; padding: 14px 14px 13px; cursor: pointer; background: #18181b; transition: .16s; display: flex; flex-direction: column; gap: 5px; position: relative; }
.item:hover { border-color: rgba(255,255,255,.18); background: #1f1f23; }
.item.sel { border-color: #f97316; background: linear-gradient(180deg,rgba(249,115,22,.10),transparent); box-shadow: 0 0 0 1px rgba(249,115,22,.5); }
.item .top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.item .nm { font-weight: 700; font-size: 15px; }
.item .pr { font-weight: 800; font-size: 15px; color: #fb923c; white-space: nowrap; }
.item .inc { font-size: 12.5px; color: #a1a1aa; line-height: 1.45; }
.item .ex { font-size: 12px; color: #71717a; font-style: italic; line-height: 1.4; }
.badge { display: inline-block; font-size: 10.5px; color: #eab308; border: 1px solid rgba(234,179,8,.35); padding: 2px 7px; border-radius: 99px; margin-top: 2px; align-self: flex-start; font-weight: 600; }

.info { background: #18181b; border: 1px solid rgba(255,255,255,.10); border-radius: 16px; padding: 22px; margin-top: 30px; }
.info h3 { font-size: 16px; font-weight: 800; margin-bottom: 10px; }
.info .ginfo { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 24px; margin-top: 14px; }
@media(max-width:640px) { .info .ginfo { grid-template-columns: 1fr; } }
.info p { font-size: 13px; color: #a1a1aa; line-height: 1.55; }
.info b { color: #fff; font-weight: 600; }
.plans { display: flex; flex-wrap: wrap; gap: 8px; }
.plan { border: 1px solid rgba(255,255,255,.10); background: #1f1f23; padding: 9px 14px; border-radius: 99px; font-size: 13px; cursor: pointer; transition: .15s; color: #a1a1aa; font-weight: 600; }
.plan:hover { border-color: rgba(255,255,255,.20); }
.plan.sel { border-color: #f97316; color: #fb923c; background: rgba(249,115,22,.08); }

.summary { background: linear-gradient(180deg,#18181b,#0e0e10); border: 1px solid rgba(255,255,255,.14); border-radius: 16px; padding: 24px; margin-top: 26px; }
.summary h3 { font-size: 22px; font-weight: 900; margin-bottom: 14px; letter-spacing: -.02em; }
.srow { display: flex; justify-content: space-between; gap: 12px; font-size: 14px; padding: 8px 0; border-bottom: 1px dashed rgba(255,255,255,.10); color: #d4d4d8; }
.srow .v { font-weight: 700; }
.srow.tot { border-bottom: none; font-size: 17px; font-weight: 800; padding-top: 12px; }
.srow.tot .v { color: #fb923c; }
.srow.sub { color: #a1a1aa; font-size: 13px; border: none; padding: 4px 0; font-style: italic; }
.warnbox { background: rgba(234,179,8,.08); border: 1px solid rgba(234,179,8,.30); color: #eab308; font-size: 13px; padding: 11px 13px; border-radius: 11px; margin-top: 14px; }
.actions { display: flex; gap: 10px; margin-top: 18px; flex-wrap: wrap; }
.btn { border: none; cursor: pointer; font-family: inherit; font-weight: 800; font-size: 14px; padding: 13px 20px; border-radius: 12px; transition: .15s; }
.btn:disabled { opacity: .5; cursor: wait; }
.btn.primary { background: linear-gradient(90deg,#f97316,#ef4444); color: #fff; }
.btn.primary:hover { filter: brightness(1.07); }
.btn.ghost { background: transparent; border: 1px solid rgba(255,255,255,.18); color: #fff; }
.btn.ghost:hover { border-color: #f97316; color: #fb923c; }

.stick { position: fixed; left: 0; right: 0; bottom: 0; z-index: 50; background: rgba(9,9,11,.92); backdrop-filter: blur(12px); border-top: 1px solid rgba(255,255,255,.18); }
.stick-in { max-width: 920px; margin: 0 auto; padding: 13px 18px; display: flex; align-items: center; gap: 18px; justify-content: space-between; }
.nums { display: flex; gap: 22px; }
.lbl { font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase; color: #71717a; font-weight: 700; }
.amt { font-weight: 900; font-size: 21px; letter-spacing: -.02em; }
.amt.m { color: #fb923c; font-size: 18px; }
.jump { font-size: 13px; color: #f97316; cursor: pointer; font-weight: 700; white-space: nowrap; }
@media(max-width:560px) { .nums { gap: 16px; } .amt { font-size: 18px; } }

.eb-footer { color: #71717a; font-size: 12.5px; text-align: center; padding: 34px 0 10px; line-height: 1.7; }
.eb-footer a { color: #f97316; text-decoration: none; }

.toast { position: fixed; bottom: 96px; left: 50%; transform: translateX(-50%) translateY(20px); background: linear-gradient(90deg,#f97316,#ef4444); color: #fff; font-weight: 700; font-size: 14px; padding: 11px 18px; border-radius: 99px; opacity: 0; transition: .25s; z-index: 60; pointer-events: none; box-shadow: 0 8px 30px rgba(249,115,22,.4); }
.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
`;

"use client";
import { useEffect, useMemo, useState } from "react";

type Item = {
  id: string;
  name: string;
  price: number;
  what: string;
  eg: string;
  bundle?: boolean;
  recur?: boolean;
  requires_retainer?: boolean;
  rec?: boolean;
};
type Category = { cat: string; desc: string; items: Item[] };

const DATA: Category[] = [
  { cat: "⭐ Starter Bundles", desc: "Most businesses start with one of these. Pick a bundle, then add anything below. Bundles save vs buying à la carte.", items: [
    { id: "bundle_found", name: "Get Found", price: 1000, bundle: true, what: "INCLUDES: full website on your own domain · your real menu/services · photos · Google profile cleanup · review link + QR codes.", eg: "Everything you need to exist online and show up on Google. The starting point for most." },
    { id: "bundle_paid", name: "Get Paid  (most popular)", price: 2500, bundle: true, what: "INCLUDES everything in Get Found, PLUS online ordering & payments (card/Apple Pay/Cash App) + 1 month of social content (posts + graphics).", eg: "You're taking orders and money directly, and your socials are handled for a month. Saves ~$700 vs separate." },
    { id: "bundle_auto", name: "Whole Kitchen", price: 4200, bundle: true, what: "INCLUDES everything in Get Paid, PLUS a catering/booking system + the one-text command center + an AI agent of your choice. (3 months of management included, then a Care Plan.)", eg: "The full self-running setup — like what Rich Off Tech runs for itself. Saves ~$1,200 vs separate." },
  ]},
  { cat: "Websites & Pages", desc: "Your home base online. (Already covered if you picked a bundle above.)", items: [
    { id: "site_starter", name: "Full website", price: 1000, what: "A complete mobile-first site. INCLUDES: up to 6 sections, your menu/services, photos, map, mobile layout, and going live.", eg: "No website at all → a live site with menu, hours, photos, and a map to your door." },
    { id: "new_page", name: "Extra page", price: 250, what: "One additional page on your site. INCLUDES: layout, copy formatting, and links.", eg: "Adding a dedicated Catering or Events page." },
    { id: "redesign", name: "Redesign / refresh", price: 800, what: "Rebuild the look of a site you already have. INCLUDES: new layout, colors, fonts, mobile polish. Does NOT include new features (see below).", eg: "Old, dated site → clean modern look that matches your brand." },
    { id: "section", name: "New section or feature", price: 150, what: "One block added to an existing page. INCLUDES: the design + build of that one piece.", eg: "A photo gallery, an FAQ, a live 'Open Now' badge, or a countdown." },
  ]},
  { cat: "Forms & Booking", desc: "Capture leads, take requests, fill the calendar.", items: [
    { id: "form_simple", name: "Contact / signup form", price: 150, what: "A form wired to email you or save to a sheet. INCLUDES: up to ~6 fields + delivery setup.", eg: "A 'Request Catering' form that drops straight into your inbox." },
    { id: "form_smart", name: "Smart multi-step form", price: 350, what: "A guided form with logic. INCLUDES: multiple steps, conditional questions, and routing to you.", eg: "Event booking that asks date, headcount, menu — then routes it to you." },
    { id: "booking", name: "Booking + deposit", price: 600, what: "Reserve a spot and pay a deposit to hold it. INCLUDES: booking form, deposit checkout, and confirmation. (Note: a payment account like Stripe is required — you set it up, it's free to start.)", eg: "A lounge taking section reservations with a deposit so no-shows stop killing the night." },
    { id: "field", name: "Add a field", price: 40, what: "One new field on a form you already have.", eg: "Adding 'allergies' or 'how'd you hear about us' to an order form." },
  ]},
  { cat: "Online Ordering & Payments", desc: "Take money directly — keep what the apps take. (Note: payments run through your own Stripe account — you set it up, your money goes straight to your bank, Rich Off Tech never touches it.)", items: [
    { id: "order_pay", name: "Online ordering + checkout", price: 1200, what: "The full ordering system. INCLUDES: add-to-cart menu, options/modifiers, checkout by card/Apple Pay/Cash App, tax, and an order alert to you. (This is the cart + checkout below, bundled — saves $100.)", eg: "Customers order $25 plates on your site instead of a delivery app that skims 15–30%." },
    { id: "cart", name: "Add-to-cart menu only", price: 600, what: "Just the menu + cart (no payment processing). INCLUDES: browsable menu, options, running total.", eg: "A build-your-plate menu with a 'pick 2 sides' picker, where you take payment another way." },
    { id: "checkout", name: "Checkout only (payments)", price: 700, what: "Just the payment piece. INCLUDES: card/Apple Pay/Cash App checkout for a set item or amount.", eg: "A 'Pay your invoice' or 'Buy a gift card' button." },
    { id: "subscription", name: "Recurring billing", price: 300, what: "Auto-charge customers on a schedule. INCLUDES: plan setup + recurring charge logic.", eg: "A membership, a meal plan, or a VIP club that bills every month." },
  ]},
  { cat: "Automations — set it and forget it", desc: "The system does the repetitive stuff so you don't have to. (Texting/email usage runs through your own account at cost — pennies.)", items: [
    { id: "auto_notify", name: "Instant alerts", price: 120, what: "A text or email fires the moment something happens. INCLUDES: one trigger → one alert.", eg: "New order → you get a text. New booking → it hits your calendar." },
    { id: "auto_followup", name: "Auto follow-up sequence", price: 200, what: "Messages that send themselves after an event. INCLUDES: a timed sequence of up to 3 messages.", eg: "After a booking: confirmation goes out → a day later a 'see you soon' text → after the visit, a review request. All on its own." },
    { id: "auto_email_after", name: "Auto-email after a booking/order", price: 200, what: "The right email sends itself when something happens. INCLUDES: one triggered email with your content.", eg: "Someone books catering → they instantly get a 'here's what happens next' email with your menu attached." },
    { id: "auto_notes", name: "Auto note-taking / logging", price: 250, what: "Every order, call, or form gets logged automatically. INCLUDES: auto-save to a sortable sheet/CRM.", eg: "Every catering request auto-saved to a spreadsheet you can sort and search — no manual entry." },
    { id: "auto_inventory", name: "Inventory / order tracking", price: 350, what: "Track what's selling and what's low. INCLUDES: sold-out toggle that syncs everywhere + low-stock alerts.", eg: "Mark a dish 'sold out' once → it updates everywhere, and you get a heads-up when a top seller is moving fast." },
    { id: "sms_blast", name: "Text-blast system", price: 300, what: "One message to your whole customer list at once. INCLUDES: list setup, send tool, and opt-out handling.", eg: "Slow Tuesday? Blast 'Half-off jollof til 9pm' to everyone who's ordered before." },
    { id: "api_sync", name: "Connect outside platforms", price: 400, what: "Tie in tools you already use. INCLUDES: one integration set up and tested.", eg: "Sync your delivery-app menu, your POS, or your accounting so they stay in step." },
  ]},
  { cat: "AI Agents — work that runs itself", desc: "Smart helpers that handle tasks live, 24/7. (These are living systems — a Care Plan is recommended to keep them running. Usage runs through your own accounts at cost.)", items: [
    { id: "agent_voice", name: "Voice agent (answers the phone)", price: 1500, what: "If you never want to answer a call again — an AI picks up, takes the order or booking, and texts a pay link. INCLUDES: phone number setup, custom script, order/booking handling.", eg: "Friday rush, phone won't stop → the agent answers every call, takes the order, repeats it back, never misses a sale.", rec: true },
    { id: "agent_onetext", name: "One-text command center", price: 900, what: "You text one line; it updates everything, live. INCLUDES: dispatch to your site + text list + social caption from a single text.", eg: "Text 'jollof special tonight $3 off' → your site, your text list, and your social caption all update in under 30 seconds.", rec: true },
    { id: "agent_chat", name: "Conversational website chat", price: 600, what: "An AI chat on your site that talks to visitors and captures their info. INCLUDES: trained on your business, lead capture, handoff to you.", eg: "Answers 'are you open?', 'do you cater?', grabs their number, books them — even at 3am.", rec: true },
    { id: "agent_orders", name: "AI order / task manager", price: 700, what: "One dashboard that watches your orders/tasks and keeps them moving. INCLUDES: unified view, late-flagging, alerts to you.", eg: "Pulls every order from every channel into one view, flags what's late, texts you what needs attention.", rec: true },
    { id: "agent_discord", name: "Discord / community bot (+ onboarding)", price: 500, what: "A bot that runs your group/team chat AND onboards new members automatically. INCLUDES: auto-welcome + onboarding flow, FAQ answers, scheduled posts, staff pings.", eg: "New member joins → bot welcomes them, walks them through the rules/menu/links, posts daily specials, and pings staff for shift changes.", rec: true },
    { id: "agent_custom", name: "Custom AI workflow", price: 700, what: "A smart helper built around your exact problem. INCLUDES: scoped build for your specific task.", eg: "Reads incoming catering emails and drafts a quote back automatically.", rec: true },
  ]},
  { cat: "Get Found — Google & Reviews", desc: "Show up when people search. Stack 5-star reviews.", items: [
    { id: "review_reward", name: "Scan-to-Review system  (all-in-one)", price: 500, what: "The complete review engine. INCLUDES: Google profile cleanup + review link + printable QR codes + the scan→honest-review→live staff alert. (You do NOT need the two items below if you get this — they're already in here.)", eg: "Scan at the bar → leave an honest review → bartender gets a text → free shot handed over on the spot." },
    { id: "gbp", name: "Google profile cleanup only", price: 200, what: "Just the listing fix (if you don't want the full system above). INCLUDES: claim, fix hours/photos/categories, optimize.", eg: "Wrong hours, no photos, unclaimed → fully optimized so you show up in 'near me' searches." },
    { id: "review_qr", name: "Review link + QR only", price: 150, what: "Just the review link + printable QR codes (if that's all you need). Already included in the all-in-one above.", eg: "A QR on the receipt that opens straight to your Google review box." },
    { id: "seo", name: "Local SEO pass", price: 300, what: "Tune your site so you rank locally. INCLUDES: on-page SEO, local keywords, listing consistency.", eg: "Show up on page one for 'jerk chicken near me' in your neighborhood." },
  ]},
  { cat: "Design & Content", desc: "Look good everywhere. Stay posted without lifting a finger.", items: [
    { id: "content_month", name: "Social content — 30 days", price: 500, what: "A done-for-you month of posting. INCLUDES: ~12–16 posts written + the post graphics designed + scheduled/posted. (Custom one-off designs like logos or event flyers are the separate line below.)", eg: "Daily posts telling the story behind each dish, designed and posted — you just approve." },
    { id: "graphics", name: "Custom graphic / flyer (one-off)", price: 150, what: "A specific custom design, made once. INCLUDES: one designed piece with revisions. (This is for standalone pieces — your monthly post graphics are already in the content month above.)", eg: "An event flyer, a menu card, a 'now open' announcement, or a logo touch-up." },
    { id: "campaign", name: "Themed campaign", price: 400, what: "A multi-day campaign, pre-built. INCLUDES: each day's post + graphic + deal, scheduled to run on its own.", eg: "A full holiday-week push: each day a story + a deal, scheduled in advance." },
    { id: "pdf", name: "Branded PDF / one-pager", price: 150, what: "A clean designed document. INCLUDES: one designed PDF (menu, proposal, packet).", eg: "A catering packet or proposal you can hand a client." },
    { id: "media_edit", name: "Photo / video edit pass", price: 150, what: "Clean up media you already have. INCLUDES: cropping, color, and sizing for web + social.", eg: "Your phone photos cropped, color-fixed, and sized for the site and Instagram." },
  ]},
  { cat: "Keep It Running (Monthly)", desc: "Optional — your site stays live either way. A Care Plan keeps me on call to make changes for you. Cancel anytime.", items: [
    { id: "ret_basic", name: "Care Plan", price: 250, recur: true, what: "INCLUDES: bug fixes, menu/price/hours updates, system monitoring, AI/automation management, review monitoring, and small tweaks — on call, same-day.", eg: "Menu changed? Hours changed? Voice agent acting up? Text me, handled. Required if you have AI agents or automations running." },
    { id: "ret_content", name: "Care Plan + Content", price: 400, recur: true, what: "INCLUDES everything in the Care Plan, PLUS weekly social posts written + posted for you.", eg: "I keep your site current AND post for you every week." },
    { id: "ret_priority", name: "Priority Support  (add-on)", price: 150, recur: true, requires_retainer: true, what: "An ADD-ON to a Care Plan — not sold alone. Bumps your requests to the front of the line for same-hour turnaround on urgent changes.", eg: "You're on a Care Plan and need a change RIGHT NOW during a rush → it jumps the queue. (Requires a Care Plan above.)" },
  ]},
];

const PAY_PLANS = [
  { id: "full", name: "Pay in full", sub: "One payment, cleanest. Save on processing.", tag: "BEST VALUE" },
  { id: "split2", name: "Deposit + 2 monthly", sub: "~60 days. No interest. Best for projects $500–$1,500.", tag: "" },
  { id: "split3", name: "Deposit + 3 monthly", sub: "~90 days. No interest. Most popular for $1k–$2k builds.", tag: "POPULAR" },
  { id: "split4", name: "Deposit + 4 monthly", sub: "~120 days. No interest. Best for $2k–$4k builds.", tag: "" },
  { id: "split6", name: "Deposit + 6 monthly", sub: "~6 months. No interest. For the biggest builds.", tag: "" },
  { id: "afterpay4", name: "Afterpay — Pay in 4", sub: "4 payments over 6 weeks, no interest. Up to $2,000.", tag: "INSTANT" },
  { id: "afterpay6", name: "Afterpay — 6 months", sub: "$400–$4,000 builds. Interest applies (Afterpay sets it).", tag: "" },
  { id: "afterpay12", name: "Afterpay — 12 months", sub: "$400–$4,000 builds. Interest applies (Afterpay sets it).", tag: "" },
];

const MILESTONES = [
  { key: "kickoff", pct: 25, what: "Scoping, kickoff call, account setup, first build push" },
  { key: "build",   pct: 50, what: "Core build complete, ready for review" },
  { key: "launch",  pct: 25, what: "Revisions, polish, go-live" },
];

const AI_REQUIRES_CARE = new Set(["agent_voice","agent_onetext","agent_chat","agent_orders","agent_discord","agent_custom","auto_inventory","auto_followup","sms_blast"]);
const FAST_TRACK_FEE = 300;

function fmt(n: number) { return "$" + n.toLocaleString(); }
function depositFor(total: number) {
  if (total < 1000) return Math.max(250, Math.round(total * 0.25));
  if (total < 2500) return Math.round(total * 0.30);
  if (total < 5000) return Math.round(total * 0.40);
  return Math.round(total * 0.50);
}
function depositPct(total: number) {
  if (total < 1000) return 25;
  if (total < 2500) return 30;
  if (total < 5000) return 40;
  return 50;
}
function testingWeeks(total: number) { return total < 1500 ? 1 : 2; }

function lookup(id: string): Item | undefined {
  for (const g of DATA) for (const it of g.items) if (it.id === id) return it;
}

export default function EstimateBuilder() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sprintCadence, setSprintCadence] = useState<"2w" | "1w">("2w");
  const [chosenPlan, setChosenPlan] = useState<string | null>(null);
  const [cliName, setCliName] = useState("");
  const [cliBiz, setCliBiz] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  const summary = useMemo(() => {
    const items: Item[] = [];
    let one = 0, rec = 0;
    selected.forEach(id => {
      const it = lookup(id); if (!it) return;
      items.push(it);
      if (it.recur) rec += it.price; else one += it.price;
    });
    const fastTrack = (sprintCadence === "1w" && one > 0) ? FAST_TRACK_FEE : 0;
    if (fastTrack > 0) { items.push({ id: "_fasttrack", name: "Fast Track (1-week sprints)", price: fastTrack, what: "", eg: "" }); one += fastTrack; }
    return { items, one, rec, fastTrack };
  }, [selected, sprintCadence]);

  const hasCarePlan = selected.has("ret_basic") || selected.has("ret_content");
  const needsCare = useMemo(() => {
    for (const id of AI_REQUIRES_CARE) if (selected.has(id)) return true;
    return false;
  }, [selected]);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 2200);
    return () => clearTimeout(t);
  }, [toastMsg]);

  function toggle(it: Item) {
    setSelected(prev => {
      const next = new Set(prev);
      if (it.requires_retainer && !next.has(it.id)) {
        if (!next.has("ret_basic") && !next.has("ret_content")) {
          setToastMsg("Add a Care Plan first — Priority is an add-on");
          return prev;
        }
      }
      if (next.has(it.id)) next.delete(it.id); else next.add(it.id);
      if ((it.id === "ret_basic" || it.id === "ret_content") && !next.has("ret_basic") && !next.has("ret_content")) {
        if (next.has("ret_priority")) { next.delete("ret_priority"); setToastMsg("Priority removed — needs a Care Plan"); }
      }
      return next;
    });
  }

  async function save() {
    if (savedId) return;
    if (summary.one > 0 && !chosenPlan) {
      setToastMsg("Pick how you want to pay first");
      document.getElementById("eb-paybox")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (needsCare && !hasCarePlan) {
      setToastMsg("Add a Care Plan — AI agents need management");
      document.getElementById("eb-care")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const planObj = chosenPlan ? PAY_PLANS.find(p => p.id === chosenPlan) : null;
    const payload = {
      client_name: cliName.trim() || undefined,
      business: cliBiz.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      selected_ids: [...selected],
      line_items: summary.items.map(it => ({ id: it.id, name: it.name, price: it.price, recur: !!it.recur })),
      one_time_total: summary.one,
      monthly_total: summary.rec,
      sprint_cadence: sprintCadence,
      fast_track_fee: chosenPlan && sprintCadence === "1w" ? FAST_TRACK_FEE : 0,
      testing_weeks: summary.one > 0 ? testingWeeks(summary.one) : 0,
      warranty_days: summary.one > 0 ? 90 : 0,
      hourly_rate_after_warranty: 75,
      payment_plan: chosenPlan,
      payment_plan_label: planObj ? planObj.name : null,
      deposit_required: chosenPlan && chosenPlan.startsWith("split") ? depositFor(summary.one) : (chosenPlan === "full" ? summary.one : 0),
      deposit_pct: chosenPlan && chosenPlan.startsWith("split") ? depositPct(summary.one) : null,
      milestones: MILESTONES,
      retainer_terms: summary.rec > 0 ? {
        monthly_total: summary.rec,
        billing_day: 1,
        first_charge: "at kickoff",
        term: "month-to-month",
        cancellation: "14 days written notice; current month non-refundable; no fees",
      } : null,
    };
    setSubmitting(true);
    try {
      const r = await fetch("/api/estimate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await r.json();
      if (data?.ok) { setSavedId(data.id); setToastMsg("Saved ✓"); }
      else { setToastMsg("Couldn't save — try again"); }
    } catch {
      setToastMsg("Couldn't save — try again");
    } finally {
      setSubmitting(false);
    }
  }

  const planObj = chosenPlan ? PAY_PLANS.find(p => p.id === chosenPlan) : null;
  const dep = depositFor(summary.one);
  const pct = depositPct(summary.one);

  if (savedId) {
    return (
      <div className="eb-success">
        <div className="eb-success-card">
          <div className="eb-success-kick">Saved ✓</div>
          <h3>Your estimate is in.</h3>
          <p>
            We&apos;ll email you a fixed quote within 24 hours
            {email ? <> at <b>{email}</b></> : null}.
            If you&apos;d like to talk it through first, the Project Discovery agent above takes calls anytime.
          </p>
          <p className="eb-success-id">Reference: <code>{savedId}</code></p>
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <div className="eb-root">
      <div className="eb-wrap">
        <header className="eb-header">
          <div className="kicker">Rich Off Tech LLC</div>
          <h1>Build Your <em>Estimate</em></h1>
          <p className="sub">Tap anything you want. Your total builds as you go — no surprises. Start with what you need today, add the rest whenever you&apos;re ready.</p>
          <div className="namebar">
            <input value={cliName} onChange={e=>setCliName(e.target.value)} type="text" placeholder="Your name" />
            <input value={cliBiz}  onChange={e=>setCliBiz(e.target.value)}  type="text" placeholder="Business name" />
          </div>
          <div className="namebar">
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email (so we can send you the quote)" />
            <input value={phone} onChange={e=>setPhone(e.target.value)} type="tel"   placeholder="Phone (optional)" />
          </div>
          <p className="disclaim">Starting prices shown — final quote confirmed once we talk through the details. You own everything we build.</p>
        </header>

        <div id="cats">
          {DATA.map(group => (
            <div key={group.cat} className="cat" id={group.cat.includes("Keep It Running") ? "eb-care" : undefined}>
              <div className="cat-head">
                <div className="cat-title">{group.cat}</div>
                <div className="cat-line"></div>
              </div>
              <div className="cat-desc">{group.desc}</div>
              {group.items.map(it => {
                const on = selected.has(it.id);
                return (
                  <div
                    key={it.id}
                    className={`item${on ? " on" : ""}${it.bundle ? " is-bundle" : ""}`}
                    onClick={() => toggle(it)}
                  >
                    <div className="check">✓</div>
                    <div className="it-body">
                      <div className="it-top">
                        <span className="it-name">{it.name}</span>
                        <span className="it-price">{it.recur ? `${fmt(it.price)}/mo` : (it.bundle ? fmt(it.price) : `from ${fmt(it.price)}`)}</span>
                      </div>
                      <div className="it-what">{it.what}</div>
                      <div className="it-eg"><b>Example:</b> {it.eg}</div>
                      {it.recur && !it.requires_retainer && <span className="recur">monthly · cancel anytime</span>}
                      {it.requires_retainer && <span className="recur eb-gold">add-on · requires a Care Plan</span>}
                      {it.rec && <span className="recur eb-gold">⚠ requires a Care Plan ($250+/mo) to run</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <p className="foot-note">
          <b>How it works:</b> pick what you want → save your estimate → we send a fixed quote.<br/>
          You own the site, accounts, and data. We never take a cut of your sales. Third-party fees (payments, texting, domain) are billed to you at cost.<br/>
          Rich Off Tech LLC · richofftechllc@gmail.com
        </p>

        {summary.one > 0 && (
          <div className="pay-box" id="eb-paybox">
            <div className="cat-head"><div className="cat-title">How would you like to pay?</div><div className="cat-line"></div></div>
            <div className="cat-desc">Deposit scales with the project — covers kickoff work and reserves your spot. Pick what works for your cash flow.</div>
            <div className="pay-grid">
              {PAY_PLANS.map(p => (
                <div key={p.id} className={`pay-opt${chosenPlan === p.id ? " on" : ""}`} onClick={() => setChosenPlan(p.id)}>
                  <div className="po-name">{p.name}{p.tag && <span className="po-tag">{p.tag}</span>}</div>
                  <div className="po-sub">{p.sub}</div>
                </div>
              ))}
            </div>

            {chosenPlan && summary.one > 0 && (
              <>
                <div className="pay-summary show">
                  <div className="ps-line"><span>Project total</span><span><b>{fmt(summary.one)}</b></span></div>
                  {chosenPlan === "full" && (
                    <div className="ps-line"><span>Due today</span><span><b>{fmt(summary.one)}</b></span></div>
                  )}
                  {chosenPlan.startsWith("split") && (() => {
                    const months = parseInt(chosenPlan.replace("split", ""), 10);
                    const remaining = Math.max(0, summary.one - dep);
                    const monthly = remaining > 0 ? Math.ceil(remaining / months) : 0;
                    return (
                      <>
                        <div className="ps-line"><span>Deposit today ({pct}% — required to start)</span><span><b>{fmt(dep)}</b></span></div>
                        {monthly > 0 && <div className="ps-line"><span>Then {months} monthly payment{months > 1 ? "s" : ""} of</span><span><b>{fmt(monthly)}/mo</b></span></div>}
                        <div className="ps-line ps-total"><span>Total over {months} month{months > 1 ? "s" : ""}</span><span>{fmt(dep + monthly * months)}</span></div>
                      </>
                    );
                  })()}
                  {chosenPlan.startsWith("afterpay") && (
                    <>
                      <div className="ps-line"><span>Paid via Afterpay (Rich Off Tech paid in full upfront)</span><span><b>{fmt(summary.one)}</b></span></div>
                      {chosenPlan === "afterpay4" && (() => { const each = Math.ceil(summary.one / 4); return <div className="ps-line"><span>You pay Afterpay</span><span>4× {fmt(each)} over 6 weeks</span></div>; })()}
                      {(chosenPlan === "afterpay6" || chosenPlan === "afterpay12") && (
                        <div className="ps-line"><span>You pay Afterpay</span><span>{chosenPlan === "afterpay6" ? 6 : 12} monthly + interest</span></div>
                      )}
                    </>
                  )}
                </div>
                <p className="pay-terms">
                  {chosenPlan === "full" && <><b>Pay in full.</b> Card, debit, Apple Pay, Google Pay, Cash App Pay, or bank transfer. Same milestone protections apply if you cancel before delivery.</>}
                  {chosenPlan.startsWith("split") && <><b>Billing:</b> monthly payments hit the same day of the month each time. 7-day grace, then a small late fee. <b>You only pay for work that actually happens. No interest, no chase, no chargeback drama.</b></>}
                  {chosenPlan === "afterpay4" && <><b>Afterpay Pay in 4:</b> 4 interest-free installments over 6 weeks. Project must be under $2,000. Subject to Afterpay approval. Same milestone cancellation rules apply.</>}
                  {(chosenPlan === "afterpay6" || chosenPlan === "afterpay12") && <><b>Afterpay Pay Monthly:</b> {chosenPlan === "afterpay6" ? 6 : 12} months. Interest applies (6.99%–35.99%, set by Afterpay per customer). Project must be $400–$4,000. Subject to Afterpay approval.</>}
                </p>
              </>
            )}

            <div className="milestones">
              <div className="ms-label">How your project actually runs (SDLC)</div>
              <div className="ms-row">
                <div className="ms-step"><div className="ms-pct">25%</div><div className="ms-name">Kickoff</div><div className="ms-what">Discovery, scope locked, deposit collected, day-1 build push</div></div>
                <div className="ms-arrow">→</div>
                <div className="ms-step"><div className="ms-pct">50%</div><div className="ms-name">Build sprints</div><div className="ms-what">{sprintCadence === "1w" ? "1-week sprints w/ weekly demos. Fast Track (+$300)." : "2-week sprints w/ demos every 2 weeks."}</div></div>
                <div className="ms-arrow">→</div>
                <div className="ms-step ms-test"><div className="ms-pct">incl</div><div className="ms-name">Testing (UAT)</div><div className="ms-what">{testingWeeks(summary.one)}-week UAT on staging. You test, flag bugs, we fix the list — no extra charge.</div></div>
                <div className="ms-arrow">→</div>
                <div className="ms-step"><div className="ms-pct">25%</div><div className="ms-name">Launch</div><div className="ms-what">Final polish, go live, hand-off, 90-day warranty starts</div></div>
              </div>

              <div className="sprint-pick">
                <div className="sp-label">Sprint cadence — how often we demo work to you</div>
                <div className="sp-grid">
                  <div className={`sp-opt${sprintCadence === "2w" ? " on" : ""}`} onClick={() => setSprintCadence("2w")}>
                    <div className="sp-name">2-week sprints  <span className="sp-tag-incl">INCLUDED</span></div>
                    <div className="sp-sub">Standard agile. Demo every 2 weeks. Best balance of speed + cost.</div>
                  </div>
                  <div className={`sp-opt${sprintCadence === "1w" ? " on" : ""}`} onClick={() => setSprintCadence("1w")}>
                    <div className="sp-name">1-week sprints  <span className="sp-tag-up">FAST TRACK +$300</span></div>
                    <div className="sp-sub">Demos every week. Faster turnaround. Good if you need it live yesterday.</div>
                  </div>
                </div>
              </div>

              <p className="ms-note">Testing/UAT is built into every project (no extra charge). If you cancel mid-project, you pay for milestones completed + the percentage done on the current one. Future milestones cost nothing. <b>90 days of bug fixes are free after launch.</b> After that, free with a Care Plan or $75/hr without.</p>
            </div>
          </div>
        )}

        {summary.rec > 0 && (
          <div className="ret-box">
            <div className="ret-head">
              <div className="ret-pulse"></div>
              <div>
                <div className="ret-kicker">Monthly Plan Selected</div>
                <div className="ret-title">{fmt(summary.rec)}/mo</div>
              </div>
            </div>
            <div className="ret-grid">
              <div className="ret-cell"><div className="rc-label">First charge</div><div className="rc-val">When we kick off</div></div>
              <div className="ret-cell"><div className="rc-label">Billing day</div><div className="rc-val">1st of each month</div></div>
              <div className="ret-cell"><div className="rc-label">Term</div><div className="rc-val">Month-to-month</div></div>
              <div className="ret-cell"><div className="rc-label">Cancel</div><div className="rc-val">14 days&apos; notice, anytime</div></div>
            </div>
            <p className="ret-terms">A card on file auto-bills on the <b>1st of each month</b>. Cancel anytime with 14 days&apos; written notice — your final month finishes out (you keep access until it ends). <b>No long-term lock-in, no cancellation fees.</b></p>
          </div>
        )}
      </div>

      <div className="bar">
        <div className="bar-in">
          <div>
            <div className="tot-label">Your estimate</div>
            <div className="tot-row">
              <span className="tot-1"><span className="pre">from</span>{fmt(summary.one)}</span>
              {summary.rec > 0 && <span className="tot-rec">+ {fmt(summary.rec)}/mo</span>}
            </div>
            <div className="tot-count">{selected.size > 0 ? `${selected.size} item${selected.size > 1 ? "s" : ""} selected${summary.fastTrack > 0 ? ` · +$${summary.fastTrack} Fast Track` : ""}` : "Nothing selected yet"}</div>
          </div>
          <div className="bar-btns">
            <button className="btn btn-ghost" onClick={() => setReviewOpen(true)}>Review</button>
            <button className="btn btn-save" onClick={save} disabled={submitting}>{submitting ? "Saving…" : "Save Estimate"}</button>
          </div>
        </div>
      </div>

      {toastMsg && <div className="toast show">{toastMsg}</div>}

      {reviewOpen && (
        <div className="modal open" onClick={(e) => { if (e.target === e.currentTarget) setReviewOpen(false); }}>
          <div className="modal-card">
            <h3>{cliName ? `${cliName}'s Estimate` : "Your Estimate"}</h3>
            <p>{summary.items.length ? "Here's what you've picked. Starting prices — final quote confirmed when we talk." : "Nothing selected yet. Tap items above to build your estimate."}</p>
            <div className="mlist">
              {summary.items.map(it => (
                <div key={it.id} className="mline"><span className="mn">{it.name}</span><span className="mp">{it.recur ? `${fmt(it.price)}/mo` : (it.bundle ? fmt(it.price) : `from ${fmt(it.price)}`)}</span></div>
              ))}
            </div>
            <div className="mtot"><span>One-time total</span><span>from {fmt(summary.one)}</span></div>
            {summary.rec > 0 && <div className="mtot eb-mtot-sub"><span>Monthly</span><span>{fmt(summary.rec)}/mo</span></div>}
            {planObj && <div className="mtot eb-mtot-plan"><span>Payment plan</span><span>{planObj.name}</span></div>}
            <button className="btn btn-save eb-mclose" onClick={() => setReviewOpen(false)}>Looks good — close</button>
          </div>
        </div>
      )}

      <style jsx>{styles}</style>
    </div>
  );
}

const styles = `
.eb-root{font-family:'DM Sans',sans-serif;color:#F2EAD5;padding-bottom:140px;position:relative;}
.eb-root :global(*){box-sizing:border-box;}
.eb-wrap{max-width:920px;margin:0 auto;padding:0 18px;}
.eb-header{padding:34px 0 16px;}
.kicker{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#E0A53C;font-weight:700;}
h1{font-family:'Fraunces',serif;font-size:clamp(30px,6vw,46px);font-weight:900;line-height:1.02;margin:8px 0 6px;color:#F2EAD5;}
h1 em{font-style:italic;color:#E0431F;}
.sub{color:rgba(242,234,213,.55);font-size:15px;max-width:560px;line-height:1.5;}
.namebar{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0 8px;}
.namebar input{flex:1;min-width:180px;background:#181512;border:1px solid rgba(242,234,213,.10);border-radius:11px;padding:13px 15px;color:#F2EAD5;font-size:15px;font-family:inherit;}
.namebar input:focus{outline:none;border-color:#E0A53C;}
.namebar input::placeholder{color:rgba(242,234,213,.35);}
.disclaim{font-size:11px;color:rgba(242,234,213,.35);font-style:italic;margin-top:4px;}
.cat{margin-top:26px;}
.cat-head{display:flex;align-items:center;gap:12px;margin-bottom:12px;}
.cat-title{font-family:'Fraunces',serif;font-size:20px;font-weight:700;color:#F2EAD5;}
.cat-line{flex:1;height:1px;background:rgba(242,234,213,.10);}
.cat-desc{color:rgba(242,234,213,.35);font-size:12.5px;margin:-6px 0 12px;}
.item{background:#181512;border:1px solid rgba(242,234,213,.10);border-radius:14px;padding:15px 16px;margin-bottom:9px;display:flex;align-items:flex-start;gap:14px;cursor:pointer;transition:border-color .18s,background .18s,transform .1s;}
.item:hover{border-color:rgba(224,165,60,.4);}
.item.on{border-color:#E0A53C;background:#1F1B16;}
.item:active{transform:scale(.995);}
.check{flex-shrink:0;width:24px;height:24px;border-radius:7px;border:2px solid rgba(242,234,213,.35);display:flex;align-items:center;justify-content:center;margin-top:1px;transition:all .18s;font-size:14px;color:transparent;}
.item.on .check{background:#E0A53C;border-color:#E0A53C;color:#1A1410;}
.item.is-bundle{background:linear-gradient(135deg,rgba(224,165,60,.10),rgba(224,67,31,.06));border-color:rgba(224,165,60,.35);}
.item.is-bundle .it-name{font-family:'Fraunces',serif;font-size:17px;}
.item.is-bundle .it-price{font-size:18px;}
.it-body{flex:1;min-width:0;}
.it-top{display:flex;justify-content:space-between;align-items:baseline;gap:10px;}
.it-name{font-weight:700;font-size:15px;}
.it-price{color:#E0A53C;font-weight:700;font-size:15px;white-space:nowrap;font-family:'Fraunces',serif;}
.it-what{color:rgba(242,234,213,.55);font-size:13px;margin-top:3px;line-height:1.45;}
.it-eg{color:rgba(242,234,213,.35);font-size:11.5px;margin-top:5px;font-style:italic;line-height:1.4;}
.it-eg b{color:rgba(242,234,213,.55);font-style:normal;}
.recur{font-size:10px;color:#37B24D;font-weight:700;letter-spacing:.04em;text-transform:uppercase;display:inline-block;margin-top:6px;}
.recur.eb-gold{color:#E0A53C;}
.foot-note{font-size:11px;color:rgba(242,234,213,.35);text-align:center;margin-top:30px;line-height:1.6;padding:0 10px;}
.foot-note b{color:rgba(242,234,213,.55);}
.pay-box{margin-top:30px;background:linear-gradient(135deg,rgba(224,165,60,.08),rgba(55,178,77,.05));border:1px solid rgba(224,165,60,.25);border-radius:14px;padding:18px;}
.pay-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:14px 0 12px;}
.pay-opt{background:#181512;border:1.5px solid rgba(242,234,213,.10);border-radius:12px;padding:13px 14px;cursor:pointer;transition:all .18s;}
.pay-opt:hover{border-color:#E0A53C;}
.pay-opt.on{border-color:#E0A53C;background:#1F1B16;box-shadow:0 0 0 1px #E0A53C inset;}
.po-name{font-weight:700;font-size:14px;margin-bottom:3px;}
.po-tag{display:inline-block;font-size:9px;background:#E0A53C;color:#1A1410;padding:1px 6px;border-radius:99px;font-weight:700;letter-spacing:.06em;margin-left:6px;vertical-align:middle;}
.po-sub{font-size:11.5px;color:rgba(242,234,213,.55);line-height:1.4;}
.pay-summary{background:#1A1410;border-radius:10px;padding:13px 16px;font-size:13px;line-height:1.6;display:none;}
.pay-summary.show{display:block;}
.pay-summary b{color:#E0A53C;}
.pay-summary .ps-line{display:flex;justify-content:space-between;padding:3px 0;}
.pay-summary .ps-total{border-top:1px solid rgba(242,234,213,.10);margin-top:5px;padding-top:8px;font-weight:700;color:#F2EAD5;}
.pay-terms{font-size:11px;color:rgba(242,234,213,.35);margin-top:10px;line-height:1.6;font-style:italic;}
.milestones{margin-top:18px;padding-top:18px;border-top:1px solid rgba(242,234,213,.10);}
.ms-label{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#E0A53C;font-weight:700;margin-bottom:12px;}
.ms-row{display:flex;align-items:stretch;gap:8px;flex-wrap:wrap;}
.ms-step{flex:1;min-width:130px;background:#181512;border:1px solid rgba(242,234,213,.10);border-radius:11px;padding:11px 12px;}
.ms-pct{font-family:'Fraunces',serif;font-size:22px;font-weight:900;color:#E0A53C;line-height:1;}
.ms-name{font-weight:700;font-size:13px;margin-top:3px;}
.ms-what{font-size:11px;color:rgba(242,234,213,.55);margin-top:3px;line-height:1.4;}
.ms-arrow{color:rgba(242,234,213,.35);align-self:center;font-size:18px;}
.ms-note{font-size:12px;color:rgba(242,234,213,.55);margin-top:12px;line-height:1.6;font-style:italic;}
.ms-note b{color:#37B24D;font-style:normal;}
.ms-step.ms-test{background:linear-gradient(135deg,rgba(55,178,77,.08),#181512);border-color:rgba(55,178,77,.30);}
.ms-step.ms-test .ms-pct{color:#37B24D;font-size:14px;text-transform:uppercase;letter-spacing:.06em;}
.sprint-pick{margin-top:14px;padding-top:14px;border-top:1px dashed rgba(242,234,213,.10);}
.sp-label{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:rgba(242,234,213,.35);font-weight:700;margin-bottom:9px;}
.sp-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.sp-opt{background:#181512;border:1.5px solid rgba(242,234,213,.10);border-radius:11px;padding:11px 13px;cursor:pointer;transition:all .15s;}
.sp-opt:hover{border-color:#E0A53C;}
.sp-opt.on{border-color:#E0A53C;background:#1F1B16;box-shadow:0 0 0 1px #E0A53C inset;}
.sp-name{font-weight:700;font-size:13px;margin-bottom:3px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.sp-sub{font-size:11.5px;color:rgba(242,234,213,.55);line-height:1.4;}
.sp-tag-incl{font-size:9px;background:#37B24D;color:#fff;padding:1px 6px;border-radius:99px;font-weight:700;letter-spacing:.06em;}
.sp-tag-up{font-size:9px;background:#E0A53C;color:#1A1410;padding:1px 6px;border-radius:99px;font-weight:700;letter-spacing:.06em;}
.ret-box{margin-top:18px;background:linear-gradient(135deg,rgba(55,178,77,.08),rgba(55,178,77,.03));border:1px solid rgba(55,178,77,.30);border-radius:14px;padding:18px;}
.ret-head{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
.ret-pulse{width:10px;height:10px;border-radius:50%;background:#37B24D;box-shadow:0 0 0 4px rgba(55,178,77,.18);animation:ebpulse 2s infinite;}
@keyframes ebpulse{0%{box-shadow:0 0 0 4px rgba(55,178,77,.18);}70%{box-shadow:0 0 0 10px rgba(55,178,77,0);}100%{box-shadow:0 0 0 4px rgba(55,178,77,0);}}
.ret-kicker{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#37B24D;font-weight:700;}
.ret-title{font-family:'Fraunces',serif;font-size:20px;font-weight:700;color:#F2EAD5;margin-top:2px;}
.ret-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin-bottom:12px;}
.ret-cell{background:#181512;border:1px solid rgba(242,234,213,.10);border-radius:10px;padding:10px 12px;}
.rc-label{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:rgba(242,234,213,.35);font-weight:700;}
.rc-val{font-size:13px;font-weight:600;color:#F2EAD5;margin-top:3px;line-height:1.3;}
.ret-terms{font-size:12px;color:rgba(242,234,213,.55);line-height:1.6;font-style:italic;}
.ret-terms b{color:#F2EAD5;font-style:normal;}
.bar{position:sticky;bottom:0;left:0;right:0;background:rgba(20,17,13,.92);backdrop-filter:blur(14px);border-top:1px solid #E0A53C;z-index:5;margin-top:30px;}
.bar-in{max-width:920px;margin:0 auto;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;}
.tot-label{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(242,234,213,.35);}
.tot-row{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;}
.tot-1{font-family:'Fraunces',serif;font-size:28px;font-weight:900;color:#F2EAD5;}
.tot-1 .pre{font-size:14px;color:rgba(242,234,213,.55);font-weight:500;margin-right:4px;}
.tot-rec{font-size:14px;color:#37B24D;font-weight:700;}
.tot-count{font-size:12px;color:rgba(242,234,213,.35);}
.bar-btns{display:flex;gap:9px;}
.btn{border:none;border-radius:11px;padding:13px 20px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;transition:transform .12s,opacity .12s;}
.btn:active{transform:scale(.96);}
.btn:disabled{opacity:.5;cursor:wait;}
.btn-save{background:#E0A53C;color:#1A1410;}
.btn-ghost{background:transparent;color:#F2EAD5;border:1px solid rgba(242,234,213,.10);}
.btn-ghost:hover{border-color:#E0A53C;}
.toast{position:fixed;bottom:120px;left:50%;transform:translateX(-50%) translateY(20px);opacity:0;background:#37B24D;color:#fff;padding:12px 22px;border-radius:99px;font-weight:600;font-size:14px;z-index:60;pointer-events:none;transition:all .3s;box-shadow:0 8px 30px rgba(55,178,77,.4);}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
.modal{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:70;display:flex;align-items:center;justify-content:center;padding:18px;}
.modal-card{background:#181512;border:1px solid #E0A53C;border-radius:18px;padding:26px;max-width:460px;width:100%;}
.modal-card h3{font-family:'Fraunces',serif;font-size:24px;margin-bottom:6px;color:#F2EAD5;}
.modal-card p{color:rgba(242,234,213,.55);font-size:14px;line-height:1.55;margin-bottom:14px;}
.mlist{background:#0E0C0A;border-radius:11px;padding:14px;margin-bottom:14px;max-height:240px;overflow-y:auto;}
.mline{display:flex;justify-content:space-between;font-size:13px;padding:5px 0;border-bottom:1px solid rgba(242,234,213,.10);}
.mline:last-child{border:none;}
.mn{color:#F2EAD5;}
.mp{color:#E0A53C;font-weight:600;white-space:nowrap;}
.mtot{display:flex;justify-content:space-between;font-family:'Fraunces',serif;font-size:18px;font-weight:700;margin-top:10px;padding-top:10px;border-top:1px solid #E0A53C;color:#F2EAD5;}
.mtot.eb-mtot-sub{font-size:14px;border:none;padding-top:4px;}
.mtot.eb-mtot-plan{font-size:13px;border:none;padding-top:4px;color:#E0A53C;}
.eb-mclose{width:100%;margin-top:16px;}
.eb-success{padding:60px 18px;display:flex;justify-content:center;}
.eb-success-card{background:#181512;border:1px solid #37B24D;border-radius:18px;padding:36px;max-width:520px;text-align:center;}
.eb-success-kick{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#37B24D;font-weight:700;margin-bottom:10px;}
.eb-success-card h3{font-family:'Fraunces',serif;font-size:30px;font-weight:900;color:#F2EAD5;margin-bottom:14px;}
.eb-success-card p{color:rgba(242,234,213,.55);font-size:15px;line-height:1.55;margin-bottom:10px;}
.eb-success-id{font-size:12px;color:rgba(242,234,213,.35);margin-top:18px;}
.eb-success-id code{background:#0E0C0A;padding:3px 8px;border-radius:6px;color:#E0A53C;font-family:monospace;}
@media(max-width:540px){.ms-arrow{display:none;}.ms-step{min-width:100%;}.sp-grid{grid-template-columns:1fr;}}
`;

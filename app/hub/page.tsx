import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthedCode } from "@/lib/session";

const ADMIN_CODES = ["RANDY2026"];

type LinkItem = { label: string; href: string; placeholder?: boolean };
type LinkGroup = { title: string; items: LinkItem[] };
type Money = {
  pending: number;     // invoices sent but not yet paid
  estimate: number;    // pitched build value still outstanding (after pending)
  monthlyBasic: number;  // Care Plan basic ($250/mo) + any AI mgmt
  monthlyContent: number;// Care Plan + Content ($400/mo) + any AI mgmt
};
type Project = {
  badge: string;
  badgeClass: "j" | "r" | "g" | "t" | "e";
  name: string;
  owner: string;
  info?: string;
  pill?: string;
  money?: Money;
  groups: LinkGroup[];
  next?: string;
  open?: boolean;
};

const fmt = (n: number) => "$" + n.toLocaleString();

const DRIVE_PDF = (id: string) => `https://drive.google.com/file/d/${id}/view`;
const DRIVE_DOC = (id: string) => `https://docs.google.com/document/d/${id}/edit`;
const SQUARE_INVOICES = "https://app.squareup.com/dashboard/invoices";

const PROJECTS: Project[] = [
  {
    badge: "RT",
    badgeClass: "t",
    name: "Rich Off Tech Toolkit",
    owner: "Shared tools across every client",
    open: true,
    groups: [
      {
        title: "Live tools",
        items: [
          { label: "Pricing Menu", href: "https://rotechllc.com/pricing" },
          { label: "Estimate Builder", href: "https://rotechllc.com/pricing#estimate" },
          { label: "Roster", href: "https://rotechllc.com/roster" },
        ],
      },
      {
        title: "Sales & ops",
        items: [
          { label: "Gmail", href: "https://mail.google.com" },
          { label: "Drive", href: "https://drive.google.com" },
          { label: "Vercel — ROTECH", href: "https://vercel.com/rotech" },
          { label: "GitHub Org", href: "https://github.com/richofftechllc-dot" },
          { label: "Square — all invoices", href: SQUARE_INVOICES },
          { label: "Railway", href: "https://railway.app/dashboard" },
        ],
      },
    ],
  },
  {
    badge: "JJ",
    badgeClass: "j",
    name: "Jollof & Jerk",
    owner: "Mamadou Bah · 2020 9th St NW, DC",
    info: "Restaurant · West African + Caribbean · Uber Eats active · Client: jollofandjerkcatering@gmail.com",
    pill: "Pitch: Gold $2,500",
    money: { pending: 1500, estimate: 1000, monthlyBasic: 250, monthlyContent: 400 },
    open: true,
    groups: [
      {
        title: "Live & build",
        items: [
          { label: "Live Site", href: "https://jollof-and-jerk-chi.vercel.app" },
          { label: "GitHub Repo", href: "https://github.com/richofftechllc-dot/jollof-and-jerk" },
          { label: "Vercel Project", href: "https://vercel.com/rotech/jollof-and-jerk" },
          { label: "Instagram", href: "https://instagram.com/jollo_fandjerk" },
        ],
      },
      {
        title: "Proposal · pricing · CRM",
        items: [
          { label: "Pricing Menu (Proposal PDF)", href: DRIVE_PDF("1jPLfi2qMuV-d9rCTQhVgNysTQKvOsW-g") },
          { label: "Customer CRM Sheet", href: "https://docs.google.com/spreadsheets/d/1Xyov_5jzKXrOl8BoQMfETa5XPH9U20YVNbDEiKfxSIQ/edit" },
          { label: "Discovery Call (Fireflies)", href: "https://app.fireflies.ai/view/01KSNSNSFBHWFMEZBVMSVP1JTH" },
          { label: "Email Mamadou", href: "mailto:jollofandjerkcatering@gmail.com" },
        ],
      },
      {
        title: "Square invoices sent",
        items: [
          { label: "#000210 · Project Deposit · $250 (due May 29)", href: SQUARE_INVOICES },
          { label: "#000211 · Website Build Balance · $750 (due Jun 4)", href: SQUARE_INVOICES },
          { label: "#000212 · Social Content 30 Days · $500 (due Jun 4)", href: SQUARE_INVOICES },
        ],
      },
    ],
    next: "Send proposal + walkthrough → collect access (GBP, domain, Stripe, phone, Square capture, Uber Eats login, his story) → lock the $250 deposit.",
  },
  {
    badge: "RL",
    badgeClass: "r",
    name: "Rendezvous Lounge",
    owner: "Eyob · upstairs at 2020 9th St NW",
    info: "Lounge / nightlife · keeps Toast · same building as Jollof · review system is the hook",
    pill: "Pitch: Gold $1,800",
    money: { pending: 0, estimate: 1800, monthlyBasic: 250, monthlyContent: 400 },
    groups: [
      {
        title: "Live & build",
        items: [
          { label: "Live Demo (rotechllc.com)", href: "https://www.rotechllc.com/demo/rendezvous-lounge" },
          { label: "Standalone Vercel", href: "https://rendezvous-lounge.vercel.app" },
          { label: "GitHub Repo", href: "https://github.com/richofftechllc-dot/rendezvous-lounge" },
          { label: "Vercel Project", href: "https://vercel.com/rotech/rendezvous-lounge" },
        ],
      },
      {
        title: "Proposal · pricing",
        items: [
          { label: "Pricing Menu (Proposal PDF)", href: DRIVE_PDF("1O7iCS3wogj9p-SkE8mX-oRcjT2cdr6oQ") },
        ],
      },
    ],
    next: "Offer to build the live scan-page demo → collect access (GBP, domain, bar phone for alerts, bartender names, photos). Toast stays untouched. Lock the $540 deposit.",
  },
  {
    badge: "GG",
    badgeClass: "g",
    name: "GG Locks",
    owner: "Fernando 'Nando' Lewis · lewisnando96@icloud.com",
    info: "Platform build + AI agent · domain gglocks.com pending purchase · uptime monitored via UptimeRobot",
    pill: "Deposit: $1,000 (invoice sent)",
    money: { pending: 1000, estimate: 4000, monthlyBasic: 375, monthlyContent: 525 },
    groups: [
      {
        title: "Live & build",
        items: [
          { label: "Live Site", href: "https://gglocks-web.vercel.app" },
          { label: "GitHub Repo (web)", href: "https://github.com/richofftechllc-dot/gglocks-web" },
          { label: "Vercel Project (web)", href: "https://vercel.com/rotech/gglocks-web" },
          { label: "GitHub Repo (bot)", href: "https://github.com/richofftechllc-dot/gg-locks-bot" },
          { label: "Railway (bot)", href: "https://railway.app/dashboard" },
          { label: "UptimeRobot Monitor", href: "https://uptimerobot.com/dashboard" },
        ],
      },
      {
        title: "Pricing · playbook · build menu",
        items: [
          { label: "Full Pricing (2026-05-24)", href: DRIVE_DOC("1xHfck-6VHeF-G6HOrhBDPg8c2_a3mGA6pkuJl0eXyo8") },
          { label: "Build Menu", href: DRIVE_DOC("1X2fhaPhk0ZPceQUpsMgjTh_YHgR4WVwWly1yeT373wM") },
          { label: "Master Playbook", href: DRIVE_DOC("1nShDo8Jdx8Ml3QqTxpwbMb7n9To4c590wK4R2V46tLg") },
          { label: "Nando Playbook", href: DRIVE_DOC("1PZe_3tCKi_sN3A_Z60JB_wDVhzZI4TMYaTBN_iEfY70") },
        ],
      },
      {
        title: "Square invoice sent",
        items: [
          { label: "#GGLOCKS-001 · Platform Build Deposit · $1,000 (due May 26)", href: SQUARE_INVOICES },
        ],
      },
      {
        title: "Client",
        items: [
          { label: "Email Nando (iCloud)", href: "mailto:lewisnando96@icloud.com" },
        ],
      },
    ],
    next: "Confirm domain purchase (gglocks.com), follow up on the $1,000 deposit invoice, fix the last failed Vercel deploys.",
  },
  {
    badge: "OE",
    badgeClass: "e",
    name: "Owed To Eddie",
    owner: "Eddie · OWEDTOEDDIE@yahoo.com · Newport News, VA",
    info: "Food truck (the 757) · demo built + pitched May 19 · waiting on Eddie to confirm walkthrough times",
    pill: "Pitch: Gold $2,500",
    money: { pending: 0, estimate: 2500, monthlyBasic: 250, monthlyContent: 400 },
    groups: [
      {
        title: "Live & build",
        items: [
          { label: "Live Demo", href: "https://owed-to-eddie-demo.vercel.app" },
          { label: "GitHub Repo", href: "https://github.com/richofftechllc-dot/owed-to-eddie-demo" },
          { label: "Vercel Project", href: "https://vercel.com/rotech/owed-to-eddie-demo" },
        ],
      },
      {
        title: "Client",
        items: [
          { label: "Email Eddie", href: "mailto:OWEDTOEDDIE@yahoo.com" },
          { label: "Original pitch email", href: "https://mail.google.com/mail/u/0/#search/owedtoeddie" },
        ],
      },
    ],
    next: "Follow up on the walkthrough — propose 2–3 specific times. Demo: real-time site update from a text + AI voice agent answers a catering call.",
  },
];

export default async function Hub() {
  const h = await headers();
  const req = new Request("http://x.local", { headers: h });
  const code = await getAuthedCode(req);
  if (!code || !ADMIN_CODES.includes(code)) {
    redirect(`/login?from=${encodeURIComponent("/hub")}`);
  }

  const styles = `
    .hub-wrap{max-width:780px;margin:0 auto;padding:46px 18px 80px;color:#f4f1ea;font-family:"Hanken Grotesk",system-ui,sans-serif;line-height:1.5}
    .hub-brand{font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:#d9b65a;font-weight:800}
    .hub-h1{font-size:clamp(30px,6vw,46px);font-weight:800;margin:12px 0 6px;letter-spacing:-.02em}
    .hub-sub{color:#9c968b;max-width:56ch;font-size:14px}
    .hub-seclbl{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#6b665d;font-weight:700;margin:30px 0 12px}
    details.proj{border:1px solid rgba(255,255,255,.08);border-radius:15px;margin-bottom:13px;overflow:hidden;background:#16161b;transition:border-color .18s}
    details.proj[open]{border-color:rgba(255,255,255,.15)}
    details.proj summary{display:flex;align-items:center;gap:14px;padding:18px 20px;cursor:pointer;list-style:none}
    details.proj summary::-webkit-details-marker{display:none}
    .badge{flex-shrink:0;width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:17px;color:#0b0b0d}
    .badge.j{background:linear-gradient(135deg,#e9c977,#b8862f)}
    .badge.r{background:linear-gradient(135deg,#cfa6e0,#7a4fa0);color:#fff}
    .badge.t{background:linear-gradient(135deg,#cfd4dd,#9aa0ab);color:#1a1a1a}
    .badge.g{background:linear-gradient(135deg,#7fd1a6,#2a8c5a);color:#0b0b0d}
    .badge.e{background:linear-gradient(135deg,#ff8c5a,#c43a1b);color:#fff}
    .money{background:linear-gradient(135deg,#1a1a20,#16161b);border:1px solid rgba(217,182,90,.25);border-radius:14px;padding:18px 20px;margin:20px 0 8px}
    .money-head{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#d9b65a;font-weight:800;margin-bottom:12px}
    .money-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
    @media(min-width:600px){.money-grid{grid-template-columns:repeat(4,1fr)}}
    .money-cell{background:#0e0e12;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:11px 13px}
    .money-lbl{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#6b665d;font-weight:700;margin-bottom:4px}
    .money-val{font-weight:800;font-size:21px;color:#f4f1ea;letter-spacing:-.01em}
    .money-val.pos{color:#7fd1a6}
    .money-val.gold{color:#f3dd9c}
    .money-sub{font-size:11px;color:#6b665d;margin-top:2px}
    .money-locked{margin-top:14px;padding-top:14px;border-top:1px dashed rgba(255,255,255,.08);font-size:12.5px;color:#9c968b;line-height:1.6}
    .money-locked b{color:#f3dd9c}
    .pmoney{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;font-size:11.5px}
    .pmoney span{background:#0e0e12;border:1px solid rgba(255,255,255,.06);border-radius:6px;padding:4px 8px;color:#9c968b}
    .pmoney span b{color:#f3dd9c;font-weight:700}
    .pname{font-weight:800;font-size:19px;color:#f4f1ea}
    .powner{color:#9c968b;font-size:12.5px;margin-top:1px}
    .pill{font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:4px 10px;border-radius:99px;color:#0b0b0d;background:linear-gradient(90deg,#e9c977,#b8862f)}
    .chev{margin-left:auto;color:#6b665d;font-size:14px;transition:transform .22s}
    details.proj[open] .chev{transform:rotate(180deg);color:#d9b65a}
    .pinner{padding:2px 20px 20px}
    .info{font-size:12.5px;color:#9c968b;border-top:1px solid rgba(255,255,255,.08);padding-top:13px;margin-bottom:6px}
    .info b{color:#f4f1ea;font-weight:600}
    .lgroup{margin-top:14px}
    .lt{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#6b665d;font-weight:700;margin-bottom:8px}
    .links{display:flex;flex-wrap:wrap;gap:8px}
    a.lnk{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.15);padding:9px 13px;border-radius:10px;color:#f4f1ea;text-decoration:none;font-size:13px;font-weight:600;background:#131317;transition:border-color .15s,color .15s,background .15s}
    a.lnk:hover{border-color:#d9b65a;color:#f3dd9c;background:rgba(217,182,90,.08)}
    a.lnk .ext{color:#6b665d;font-size:11px}
    a.lnk:hover .ext{color:#d9b65a}
    .next{background:rgba(217,182,90,.08);border:1px solid rgba(217,182,90,.3);border-radius:11px;padding:12px 15px;margin-top:16px;font-size:13.5px;color:#f4f1ea}
    .next b{color:#f3dd9c}
    .hub-foot{color:#6b665d;font-size:12px;text-align:center;padding:26px 0 0}
  `;

  return (
    <main style={{ background: "#0b0b0d", minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="hub-wrap">
        <div className="hub-brand">Rich Off Tech LLC · Private</div>
        <h1 className="hub-h1">Project Hub</h1>
        <p className="hub-sub">
          Every client, every link, in one place. Tap a project to open its links — sites, code, deploys, proposals, CRM, calls, invoices. Admin-only.
        </p>

        <MoneySnapshot projects={PROJECTS.filter(p => p.money)} />

        <div className="hub-seclbl">Toolkit</div>
        {PROJECTS.slice(0, 1).map(p => (
          <ProjectCard key={p.name} p={p} />
        ))}

        <div className="hub-seclbl">Active projects</div>
        {PROJECTS.slice(1).map(p => (
          <ProjectCard key={p.name} p={p} />
        ))}

        <div className="hub-foot">Rich Off Tech LLC · richofftechllc@gmail.com · signed in as <b style={{ color: "#d9b65a" }}>{code}</b></div>
      </div>
    </main>
  );
}

function MoneySnapshot({ projects }: { projects: Project[] }) {
  const m = projects.reduce(
    (acc, p) => {
      if (!p.money) return acc;
      acc.pending += p.money.pending;
      acc.estimate += p.money.estimate;
      acc.monthlyBasic += p.money.monthlyBasic;
      acc.monthlyContent += p.money.monthlyContent;
      return acc;
    },
    { pending: 0, estimate: 0, monthlyBasic: 0, monthlyContent: 0 }
  );
  const totalBuild = m.pending + m.estimate;
  const year1Basic = totalBuild + m.monthlyBasic * 12;
  const year1Content = totalBuild + m.monthlyContent * 12;
  return (
    <div className="money">
      <div className="money-head">Money snapshot · all 4 clients</div>
      <div className="money-grid">
        <div className="money-cell">
          <div className="money-lbl">Pending invoices</div>
          <div className="money-val gold">{fmt(m.pending)}</div>
          <div className="money-sub">Sent, awaiting pay</div>
        </div>
        <div className="money-cell">
          <div className="money-lbl">Estimate left</div>
          <div className="money-val">{fmt(m.estimate)}</div>
          <div className="money-sub">Pitched, not yet invoiced</div>
        </div>
        <div className="money-cell">
          <div className="money-lbl">Total deal value</div>
          <div className="money-val gold">{fmt(totalBuild)}</div>
          <div className="money-sub">One-time builds combined</div>
        </div>
        <div className="money-cell">
          <div className="money-lbl">Monthly potential</div>
          <div className="money-val pos">{fmt(m.monthlyBasic)}–{fmt(m.monthlyContent)}/mo</div>
          <div className="money-sub">Care vs Care+Content</div>
        </div>
      </div>
      <div className="money-locked">
        <b>If all 4 lock in:</b> {fmt(totalBuild)} one-time build · {fmt(m.monthlyBasic)}/mo recurring on basic Care, {fmt(m.monthlyContent)}/mo on Content tier.<br />
        <b>Year-1 take:</b> {fmt(year1Basic)} (basic Care across the board) up to {fmt(year1Content)} (Content tier across the board).
      </div>
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  return (
    <details className="proj" {...(p.open ? { open: true } : {})}>
      <summary>
        <div className={`badge ${p.badgeClass}`}>{p.badge}</div>
        <div>
          <div className="pname">{p.name}</div>
          <div className="powner">{p.owner}</div>
        </div>
        {p.pill ? <span className="pill" style={{ marginLeft: "auto" }}>{p.pill}</span> : null}
        <span className="chev" style={p.pill ? {} : { marginLeft: "auto" }}>▼</span>
      </summary>
      <div className="pinner">
        {p.info ? <div className="info">{p.info}</div> : null}
        {p.money ? (
          <div className="pmoney">
            <span>Pending <b>{fmt(p.money.pending)}</b></span>
            <span>Estimate left <b>{fmt(p.money.estimate)}</b></span>
            <span>Monthly (Care) <b>{fmt(p.money.monthlyBasic)}/mo</b></span>
            <span>Monthly (+ Content) <b>{fmt(p.money.monthlyContent)}/mo</b></span>
          </div>
        ) : null}
        {p.groups.map(g => (
          <div className="lgroup" key={g.title}>
            <div className="lt">{g.title}</div>
            <div className="links">
              {g.items.map(it => (
                <a
                  key={it.label}
                  className="lnk"
                  href={it.href}
                  target={it.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                >
                  {it.label} <span className="ext">↗</span>
                </a>
              ))}
            </div>
          </div>
        ))}
        {p.next ? <div className="next"><b>Next:</b> {p.next}</div> : null}
      </div>
    </details>
  );
}

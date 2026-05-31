import { coll } from "./firebase";

export type LineItem = {
  id: string;
  label: string;
  amount: number;
  kind: "once" | "monthly";
  status: "pending" | "invoiced" | "paid" | "cancelled";
  note?: string;
  createdAt: string;
};

export type Money = {
  pending: number;      // invoiced + once items, not paid yet
  estimate: number;     // pending + once items (not invoiced)
  totalBuild: number;   // sum of all once items (excluding cancelled)
  monthly: number;      // sum of monthly items (excluding cancelled)
};

export function calcMoney(items: LineItem[]): Money {
  const alive = items.filter(i => i.status !== "cancelled");
  return {
    pending: alive.filter(i => i.kind === "once" && i.status === "invoiced").reduce((s, i) => s + i.amount, 0),
    estimate: alive.filter(i => i.kind === "once" && i.status === "pending").reduce((s, i) => s + i.amount, 0),
    totalBuild: alive.filter(i => i.kind === "once").reduce((s, i) => s + i.amount, 0),
    monthly: alive.filter(i => i.kind === "monthly").reduce((s, i) => s + i.amount, 0),
  };
}

export const DEFAULT_ITEMS: Record<string, LineItem[]> = {
  "jollof-and-jerk": [
    { id: "jj-deposit",   label: "Project Deposit",        amount: 250,  kind: "once",    status: "invoiced", note: "#000210 · due May 29", createdAt: "2026-05-28T08:08:51Z" },
    { id: "jj-balance",   label: "Website Build Balance",  amount: 750,  kind: "once",    status: "invoiced", note: "#000211 · due Jun 4",  createdAt: "2026-05-28T08:09:11Z" },
    { id: "jj-social30",  label: "Social Content (30 Days)", amount: 500, kind: "once",   status: "invoiced", note: "#000212 · due Jun 4",  createdAt: "2026-05-28T08:09:32Z" },
    { id: "jj-gold-rem",  label: "Gold package remainder", amount: 1000, kind: "once",    status: "pending",  note: "to reach Gold $2,500", createdAt: "2026-05-28T08:10:00Z" },
    { id: "jj-care",      label: "Care + Content Plan",    amount: 400,  kind: "monthly", status: "pending",                                createdAt: "2026-05-28T08:10:00Z" },
  ],
  "rendezvous-lounge": [
    { id: "rdv-gold",     label: "Gold package",           amount: 1800, kind: "once",    status: "pending",                                createdAt: "2026-05-29T00:00:00Z" },
    { id: "rdv-care",     label: "Care + Content Plan",    amount: 400,  kind: "monthly", status: "pending",                                createdAt: "2026-05-29T00:00:00Z" },
  ],
  "gg-locks": [
    { id: "gg-deposit",   label: "Platform Build Deposit", amount: 1000, kind: "once",    status: "invoiced", note: "#GGLOCKS-001 · due May 26", createdAt: "2026-05-25T04:43:16Z" },
    { id: "gg-build-rem", label: "Platform Build remainder", amount: 4000, kind: "once",  status: "pending",  note: "estimate — confirm vs full pricing doc", createdAt: "2026-05-25T04:45:00Z" },
    { id: "gg-care",      label: "Care Plan",              amount: 250,  kind: "monthly", status: "pending",                                createdAt: "2026-05-25T04:45:00Z" },
    { id: "gg-ai-mgmt",   label: "AI mgmt (bot)",          amount: 125,  kind: "monthly", status: "pending",  note: "per active AI agent",  createdAt: "2026-05-25T04:45:00Z" },
  ],
  "owed-to-eddie": [
    { id: "oe-gold",      label: "Gold package",           amount: 2500, kind: "once",    status: "pending",                                createdAt: "2026-05-19T01:16:55Z" },
    { id: "oe-care",      label: "Care + Content Plan",    amount: 400,  kind: "monthly", status: "pending",                                createdAt: "2026-05-19T01:16:55Z" },
  ],
};

export async function loadItems(slug: string): Promise<LineItem[]> {
  try {
    const snap = await coll("hub_clients").doc(slug).get();
    const data = snap.data();
    if (data?.items && Array.isArray(data.items)) return data.items as LineItem[];
  } catch {
    // Firestore unavailable — fall through to defaults
  }
  return DEFAULT_ITEMS[slug] || [];
}

export async function saveItems(slug: string, items: LineItem[]): Promise<void> {
  await coll("hub_clients").doc(slug).set(
    { items, updatedAt: new Date().toISOString() },
    { merge: true }
  );
}

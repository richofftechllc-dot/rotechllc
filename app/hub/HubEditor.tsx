"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { LineItem } from "@/lib/hubData";

const STATUS_LABEL: Record<LineItem["status"], string> = {
  pending: "Pending",
  invoiced: "Invoiced",
  paid: "Paid",
  cancelled: "Cancelled",
};

const STATUS_NEXT: Record<LineItem["status"], LineItem["status"]> = {
  pending: "invoiced",
  invoiced: "paid",
  paid: "pending",
  cancelled: "pending",
};

const STATUS_COLOR: Record<LineItem["status"], string> = {
  pending: "#d9b65a",
  invoiced: "#7fb1e0",
  paid: "#7fd1a6",
  cancelled: "#6b665d",
};

const fmt = (n: number) => "$" + n.toLocaleString();

export default function HubEditor({ slug, items: initialItems }: { slug: string; items: LineItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ label: "", amount: "", kind: "once" as "once" | "monthly", status: "pending" as LineItem["status"], note: "" });
  const [err, setErr] = useState<string | null>(null);
  const [busy, startTransition] = useTransition();
  const router = useRouter();

  async function call(payload: object): Promise<{ ok: boolean; items?: LineItem[]; error?: string }> {
    try {
      const r = await fetch("/api/hub/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await r.json();
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : String(e) };
    }
  }

  function refresh() { startTransition(() => router.refresh()); }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const amt = parseFloat(form.amount);
    if (!form.label.trim()) return setErr("Need a label");
    if (!Number.isFinite(amt) || amt < 0) return setErr("Need a valid amount");
    const res = await call({ action: "add", slug, item: { label: form.label.trim(), amount: amt, kind: form.kind, status: form.status, note: form.note.trim() || undefined } });
    if (!res.ok || !res.items) { setErr(res.error || "save failed"); return; }
    setItems(res.items);
    setForm({ label: "", amount: "", kind: "once", status: "pending", note: "" });
    setAdding(false);
    refresh();
  }

  async function cycleStatus(it: LineItem) {
    const newStatus = STATUS_NEXT[it.status];
    setItems(items.map(i => i.id === it.id ? { ...i, status: newStatus } : i));
    const res = await call({ action: "update", slug, itemId: it.id, patch: { status: newStatus } });
    if (!res.ok || !res.items) { setErr(res.error || "save failed"); setItems(items); return; }
    setItems(res.items);
    refresh();
  }

  async function removeItem(it: LineItem) {
    if (!confirm(`Delete "${it.label}"?`)) return;
    const prev = items;
    setItems(items.filter(i => i.id !== it.id));
    const res = await call({ action: "delete", slug, itemId: it.id });
    if (!res.ok || !res.items) { setErr(res.error || "delete failed"); setItems(prev); return; }
    setItems(res.items);
    refresh();
  }

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: "#6b665d", fontWeight: 700, marginBottom: 8 }}>Line items</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.length === 0 && (
          <div style={{ color: "#6b665d", fontSize: 13, fontStyle: "italic", padding: "8px 0" }}>No items yet — add one below.</div>
        )}
        {items.map(it => (
          <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "#0e0e12", border: "1px solid rgba(255,255,255,.06)", borderRadius: 8, padding: "10px 12px" }}>
            <button
              onClick={() => cycleStatus(it)}
              disabled={busy}
              title="Tap to cycle status"
              style={{ background: "transparent", border: `1px solid ${STATUS_COLOR[it.status]}55`, color: STATUS_COLOR[it.status], fontSize: 10, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 99, cursor: "pointer", flexShrink: 0 }}
            >
              {STATUS_LABEL[it.status]}
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, color: "#f4f1ea", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.label}</div>
              {it.note && <div style={{ fontSize: 11, color: "#6b665d" }}>{it.note}</div>}
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#f3dd9c", whiteSpace: "nowrap" }}>{fmt(it.amount)}{it.kind === "monthly" ? "/mo" : ""}</div>
            <button
              onClick={() => removeItem(it)}
              disabled={busy}
              title="Delete"
              style={{ background: "transparent", border: "none", color: "#6b665d", cursor: "pointer", fontSize: 16, padding: "0 4px" }}
              aria-label="Delete item"
            >×</button>
          </div>
        ))}
      </div>

      {!adding ? (
        <button
          onClick={() => setAdding(true)}
          style={{ marginTop: 10, background: "transparent", border: "1px dashed rgba(217,182,90,.4)", color: "#d9b65a", fontWeight: 700, fontSize: 13, padding: "10px 14px", borderRadius: 10, cursor: "pointer", width: "100%" }}
        >
          + Add line item
        </button>
      ) : (
        <form onSubmit={addItem} style={{ marginTop: 10, background: "#0e0e12", border: "1px solid rgba(217,182,90,.3)", borderRadius: 10, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            placeholder="Label (e.g. Voice agent)"
            value={form.label}
            onChange={e => setForm({ ...form, label: e.target.value })}
            style={{ background: "#16161b", border: "1px solid rgba(255,255,255,.1)", color: "#f4f1ea", borderRadius: 7, padding: "8px 10px", fontSize: 13, outline: "none", fontFamily: "inherit" }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <input
              placeholder="Amount ($)"
              type="number"
              inputMode="decimal"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              style={{ flex: 1, background: "#16161b", border: "1px solid rgba(255,255,255,.1)", color: "#f4f1ea", borderRadius: 7, padding: "8px 10px", fontSize: 13, outline: "none", fontFamily: "inherit" }}
            />
            <select
              value={form.kind}
              onChange={e => setForm({ ...form, kind: e.target.value as "once" | "monthly" })}
              style={{ background: "#16161b", border: "1px solid rgba(255,255,255,.1)", color: "#f4f1ea", borderRadius: 7, padding: "8px 10px", fontSize: 13, fontFamily: "inherit" }}
            >
              <option value="once">One-time</option>
              <option value="monthly">Monthly</option>
            </select>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value as LineItem["status"] })}
              style={{ background: "#16161b", border: "1px solid rgba(255,255,255,.1)", color: "#f4f1ea", borderRadius: 7, padding: "8px 10px", fontSize: 13, fontFamily: "inherit" }}
            >
              <option value="pending">Pending</option>
              <option value="invoiced">Invoiced</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <input
            placeholder="Note (optional) — e.g. invoice #, due date"
            value={form.note}
            onChange={e => setForm({ ...form, note: e.target.value })}
            style={{ background: "#16161b", border: "1px solid rgba(255,255,255,.1)", color: "#f4f1ea", borderRadius: 7, padding: "8px 10px", fontSize: 13, outline: "none", fontFamily: "inherit" }}
          />
          {err && <div style={{ color: "#e0431f", fontSize: 12 }}>{err}</div>}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              disabled={busy}
              style={{ flex: 1, background: "linear-gradient(90deg,#e9c977,#b8862f)", color: "#0b0b0d", border: "none", borderRadius: 8, padding: "9px 14px", fontWeight: 800, fontSize: 13, cursor: "pointer" }}
            >
              {busy ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => { setAdding(false); setErr(null); }}
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,.15)", color: "#9c968b", borderRadius: 8, padding: "9px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

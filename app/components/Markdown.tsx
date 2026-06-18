"use client";

// Minimal, dependency-free markdown → React renderer for tutor replies.
// Handles: code fences, headings, unordered/ordered lists, blockquotes,
// paragraphs, and inline **bold** / *italic* / `code`. No HTML injection.

import React from "react";

function inline(text: string, keyBase: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const k = `${keyBase}-${i++}`;
    if (tok.startsWith("**")) out.push(<strong key={k}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("`")) out.push(<code key={k} className="rounded bg-black/40 px-1 py-0.5 text-[0.85em] text-orange-300">{tok.slice(1, -1)}</code>);
    else out.push(<em key={k}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r/g, "").split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // code fence
    if (line.trim().startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) { code.push(lines[i]); i++; }
      i++; // closing fence
      blocks.push(<pre key={key++} className="my-2 overflow-x-auto rounded-lg bg-black/50 p-3 text-xs text-gray-200"><code>{code.join("\n")}</code></pre>);
      continue;
    }
    // blank
    if (!line.trim()) { i++; continue; }
    // heading
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      const lvl = h[1].length;
      const cls = lvl === 1 ? "text-lg font-black mt-2" : lvl === 2 ? "text-base font-bold mt-2" : "text-sm font-bold mt-1";
      blocks.push(<p key={key++} className={cls}>{inline(h[2], `h${key}`)}</p>);
      i++; continue;
    }
    // unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[-*]\s+/, "")); i++; }
      blocks.push(<ul key={key++} className="my-1 list-disc space-y-1 pl-5">{items.map((it, j) => <li key={j}>{inline(it, `ul${key}-${j}`)}</li>)}</ul>);
      continue;
    }
    // ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+\.\s+/, "")); i++; }
      blocks.push(<ol key={key++} className="my-1 list-decimal space-y-1 pl-5">{items.map((it, j) => <li key={j}>{inline(it, `ol${key}-${j}`)}</li>)}</ol>);
      continue;
    }
    // blockquote
    if (/^\s*>\s?/.test(line)) {
      blocks.push(<blockquote key={key++} className="my-1 border-l-2 border-white/20 pl-3 text-gray-300">{inline(line.replace(/^\s*>\s?/, ""), `bq${key}`)}</blockquote>);
      i++; continue;
    }
    // paragraph (merge consecutive non-special lines)
    const para: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^\s*([-*]|\d+\.|#|>|```)/.test(lines[i])) { para.push(lines[i]); i++; }
    blocks.push(<p key={key++} className="my-1 leading-relaxed">{inline(para.join(" "), `p${key}`)}</p>);
  }

  return <div className="text-sm">{blocks}</div>;
}

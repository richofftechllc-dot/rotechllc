export const SECTION_ORDER = ["Summary", "Experience", "Skills", "Certifications", "Clearances", "Education"] as const;

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function applyInline(s: string): string {
  let out = escapeHtml(s);
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  return out;
}

export function renderMarkdownToHtml(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inList = false;
  const closeList = () => { if (inList) { out.push("</ul>"); inList = false; } };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { closeList(); continue; }
    if (line.startsWith("# ")) {
      closeList();
      out.push(`<h1>${applyInline(line.slice(2))}</h1>`);
    } else if (line.startsWith("## ")) {
      closeList();
      out.push(`<h2>${applyInline(line.slice(3))}</h2>`);
    } else if (line.startsWith("### ")) {
      closeList();
      out.push(`<h3>${applyInline(line.slice(4))}</h3>`);
    } else if (/^[•\-*]\s/.test(line)) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${applyInline(line.slice(2))}</li>`);
    } else {
      closeList();
      out.push(`<p>${applyInline(line)}</p>`);
    }
  }
  closeList();
  return out.join("\n");
}

export const PRINT_CSS = `
.resume-print {
  font-family: "Calibri", "Arial", "Helvetica", sans-serif;
  color: #000;
  background: #fff;
  max-width: 8.5in;
  margin: 0 auto;
  padding: 0.55in 0.7in;
  font-size: 10.5pt;
  line-height: 1.35;
}
.resume-print h1 { font-size: 22pt; margin: 0 0 0.06in; font-weight: 700; letter-spacing: 0.005em; }
.resume-print h2 { font-size: 11pt; margin: 0.20in 0 0.06in; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1pt solid #000; padding-bottom: 0.02in; font-weight: 700; }
.resume-print h3 { font-size: 10.5pt; margin: 0.10in 0 0.02in; font-weight: 700; }
.resume-print p { margin: 0.03in 0; }
.resume-print ul { margin: 0.02in 0 0.06in 0; padding: 0; list-style: none; }
.resume-print li { margin: 0.02in 0; padding-left: 0.18in; text-indent: -0.18in; }
.resume-print li::before { content: "• "; font-weight: 700; }
.resume-print strong { font-weight: 700; }
.resume-print em { font-style: italic; }
@media print {
  @page { size: Letter; margin: 0.4in 0.5in; }
  body { background: white !important; color: black !important; }
  .resume-no-print { display: none !important; }
  .resume-print { padding: 0; max-width: none; }
}
`;

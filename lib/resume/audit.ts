import type { StructuredResume } from "./types";

function add(facts: Set<string>, s: string | undefined | null) {
  if (!s) return;
  const norm = s.trim().toLowerCase();
  if (norm.length >= 3) facts.add(norm);
}

function collectFacts(r: StructuredResume): Set<string> {
  const facts = new Set<string>();
  add(facts, r.contact.name);
  add(facts, r.contact.email);
  add(facts, r.contact.phone);
  add(facts, r.contact.city);
  add(facts, r.contact.links?.linkedin);
  add(facts, r.contact.links?.github);
  add(facts, r.contact.links?.website);
  add(facts, r.summary);
  r.experience.forEach(e => {
    add(facts, e.title); add(facts, e.company); add(facts, e.location);
    add(facts, e.start); add(facts, e.end);
    e.bullets.forEach(b => add(facts, b));
  });
  r.education.forEach(e => {
    add(facts, e.school); add(facts, e.degree); add(facts, e.field);
    add(facts, e.start); add(facts, e.end); add(facts, e.honors);
  });
  r.skills.forEach(g => {
    add(facts, g.category); g.items.forEach(it => add(facts, it));
  });
  r.certifications.forEach(c => {
    add(facts, c.name); add(facts, c.issuer); add(facts, c.date); add(facts, c.id);
  });
  r.clearances.forEach(c => {
    add(facts, c.level); add(facts, c.status); add(facts, c.type); add(facts, c.granted_date);
  });
  return facts;
}

const factPatterns: RegExp[] = [
  /\b\d+\+?\s*years?\b/gi,
  /\b\d+(?:\.\d+)?\s*%/g,
  /\$\d+(?:\.\d+)?\s*[KkMmBb]?\+?\b/g,
  /\b(?:19|20)\d{2}\s*[-–]\s*(?:(?:19|20)\d{2}|Present)\b/g,
  /\b[A-Z]{3,6}\+?\b/g,
];

export type AuditResult = {
  flagged: string[];
  total_specific_claims: number;
};

function matchesAnyFact(claim: string, facts: Set<string>): boolean {
  const norm = claim.toLowerCase().trim();
  for (const fact of facts) {
    if (fact.includes(norm) || norm.includes(fact)) return true;
  }
  return false;
}

const ATS_KEYWORD_ALLOWLIST = new Set([
  "summary","experience","skills","certifications","clearances","education",
  "present","ats","rich","tech","randy","cleared","cert","aws","sci",
]);

export function auditGeneration(generated_markdown: string, source: StructuredResume): AuditResult {
  const facts = collectFacts(source);
  const flagged: string[] = [];
  let total = 0;
  const seen = new Set<string>();

  for (const pat of factPatterns) {
    for (const m of generated_markdown.matchAll(pat)) {
      const claim = m[0];
      const norm = claim.toLowerCase().trim();
      if (seen.has(norm)) continue;
      seen.add(norm);
      if (ATS_KEYWORD_ALLOWLIST.has(norm)) continue;
      total++;
      if (!matchesAnyFact(claim, facts)) flagged.push(claim);
    }
  }
  return { flagged, total_specific_claims: total };
}

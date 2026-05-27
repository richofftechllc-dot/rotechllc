const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const HTML_PATH = path.join(ROOT, '..', 'rot-quiz', 'index.html');
const DATA_OUT = path.join(ROOT, 'lib', 'quizData.ts');

if (!fs.existsSync(HTML_PATH)) { console.error('rot-quiz/index.html not found'); process.exit(1); }
const html = fs.readFileSync(HTML_PATH, 'utf-8');
const scripts = [...html.matchAll(/<script(?![^>]*type=["']module["'])[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const src = scripts.find(s => s.includes('"sp1"') && s.includes('questions'));
if (!src) { console.error('Data script not found'); process.exit(1); }

function matchBracket(text, startIdx, open, close) {
  let depth = 0, inStr = null;
  for (let i = startIdx; i < text.length; i++) {
    const c = text[i], p = i > 0 ? text[i-1] : '';
    if (inStr) { if (c === inStr && p !== '\\') inStr = null; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === open) depth++;
    else if (c === close) { depth--; if (depth === 0) return i; }
  }
  return -1;
}
function findOpening(text, fromIdx, ch) {
  for (let i = fromIdx; i >= 0; i--) if (text[i] === ch) return i;
  return -1;
}

const markers = [...src.matchAll(/id:"(sp|csa|ai)\d+"/g)];
console.log(`Found ${markers.length} domain markers`);
const domains = [];
const seen = new Set();
for (const m of markers) {
  const objStart = findOpening(src, m.index, '{');
  if (objStart < 0) continue;
  const objEnd = matchBracket(src, objStart, '{', '}');
  if (objEnd < 0) continue;
  try {
    const d = eval('(' + src.slice(objStart, objEnd + 1) + ')');
    if (d && d.id && Array.isArray(d.questions) && !seen.has(d.id)) {
      domains.push(d); seen.add(d.id);
    }
  } catch (e) { console.warn(`Parse fail at ${m.index}:`, e.message); }
}
console.log(`Extracted ${domains.length} unique domains`);

const TRACK_NAMES = { sp: 'Security+', csa: 'ServiceNow CSA', ai: 'AWS AI Practitioner' };
const trackMap = {};
domains.forEach(d => {
  const p = d.id.match(/^([a-z]+)/)[1];
  if (!trackMap[p]) trackMap[p] = { id: p, name: TRACK_NAMES[p] || p, domains: [] };
  trackMap[p].domains.push(d);
});
const tracks = Object.values(trackMap).map(t => ({ ...t, domains: t.domains.sort((a,b) => a.id.localeCompare(b.id, 'en', {numeric:true})) }));
tracks.forEach(t => console.log(`  ${t.id}: ${t.domains.length}d / ${t.domains.reduce((s,d)=>s+d.questions.length,0)}q`));

const csa3Idx = src.indexOf('csa3:');
let lessons = {};
if (csa3Idx >= 0) {
  const objStart = findOpening(src, csa3Idx, '{');
  const objEnd = matchBracket(src, objStart, '{', '}');
  if (objStart >= 0 && objEnd >= 0) {
    try { lessons = eval('(' + src.slice(objStart, objEnd + 1) + ')'); }
    catch (e) { console.warn('Lessons eval failed:', e.message); }
  }
}
console.log('Lessons:', Object.keys(lessons).length);

// DUMP OLD PROGRESS FUNCTIONS (for schema mirror)
function findFn(src, name) {
  const patterns = [
    new RegExp(`(?:async\\s+)?function\\s+${name}\\s*\\(`),
    new RegExp(`(?:const|let|var)\\s+${name}\\s*=\\s*(?:async\\s+)?function`),
    new RegExp(`(?:const|let|var)\\s+${name}\\s*=\\s*(?:async\\s+)?\\(`),
    new RegExp(`${name}\\s*:\\s*(?:async\\s+)?function`),
  ];
  for (const p of patterns) {
    const m = p.exec(src);
    if (!m) continue;
    const braceIdx = src.indexOf('{', m.index);
    if (braceIdx < 0) continue;
    const endIdx = matchBracket(src, braceIdx, '{', '}');
    if (endIdx < 0) continue;
    return src.slice(m.index, endIdx + 1);
  }
  return null;
}
console.log('\n========== OLD saveProgressToFirebase ==========');
console.log(findFn(src, 'saveProgressToFirebase') || '(not found)');
console.log('\n========== OLD loadProgressFromFirebase ==========');
console.log(findFn(src, 'loadProgressFromFirebase') || '(not found)');
console.log('========== END FUNCTION DUMP ==========\n');

const ts = `// Auto-generated from rot-quiz/index.html. Regenerate: node scripts/extract-quiz-data.js
export type Question = { q: string; options: string[]; answer: number; exp: string };
export type Domain = { id: string; name: string; questions: Question[] };
export type Track = { id: string; name: string; domains: Domain[] };

export const TRACKS: Track[] = ${JSON.stringify(tracks, null, 2)};

export const LESSONS: Record<string, string> = ${JSON.stringify(lessons, null, 2)};
`;
fs.mkdirSync(path.dirname(DATA_OUT), { recursive: true });
fs.writeFileSync(DATA_OUT, ts);
console.log(`Wrote ${DATA_OUT} (${(ts.length/1024).toFixed(1)}KB)`);

execSync('git add -A', { stdio: 'inherit', cwd: ROOT });
execSync('git commit -m "feat: quiz v3 - all domains, track filter, lessons, live Bo Tech, Firestore progress"', { stdio: 'inherit', cwd: ROOT });
execSync('git push', { stdio: 'inherit', cwd: ROOT });
console.log('DONE');

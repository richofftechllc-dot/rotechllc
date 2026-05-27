const fs = require('fs');
const path = require('path');
const vm = require('vm');

const HTML_PATH = path.join(__dirname, '..', '..', 'rot-quiz', 'index.html');
const OUT_PATH = path.join(__dirname, '..', 'lib', 'quizData.ts');

if (!fs.existsSync(HTML_PATH)) { console.error('rot-quiz/index.html not found at', HTML_PATH); process.exit(1); }
const html = fs.readFileSync(HTML_PATH, 'utf-8');

const scripts = [...html.matchAll(/<script(?![^>]*type=["']module["'])[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const dataScript = scripts.find(s => s.includes('"sp1"') && s.includes('questions'));
if (!dataScript) { console.error('Data script not found'); process.exit(1); }

const sandbox = {
  window: {}, document: { getElementById:()=>null, querySelector:()=>null, querySelectorAll:()=>[], addEventListener:()=>{}, createElement:()=>({classList:{add:()=>{},remove:()=>{}},style:{}}), body:{appendChild:()=>{}}, documentElement:{setAttribute:()=>{}}, cookie:'' },
  console: { log:()=>{}, error:()=>{}, warn:()=>{} },
  setTimeout:()=>0, clearTimeout:()=>{}, setInterval:()=>0, clearInterval:()=>{},
  alert:()=>{}, confirm:()=>true, prompt:()=>null,
  fetch:()=>Promise.resolve({ok:true,json:()=>Promise.resolve({})}),
  localStorage:{getItem:()=>null,setItem:()=>{},removeItem:()=>{},clear:()=>{}},
  sessionStorage:{getItem:()=>null,setItem:()=>{},removeItem:()=>{},clear:()=>{}},
  location:{href:'',pathname:'/',search:''}, navigator:{userAgent:'node'},
  btoa:(s)=>Buffer.from(s).toString('base64'), atob:(s)=>Buffer.from(s,'base64').toString('utf-8'),
};
sandbox.global = sandbox; sandbox.globalThis = sandbox; sandbox.window.document = sandbox.document;
vm.createContext(sandbox);
try { vm.runInContext(dataScript, sandbox, { timeout: 10000 }); } catch (e) { console.warn('Script partial:', e.message); }

const reserved = ['window','document','console','setTimeout','clearTimeout','setInterval','clearInterval','alert','confirm','prompt','fetch','localStorage','sessionStorage','location','navigator','btoa','atob','global','globalThis'];
const userKeys = Object.keys(sandbox).filter(k => !reserved.includes(k));
console.log('User-defined keys:', userKeys);

let tracks = null;
const nestedKey = userKeys.find(k => { const v=sandbox[k]; return Array.isArray(v) && v.some(t=>t&&Array.isArray(t.domains)); });
if (nestedKey) {
  tracks = sandbox[nestedKey];
  console.log('Found nested structure in:', nestedKey);
} else {
  const flatKey = userKeys.find(k => { const v=sandbox[k]; return Array.isArray(v) && v.some(d=>d&&d.id&&/^(sp|csa|ai)\d+$/.test(d.id)&&Array.isArray(d.questions)); });
  if (flatKey) {
    console.log('Found flat structure in:', flatKey);
    const flat = sandbox[flatKey];
    const map = {};
    flat.forEach(d => { const p = d.id.match(/^([a-z]+)/)[1]; if(!map[p]) map[p]={id:p,name:'',domains:[]}; map[p].domains.push(d); });
    const names = { sp: 'Security+', csa: 'ServiceNow CSA', ai: 'AWS AI Practitioner' };
    tracks = Object.values(map).map(t => ({ ...t, name: names[t.id] || t.id }));
  }
}
if (!tracks) { console.error('No tracks/domains array found. Keys:', userKeys); process.exit(1); }

const lessonsKey = userKeys.find(k => { const v=sandbox[k]; return typeof v==='object'&&!Array.isArray(v)&&v!==null&&Object.keys(v).some(id=>/^(sp|csa|ai)\d+$/.test(id)&&typeof v[id]==='string'&&v[id].length>200); });
const lessons = lessonsKey ? sandbox[lessonsKey] : {};
console.log('Tracks:', tracks.map(t=>`${t.id}(${t.domains.length})`).join(', '));
console.log('Lessons:', Object.keys(lessons).length);

const ts = `// Auto-generated from rot-quiz/index.html. Regenerate: node scripts/extract-quiz-data.js
export type Question = { q: string; options: string[]; answer: number; exp: string };
export type Domain = { id: string; name: string; questions: Question[] };
export type Track = { id: string; name: string; domains: Domain[] };

export const TRACKS: Track[] = ${JSON.stringify(tracks, null, 2)};

export const LESSONS: Record<string, string> = ${JSON.stringify(lessons, null, 2)};
`;
fs.writeFileSync(OUT_PATH, ts);
console.log(`Wrote ${OUT_PATH} (${(ts.length/1024).toFixed(1)}KB)`);

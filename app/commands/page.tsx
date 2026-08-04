const cmds = [
  { cmd: "!quiz", desc: "Your personal quiz link (Security+, CSA, AWS AI)" },
  { cmd: "!progress", desc: "See your quiz progress" },
  { cmd: "!learn", desc: "Guided lessons with Flo (course engine)" },
  { cmd: "!book", desc: "Schedule a 1-on-1 with a coach" },
  { cmd: "!consult", desc: "Free 30-min strategy call" },
  { cmd: "!resources", desc: "Study guides + resources" },
  { cmd: "!salary", desc: "Salary intel by role / clearance" },
  { cmd: "!help", desc: "Full list of commands" },
];

export default function Commands() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-5xl md:text-7xl font-black text-center mb-4">Bo Tech Commands.</h1>
      <p className="text-rot-muted text-center mb-16">Drop these in Discord to use the bot.</p>
      <div className="space-y-3">
        {cmds.map(c => (
          <div key={c.cmd} className="bg-rot-surface border border-rot-line rounded-xl p-5 flex items-center gap-6">
            <code className="text-rot-accent font-mono font-bold text-lg w-32">{c.cmd}</code>
            <span className="text-rot-muted">{c.desc}</span>
          </div>
        ))}
      </div>
    </main>
  );
}

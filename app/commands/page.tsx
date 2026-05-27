const cmds = [
  { cmd: "!start", desc: "Unlock everything after joining" },
  { cmd: "!quiz", desc: "Get your personal quiz link" },
  { cmd: "!book", desc: "Schedule a 1-on-1 with Bo" },
  { cmd: "!consult", desc: "Free 30-min strategy call" },
  { cmd: "!payment", desc: "Get the Founding Member payment link" },
  { cmd: "!progress", desc: "See your quiz progress" },
  { cmd: "!leaderboard", desc: "Top quiz scores this month" },
  { cmd: "!help", desc: "Full list of commands" },
];

export default function Commands() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-5xl md:text-7xl font-black text-center mb-4">Bo Tech Commands.</h1>
      <p className="text-gray-400 text-center mb-16">Drop these in Discord to use the bot.</p>
      <div className="space-y-3">
        {cmds.map(c => (
          <div key={c.cmd} className="bg-zinc-900 border border-white/10 rounded-xl p-5 flex items-center gap-6">
            <code className="text-orange-500 font-mono font-bold text-lg w-32">{c.cmd}</code>
            <span className="text-gray-300">{c.desc}</span>
          </div>
        ))}
      </div>
    </main>
  );
}

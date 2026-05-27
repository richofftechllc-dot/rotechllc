export default function Roster() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-5xl md:text-7xl font-black text-center mb-4">The Community.</h1>
      <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">Real people. Real moves. Cleared and aspiring tech professionals locked in on the same path.</p>
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-12 text-center">
        <p className="text-gray-400 mb-6">Member roster loading from Firebase soon.</p>
        <p className="text-gray-500 text-sm">For now, join the Discord to meet everyone live.</p>
        <a href="https://discord.gg/3gFdWYtPB" target="_blank" rel="noopener" className="inline-block mt-8 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 font-bold rounded-lg">Join Discord</a>
      </div>
    </main>
  );
}

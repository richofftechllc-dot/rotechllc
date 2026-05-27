import Image from "next/image";

export default function Welcome() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-center">
      <div className="flex justify-center mb-8">
        <Image src="/bo-avatar.png" alt="Bo" width={120} height={120} className="rounded-full" />
      </div>
      <div className="text-orange-500 font-bold tracking-widest text-sm mb-4">PAYMENT CONFIRMED</div>
      <h1 className="text-5xl md:text-6xl font-black mb-6">You're in.</h1>
      <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">
        Founding Member access locked for 12 months. Here's exactly what to do next — takes 60 seconds.
      </p>
      <div className="space-y-6 text-left">
        <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
          <div className="text-orange-500 font-bold text-sm mb-2">STEP 1</div>
          <h2 className="text-xl font-bold mb-3">Join the Discord</h2>
          <p className="text-gray-400 mb-4">This is where everything happens — coaching, calls, quizzes, jobs, the community.</p>
          <a href="https://discord.gg/3gFdWYtPB" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg">Join Discord</a>
        </div>
        <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
          <div className="text-orange-500 font-bold text-sm mb-2">STEP 2</div>
          <h2 className="text-xl font-bold mb-3">Watch for Your Access Code</h2>
          <p className="text-gray-400">Within minutes you get an email + Discord DM with your personal access code (format: <code className="text-orange-500 font-mono">FIRSTNAME2026</code>). That unlocks the web quiz, your roster profile, and the full platform.</p>
        </div>
        <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
          <div className="text-orange-500 font-bold text-sm mb-2">STEP 3</div>
          <h2 className="text-xl font-bold mb-3">Type <code className="text-orange-500 font-mono">!start</code> in Discord</h2>
          <p className="text-gray-400">That kicks off your intake and unlocks everything: your quiz link, cert track, and a free 30-min 1-on-1 with Bo.</p>
        </div>
      </div>
      <div className="mt-12 text-gray-500 text-sm">Issues? DM Randy on Discord or email <a href="mailto:richofftechllc@gmail.com" className="text-orange-500">richofftechllc@gmail.com</a></div>
    </main>
  );
}

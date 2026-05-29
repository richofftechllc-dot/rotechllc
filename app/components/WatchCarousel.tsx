type Short = { id: string; title: string };

const SHORTS: Short[] = [
  { id: "_Hx5aki1flk", title: "IT Career Transition: Security+ Certified" },
  { id: "MRBc1ohfKHE", title: "Hiring Manager Secrets: Get Hired FAST" },
  { id: "yLx_FvNBjUY", title: "Ace Your IT Interview: AD & VPNs" },
  { id: "cvfo57Xt38g", title: "From Helpdesk to Senior Tech in 1 Year" },
  { id: "E52dk3XPCgA", title: "From 1 to 4 Remote Tech Roles in Months" },
  { id: "fjHItjHUaK8", title: "Unlock Your Confidence: Interview Takeaway" },
  { id: "h3gs9Y3JKZ0", title: "Tech Interview Prep: Bad to Better" },
  { id: "VBLOtWXLOPM", title: "Interview Gone Wrong? A Pentagon Story" },
  { id: "YRFggOeofXI", title: "Community Connection: Hiring Manager Revealed" },
  { id: "cvkbO2pcAeY", title: "ServiceNow Transforms Government IT" },
  { id: "D_BkSUl6Sx0", title: "ServiceNow: Easy Career Switch" },
  { id: "-VRpEYbnNSU", title: "Escalating Tickets Beyond Your Scope" },
  { id: "DahOfd3YIlQ", title: "Trump Funds AI Training for Government Staff" },
  { id: "njukAeXRGfE", title: "TS Clearance Job Fair · 757 VA" },
  { id: "rACr0JPOYt0", title: "AI Study Buddy That Keeps It Real" },
];

export default function WatchCarousel() {
  return (
    <section className="bg-zinc-950 py-20 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="text-orange-500 font-bold tracking-widest text-sm mb-3">WATCH THE PLAYBOOK</div>
            <h2 className="text-4xl md:text-5xl font-black">Real moves, on camera.</h2>
            <p className="text-gray-400 max-w-xl mt-3">
              Career strategy, interview tactics, cleared-tech intel — straight from Bo&apos;s feed. Pull anything that helps; the rest is on YouTube.
            </p>
          </div>
          <a
            href="https://www.youtube.com/@RichOffTechLLc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 font-bold tracking-widest text-xs uppercase hover:text-orange-300"
          >
            Latest on YouTube ↗
          </a>
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 [scrollbar-color:rgba(249,115,22,0.5)_transparent]">
          {SHORTS.map((s) => (
            <div key={s.id} className="snap-start shrink-0 w-[260px] md:w-[280px]">
              <div className="aspect-[9/16] rounded-xl overflow-hidden bg-black border border-white/10">
                <iframe
                  src={`https://www.youtube.com/embed/${s.id}?rel=0`}
                  title={s.title}
                  className="w-full h-full"
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="text-gray-300 text-sm font-bold mt-3 line-clamp-2">{s.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Edit3, Clock, Tag } from "lucide-react";
import BentoCard from "./bentocard";

export default function RecentNote() {
  return (
    <BentoCard title="Editor" className="col-span-2 row-span-4 group relative">
      {/* header */}
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Physics Project
          </h2>
          <div className="flex items-center gap-3 mt-2 text-xs font-medium text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <Clock size={12} /> 2m ago
            </span>
            <span className="flex items-center gap-1 text-indigo-400">
              <Tag size={12} /> Research
            </span>
          </div>
        </div>
        <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
          <Edit3 size={18} className="text-white/70" />
        </button>
      </div>

      {/* note content preview (trying to copy Editor.js look lol) */}
      <div className="space-y-4 opacity-80 font-serif text-lg leading-relaxed text-slate-200 mask-image-b">
        <p>
          <span className="font-sans text-sm font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Introduction
          </span>
          Lorem ipsum dolar or whatever that is XDDD{" "}
          <span className="bg-indigo-500/20 text-indigo-200 px-1 rounded">
            Newton's Cradle
          </span>{" "}
          setup simulated in a vacuum environment.
        </p>

        <div className="pl-4 border-l-2 border-indigo-500/50 italic text-slate-400">
          "no way another dummy text"
        </div>

        <p>Ts lowkenuinely frying me hmmmm sensible.</p>

        {/* code block look */}
        <div className="bg-[#0f0f12]/50 p-4 rounded-lg font-mono text-sm text-green-400 border border-white/5 mt-4">
          KE = 0.5 * m * v^2
          <br />p = m * v
        </div>
      </div>

      {/* fade out effect at the bottom idk how */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0f0f12]/40 to-transparent pointer-events-none" />
    </BentoCard>
  );
}

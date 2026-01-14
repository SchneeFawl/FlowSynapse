import { useState } from "react";
import "./App.css";
import Sidebar from "./components/sidebar";
import BentoCard from "./components/bentocard";
import VerticalClock from "./components/verticalclock";
import RecentNote from "./components/recentnote"; // Import the new component
import { Activity, Play, Pause } from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div
      className="relative w-screen h-screen bg-cover bg-center overflow-hidden font-sans select-none text-slate-200"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=2074&auto=format&fit=crop')",
      }}
    >
      {/* low brightness bg */}
      <div className="absolute inset-0 bg-[#0B0A0A]/60 backdrop-blur-[2px]" />

      {/* main layout */}
      <div className="relative z-10 flex w-full h-full">
        {/* sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* dashboard space (grid) */}
        <div className="flex-1 h-full p-4 overflow-hidden">
          {/* new grid layout:
              cols: [300px fixed] [140px fixed] [rest of the space]
              rows: [1fr] [1fr] [110px fixed bottom] */}
          <div className="grid grid-cols-[300px_140px_1fr] grid-rows-[1fr_1fr_110px] gap-4 w-full h-full">
            {/* - Left Column - */}
            {/* top left - Wellness */}
            <BentoCard
              title="Wellness"
              className="col-start-1 col-end-2 row-start-1 row-end-2 flex flex-col items-center justify-center
                bg-emerald-500/5 border-emerald-500/20"
            >
              <div className="relative size-28 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
                <div
                  className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin-slow"
                  style={{ animationDuration: "3s" }}
                ></div>
                <div className="text-3xl font-bold text-white">88%</div>
              </div>
              <div className="mt-4 text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} /> Energy High
              </div>
            </BentoCard>

            {/* bottom left - To-Do list */
            /* row-span-2 - takes up bottom 40% of height */}
            <BentoCard
              title="Quick Tasks"
              className="col-start-1 col-end-2 row-start-2 row-end-3 bg-purple-500/5 border-purple-500/20"
            >
              <div className="flex flex-col gap-3 h-full justify-center">
                {[
                  {
                    id: 1,
                    text: "Review Physics Formulas",
                    color: "bg-purple-400",
                  },
                  { id: 2, text: "Submit History Essay", color: "bg-blue-400" },
                  { id: 3, text: "Call Project Partner", color: "bg-pink-400" },
                ].map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className={`size-2 rounded-full ${task.color}`} />
                    <span className="text-sm font-medium opacity-80 truncate">
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>
            </BentoCard>

            {/* - Middle Col - */
            /* vertical clock */}
            <BentoCard className="col-start-2 col-end-3 row-start-1 row-end-3 bg-blue-500/5 border-blue-500/20">
              <VerticalClock />
            </BentoCard>

            {/* - Right Col - */
            /* RecentNote */}
            <RecentNote className="col-start-3 col-end-4 row-start-1 row-end-3 bg-orange-500/5 border-orange-500/10" />

            {/* - Bottom Row - */}
            {/* StepAhead timer (focus) */}
            {/* col-span-4 to span the entire width of the grid*/}
            <BentoCard
              className="col-span-3 row-start-3 row-end-4 flex items-center justify-between px-8 bg-orange-500/5
              border-orange-500/20"
            >
              {/* title of StepAhead */}
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-bold text-white tracking-wide">
                  StepAhead Focus
                </h3>
                <p className="text-xs text-orange-300/60 uppercase tracking-widest mt-1">
                  Session Active
                </p>
              </div>

              {/* controls and visualizr */}
              <div className="flex items-center gap-6 h-full">
                {/* visualizer */}
                <div className="flex gap-1 items-end h-8 opacity-60">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-orange-500 rounded-t-sm animate-pulse"
                      style={{
                        height: `${30 + Math.random() * 70}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>

                {/* divider line */}
                <div className="h-8 w-px bg-white/10 mx-2" />

                {/* timer */}
                <div className="text-4xl font-mono font-bold text-white/90 tracking-tight">
                  14:32
                </div>

                {/* resume button*/}
                <button className="flex items-center gap-3 pl-4 pr-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold transition-all hover:scale-105 shadow-lg shadow-orange-500/20 group ml-4">
                  <div className="p-1 rounded bg-white/20 group-hover:bg-white/30 transition-colors">
                    <Play size={12} fill="currentColor" />
                  </div>
                  <span className="uppercase tracking-wider text-[10px]">
                    Resume
                  </span>
                </button>
              </div>
            </BentoCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

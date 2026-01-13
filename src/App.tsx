import { useState } from "react";
import "./App.css";
import Sidebar from "./components/sidebar";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div // layer-1: bg image div
      className="relative w-screen h-screen bg-cover bg-center overflow-hidden font-sans select-none"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=2074&auto=format&fit=crop')",
      }}
    >
      {/* layer-2: brightness reduce*/}
      <div className="absolute inset-0 bg-[#050505]/60 backdrop-blur-[2px]" />

      {/* layer-3: content, side bar + bento grid here */}
      <div className="relative z-10 flex w-full h-full">
        {/* sidebar itself */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* remaining workspace area */}
        <div className="flex-1 h-full p-4 overflow-hidden">
          {/* placeholder for dashboard grid*/}
          <div
            className="w-full h-full rounded-2xl flex items-center
            justify-center"
          ></div>
        </div>

        {/* placeholder to verify it works */}
        <div className="flex flex-col items-center justify-center w-full h-full">
          <h1
            className="text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br
            from-white to-white/35"
          >
            FlowSynapse
          </h1>
          <p className="mt-4 text-white/50 uppercase tracking-widest text-sm">
            Under Construction!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

import './App.css'

function App() {
  return (
    <div // layer-1: bg image div
      className="relative w-screen h-screen bg-cover bg-center overflow-hidden font-sans select-none"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=2074&auto=format&fit=crop')" 
      }}
    >
      {/* layer-2: brightness reduce*/}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />

      {/* layer-3: content, side bar + bento grid here */}
      <div className="relative z-10 flex w-full h-full text-slate-200">
        
        {/* placeholder to verify it works */}
        <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/35">
              FlowSynapse
            </h1>
            <p className="mt-4 text-white/50 uppercase tracking-widest text-sm">
              Under Construction!
            </p>
        </div>

      </div>
    </div>
  )
}

export default App

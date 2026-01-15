import { Minus, Square, X } from "lucide-react";

interface TitleBarProps {
  pageTitle?: string;
}

export default function TitleBar({ pageTitle = "Dashboard" }: TitleBarProps) {
  // IPC caller:
  const getIpcRenderer = () => {
    if ((window as any).ipcRenderer) return (window as any).ipcRenderer;
    if ((window as any).require)
      return (window as any).require("electron").ipcRenderer;
    return null;
  };

  const handleMinimize = () => getIpcRenderer()?.send("minimize-window");
  const handleMaximize = () => getIpcRenderer()?.send("maximize-window");
  const handleClose = () => getIpcRenderer()?.send("close-window");

  return (
    <div className="h-6 bg-[#0B0A0A] flex items-center justify-between select-none z-50 border-b border-white/5">
      {/* Draggable Title Area */}
      <div className="flex-1 h-full drag-region flex items-center pl-2 gap-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest opacity-60">
          FlowSynapse <span className="mx-2 opacity-30 text-white">/</span>{" "}
          {pageTitle}
        </span>
      </div>

      {/* weindow controls (no dragging) */}
      <div className="flex h-full no-drag">
        {/* minimize */}
        <button
          onClick={handleMinimize}
          className="w-8 h-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5
          transition-colors group"
        >
          <Minus size={13} strokeWidth={1.5} />
        </button>

        {/* maximize */}
        <button
          onClick={handleMaximize}
          className="w-8 h-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5
          transition-colors group"
        >
          <Square size={11} strokeWidth={1.5} />
        </button>

        {/* close */}
        <button
          onClick={handleClose}
          className="w-8 h-full flex items-center justify-center text-slate-400 hover:text-white
          hover:bg-red-500/80 transition-all group"
        >
          <X size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

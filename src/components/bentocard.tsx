import { ReactNode } from "react";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export default function BentoCard({
  children,
  className = "",
  title,
}: BentoCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl 
                  bg-[#0f0f12]/60 backdrop-blur-2xl 
                  border border-white/5 shadow-xl 
                  transition-all duration-300 hover:border-white/10 ${className}`}
    >
      {/* subtle gradient border at top*/}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

      {/* card title (might remove this one) */}
      {title && (
        <div className="absolute top-5 left-6 text-[10px] font-bold text-slate-400/60 uppercase tracking-[0.2em] select-none z-20">
          {title}
        </div>
      )}

      {/* content area */}
      {/* p-6 for comfortable internal padding */}
      <div className="h-full w-full p-6">{children}</div>
    </div>
  );
}

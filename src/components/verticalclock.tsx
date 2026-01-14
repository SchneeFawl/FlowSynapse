import { useState, useEffect } from "react";

const VerticalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, "0");
  const mins = time.getMinutes().toString().padStart(2, "0");
  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col items-center justify-center h-full font-mono text-white select-none">
      <div className="text-8xl font-bold leading-none tracking-tighter flex flex-col items-center">
        <span>
          {hours[0]}
          {hours[1]}
        </span>
        <span className="animate-pulse opacity-50 my-[-10px]">:</span>
        <span>
          {mins[0]}
          {mins[1]}
        </span>
      </div>
      <div className="mt-4 text-xs uppercase tracking-[0.3em] opacity-60 text-center">
        {dateStr}
      </div>
    </div>
  );
};

export default VerticalClock;

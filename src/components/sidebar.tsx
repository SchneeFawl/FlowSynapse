import { LayoutDashboard, FileText, ListTodo } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const icons = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dash" },
    { id: "notes", icon: FileText, label: "Notes" },
    { id: "todo", icon: ListTodo, label: "To-Do List" },
  ];

  return (
    <div
      className="drag-region flex flex-col items-center justify-between py-6 w-20 min-w h-[calc(100%-1rem)]
                  my-3 ml-3 bg-[#0f0f12]/67 backdrop-blur-xl rounded-2xl border-2 border-indigo-500/30 
                  shadow-2xl z-50 transition-all duration-300"
    >
      {/* logo */}
      <div className="flex flex-col items-center gap-1 mb-8 select-none">
        <div className="size-10 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
          FS
        </div>
      </div>

      {/* icons */}
      <div className="flex-1 flex flex-col gap-6 w-full items-center justify-center">
        {icons.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`no-drag group relative p-[15%] rounded-xl transition-all duration-300 ease-out
                ${
                  isActive
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/40 scale-110"
                    : "text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
            >
              <item.icon
                className="w-full h-full"
                strokeWidth={isActive ? 2.5 : 2}
              />

              <span
                className="absolute left-14 bg-[#1e1e2e] text-indigo-300 text-[10px] font-bold px-2 py-1
                rounded opacity-0 group-hover:opacity-100 transition-opacity border border-indigo-500/30
                whitespace-nowrap pointer-events-none tracking-wider uppercase z-50 top-1/2 -translate-y-1/2
                group-hover:delay-1700"
              >
                {/* delay-1700 = 1700ms delay */}
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

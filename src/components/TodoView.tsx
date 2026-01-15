import { useState } from "react";
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  ListTodo,
  Calendar,
  Tag,
} from "lucide-react";

// - Types -
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  category: string; // "General", "School", "Project", etc.
}

const CATEGORIES = ["All Tasks", "School", "Personal", "Project"];

export default function TodoView() {
  // - State -
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("flowsynapse-todos");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            text: "Review Physics Chapter 4",
            completed: false,
            category: "School",
          },
          {
            id: 2,
            text: "Buy groceries",
            completed: true,
            category: "Personal",
          },
        ];
  });

  const [inputText, setInputText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Tasks");
  const [activeFilter, setActiveFilter] = useState("All Tasks"); // for sidebar selection

  // - Actions -
  // 1. add todo
  const handleAddTodo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputText,
      completed: false,
      // default to "General" if "All Tasks" is selected otherwise use the active filter
      category: activeFilter === "All Tasks" ? "General" : activeFilter,
    };

    const updated = [...todos, newTodo];
    setTodos(updated);
    localStorage.setItem("flowsynapse-todos", JSON.stringify(updated));
    setInputText("");
  };

  // 2. toggle complete
  const toggleTodo = (id: number) => {
    const updated = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos(updated);
    localStorage.setItem("flowsynapse-todos", JSON.stringify(updated));
  };

  // 3. delete todo
  const deleteTodo = (id: number) => {
    const updated = todos.filter((t) => t.id !== id);
    setTodos(updated);
    localStorage.setItem("flowsynapse-todos", JSON.stringify(updated));
  };

  // - Filtering -
  const filteredTodos = todos.filter((t) => {
    if (activeFilter === "All Tasks") return true;
    return t.category === activeFilter;
  });

  // calculate stats
  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="flex w-full h-full gap-4">
      {/* - Sidebar (categories) - */}
      <div className="w-1/4 h-full flex flex-col gap-4 min-w-55">
        {/* header card */}
        <div className="bg-[#0f0f12]/60 border border-white/5 rounded-3xl p-6 backdrop-blur-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
              <ListTodo size={20} />
            </div>
            <h2 className="font-bold text-white text-lg">My Tasks</h2>
          </div>
          <p className="text-xs text-slate-400 font-medium ml-1">
            You have <span className="text-white font-bold">{activeCount}</span>{" "}
            pending tasks
          </p>
        </div>

        {/* categories list */}
        <div className="flex-1 bg-[#0f0f12]/60 backdrop-blur-2xl rounded-3xl border border-white/8 overflow-hidden p-2">
          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-sm font-medium transition-all
                  ${
                    activeFilter === cat
                      ? "bg-white/10 text-white shadow-md"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
              >
                <span className="flex items-center gap-2">
                  {cat === "All Tasks" ? (
                    <ListTodo size={14} />
                  ) : (
                    <Tag size={14} />
                  )}
                  {cat}
                </span>
                {/* count badge */}
                <span
                  className={`text-[10px] py-0.5 px-2 rounded-full 
                  ${activeFilter === cat ? "bg-white/20" : "bg-white/5"}`}
                >
                  {cat === "All Tasks"
                    ? todos.length
                    : todos.filter((t) => t.category === cat).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* - Main Task Area - */}
      <div
        className="flex-1 h-full bg-[#0f0f12]/60 backdrop-blur-2xl rounded-3xl border border-white/5
        overflow-hidden flex flex-col relative"
      >
        {/* top input bar */}
        <div className="p-6 border-b border-white/5">
          <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">
            {activeFilter}
          </div>

          <form onSubmit={handleAddTodo} className="flex gap-3">
            <div
              className="flex-1 flex items-center gap-3 bg-[#0f0f12] border border-white/10 rounded-xl
                px-4 py-3 transition-colors focus-within:border-indigo-500/50"
            >
              <Plus size={18} className="text-slate-500" />
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Add a new task in ${
                  activeFilter === "All Tasks" ? "General" : activeFilter
                }...`}
                className="bg-transparent border-none outline-none text-sm text-white w-full
                    placeholder:text-slate-600"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl
                transition-all shadow-lg shadow-indigo-500/20 active:scale-95 hover:scale-105"
            >
              Add
            </button>
          </form>
        </div>

        {/* task list */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {filteredTodos.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-60">
              <Calendar size={48} className="mb-4 opacity-50" />
              <p className="text-sm font-medium uppercase tracking-widest">
                No tasks found
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200
                    ${
                      todo.completed
                        ? "bg-white/2 border-transparent opacity-60"
                        : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/8"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    {/* custom checkbox!! */}
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`transition-colors ${
                        todo.completed
                          ? "text-emerald-500"
                          : "text-slate-500 hover:text-indigo-400"
                      }`}
                    >
                      {todo.completed ? (
                        <CheckCircle2 size={22} />
                      ) : (
                        <Circle size={22} />
                      )}
                    </button>

                    {/* text */}
                    <div>
                      <p
                        className={`text-sm font-medium transition-all ${
                          todo.completed
                            ? "text-slate-500 line-through"
                            : "text-slate-200"
                        }`}
                      >
                        {todo.text}
                      </p>
                      {activeFilter === "All Tasks" && (
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                          {todo.category}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* delete button (visible on hver) */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400
                        hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

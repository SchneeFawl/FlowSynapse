import { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./components/sidebar";
import BentoCard from "./components/bentocard";
import VerticalClock from "./components/verticalclock";
import RecentNote from "./components/recentnote";
import {
  Activity,
  Play,
  Pause,
  TrendingUp,
  RotateCcw,
  Bell,
  X,
} from "lucide-react";
import TitleBar from "./components/TitleBar";
import NotesView from "./components/NotesView";
import TodoView from "./components/TodoView";
import country_side from "./assets/country_side.png";

// import cold_lake from "./assets/cold_lake.png";
// import trees from "./assets/trees.jpg";
// import street from "./assets/japan_street.png";
// import snowy_hut from "./assets/snowy_hut.png";
// import beach from "./assets/beach_side.jpg";

// - Types for Dashboard data (to-do list data) -
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  category: string;
}

// - Types for Dashboard data (NotesView data) -
interface Note {
  id: number;
  title: string;
  date: string;
  preview: string;
}

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // to track which note should be opened when switching tabs
  const [targetNoteId, setTargetNoteId] = useState<number | null>(null);

  // - Dashboard Data States -
  const [recentTodos, setRecentTodos] = useState<Todo[]>([]);
  const [recentNote, setRecentNote] = useState<Note | null>(null);

  // handler for the edit button in dashboard
  const handleEditNote = (id: number) => {
    setTargetNoteId(id); // Set the note we want to edit
    setActiveTab("notes"); // Switch to the notes tab
  };

  // refresh dashboard data (to-dos & notes)
  useEffect(() => {
    if (activeTab === "dashboard") {
      // fetch to-dos
      const savedTodos = localStorage.getItem("flowsynapse-todos");
      if (savedTodos) {
        const allTodos: Todo[] = JSON.parse(savedTodos);
        const pending = allTodos.filter((t) => !t.completed).slice(0, 3);
        setRecentTodos(pending);
      }

      // fetch recent note
      const savedNotes = localStorage.getItem("flowsynapse-notes");
      if (savedNotes) {
        const allNotes: Note[] = JSON.parse(savedNotes);
        if (allNotes.length > 0) {
          // we assume the first note in the list is the most relevant/recent
          setRecentNote(allNotes[0]);
        } else {
          setRecentNote(null);
        }
      }
    }
  }, [activeTab]);

  // helper to get color based on category (to-dos)
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "School":
        return "bg-purple-400";
      case "Personal":
        return "bg-blue-400";
      case "Project":
        return "bg-pink-400";
      default:
        return "bg-emerald-400";
    }
  };

  // StepAhead timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // notification state
  const [showNotification, setShowNotification] = useState(false);

  // request notification permission on mount
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // StepAhead timer logic (w/ notifcation)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      // timer finished
      setIsTimerActive(false);

      // trigger system notification
      if (Notification.permission === "granted") {
        new Notification("StepAhead Focus", {
          body: "Session complete! Great job, take a break.",
          silent: false,
        });
      }

      // trigger in-app notification
      setShowNotification(true);

      // auto-hide popup after 10 seconds
      setTimeout(() => setShowNotification(false), 5000);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const toggleTimer = () => setIsTimerActive(!isTimerActive);

  const resetTimer = () => {
    setIsTimerActive(false);
    setTimeLeft(20 * 60);
    setShowNotification(false); // hide notification if reset
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      className="flex flex-col w-screen h-screen bg-cover bg-center overflow-hidden font-sans select-none text-slate-200"
      style={{
        backgroundImage: `url(${country_side})`,
        // "url('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=2074&auto=format&fit=crop')",
      }}
    >
      {/* title bar */}
      <TitleBar pageTitle={activeTab} />

      {/* low brightness bg */}
      <div className="absolute inset-0 bg-[#0B0A0A]/49 backdrop-blur-[1.5px] z-0" />

      {/* in-app StepAhead notification popup */}
      {showNotification && (
        <div className="absolute top-16 right-6 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <div
            className="flex items-start gap-4 p-4 rounded-2xl bg-[#0f0f12]/85 backdrop-blur-xl border
            border-white/10 shadow-2xl w-80"
          >
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400 shrink-0">
              <Bell size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white mb-1">
                Session Complete
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                You've successfully completed your focus session. Time to
                refresh!
              </p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* main layout */}
      <div className="relative z-10 flex flex-1 overflow-hidden w-full ">
        {/* sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* content area */}
        <div className="flex-1 h-full p-4 pb-2 overflow-hidden">
          {/* view-1 Dashboard */}
          {activeTab === "dashboard" && (
            /* new grid layout:
                cols: [340px fixed] [146px fixed] [rest of the space]
                rows: [1fr] [1fr] [110px fixed bottom] */
            <div className="grid grid-cols-[340px_160px_1fr] grid-rows-[1fr_1fr_110px] gap-4 w-full h-full">
              {/* - Left Column - */}
              {/* top left - Wellness */}
              <BentoCard
                title="Wellness"
                className="col-start-1 col-end-2 row-start-1 row-end-2 bg-emerald-500/5 border-emerald-500/20"
              >
                <div className="flex items-center justify-between h-full px-2">
                  {/* left side - spinner */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative size-24 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
                      <div
                        className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin-slow"
                        style={{ animationDuration: "3s" }}
                      ></div>
                      <div className="text-2xl font-bold text-white">88%</div>
                    </div>
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                      <Activity size={10} /> Optimal Energy
                    </div>
                  </div>

                  {/* right side - data */}
                  <div className="flex flex-col items-end justify-center h-full pt-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                        <TrendingUp size={14} />
                      </span>
                      <span className="text-3xl font-bold text-white">
                        +12%
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-medium text-right leading-tight">
                      Recovery Score
                      <br />
                      <span className="opacity-50 text-[10px] uppercase tracking-wide">
                        vs Yesterday
                      </span>
                    </div>

                    {/* bar chart */}
                    <div className="flex gap-1 items-end h-6 mt-4 opacity-50">
                      <div className="w-1.5 h-3 bg-emerald-500/30 rounded-t-sm" />
                      <div className="w-1.5 h-4 bg-emerald-500/50 rounded-t-sm" />
                      <div className="w-1.5 h-2 bg-emerald-500/30 rounded-t-sm" />
                      <div className="w-1.5 h-6 bg-emerald-500 rounded-t-sm" />
                    </div>
                  </div>
                </div>
              </BentoCard>

              {/* bottom left - To-Do list */
              /* row-span-2 - takes up bottom 40% of height */
              /* to-do list */}
              <BentoCard
                title="To-do list"
                className="col-start-1 col-end-2 row-start-2 row-end-3 bg-purple-500/5 border-purple-500/20"
              >
                <div className="flex flex-col gap-3 h-full justify-center">
                  {recentTodos.length === 0 ? (
                    <div className="text-white/30 text-xs text-center">
                      No pending tasks.
                    </div>
                  ) : (
                    recentTodos.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                      >
                        {/* Dynamic Color Dot */}
                        <div
                          className={`size-2 rounded-full ${getCategoryColor(
                            task.category
                          )}`}
                        />
                        <span className="text-sm font-medium opacity-80 truncate">
                          {task.text}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </BentoCard>

              {/* - Middle Col - */
              /* vertical clock */}
              <BentoCard className="col-start-2 col-end-3 row-start-1 row-end-3 bg-blue-500/5 border-blue-500/20">
                <VerticalClock />
              </BentoCard>

              {/* - Right Col - */
              /* recent note (now dynamic) */}
              <RecentNote
                className="col-start-3 col-end-4 row-start-1 row-end-3 bg-orange-500/5 border-orange-500/10"
                note={recentNote}
                onEdit={handleEditNote}
              />

              {/* - Bottom Row - */}
              {/* StepAhead timer (focus) */}
              {/* col-span-4 to span the entire width of the grid*/}
              <BentoCard className="col-span-3 row-start-3 row-end-4 px-6 bg-orange-500/5 border-orange-500/20">
                {/* group of StepAhead */}
                <div className="flex items-center justify-between w-full h-full px-4">
                  {/* left: title */}
                  <div className="flex flex-col justify-center min-w-0 mr-4">
                    <h3 className="text-xl font-bold text-white tracking-wide whitespace-nowrap">
                      StepAhead Focus
                    </h3>
                    <p className="text-xs text-orange-300/60 uppercase tracking-widest mt-1">
                      Session Active
                    </p>
                  </div>

                  {/* right: content group (i.e. visualizer, time, button) */}
                  <div className="flex items-center gap-6 h-full shrink-0">
                    {/* visualizer */}
                    <div
                      className={`flex gap-1 items-end h-8 opacity-60 ${
                        !isTimerActive && "opacity-30 grayscale"
                      }`}
                    >
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 bg-orange-500 rounded-t-sm ${
                            isTimerActive ? "animate-pulse" : ""
                          }`}
                          style={{
                            height: `${30 + Math.random() * 70}%`,
                            animationDelay: `${i * 0.1}s`,
                            transition: "height 0.5s ease",
                          }}
                        />
                      ))}
                    </div>

                    {/* vertical divider */}
                    <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />

                    {/* timer */}
                    <div
                      className={`text-3xl font-mono font-bold tracking-tight ${
                        isTimerActive ? "text-white" : "text-white/50"
                      }`}
                    >
                      {formatTime(timeLeft)}
                    </div>

                    {/* controls group8 */}
                    <div className="flex items-center gap-2 ml-2">
                      {/* reset button */}
                      <button
                        onClick={resetTimer}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white
                        transition-all hover:scale-105 active:scale-90"
                        title="Reset Timer"
                      >
                        <RotateCcw size={18} />
                      </button>

                      {/* play/pause button */}
                      <button
                        onClick={toggleTimer}
                        className={`flex items-center gap-3 pl-4 pr-6 py-2 rounded-xl font-bold transition-all hover:scale-105
                          active:scale-95 shadow-lg 
                        ${
                          isTimerActive
                            ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 border border-orange-500/50"
                            : "bg-orange-500 hover:bg-orange-400 text-white shadow-orange-500/20"
                        }`}
                      >
                        <div
                          className={`p-1 rounded transition-colors ${
                            isTimerActive
                              ? "bg-orange-500 text-white"
                              : "bg-white/20"
                          }`}
                        >
                          {isTimerActive ? (
                            <Pause size={12} fill="currentColor" />
                          ) : (
                            <Play size={12} fill="currentColor" />
                          )}
                        </div>
                        <span className="uppercase tracking-wider text-[12px]">
                          {isTimerActive ? "Pause" : "Start"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </BentoCard>
            </div>
          )}

          {/* view-2 Notes page */}
          {activeTab === "notes" && <NotesView />}

          {/* view-3 To-do list */}
          {activeTab === "todo" && <TodoView />}
        </div>
      </div>
    </div>
  );
}

export default App;

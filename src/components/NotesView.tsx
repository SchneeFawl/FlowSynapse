import { useState, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import { Plus, Search, FileText, MoreHorizontal } from "lucide-react";

// mock data 1 (might replace with local storage later)
const MOCK_NOTES = [
  {
    id: 1,
    title: "Physics project",
    date: "2m ago",
    preview: "Momentum in vacuum...",
  },
  {
    id: 2,
    title: "History notes",
    date: "2d ago",
    preview: "The industrial revolution...",
  },
  {
    id: 3,
    title: "React project ideas",
    date: "4d ago",
    preview: "Component structure for...",
  },
];

export default function NotesView() {
  const [activeNote, setActiveNote] = useState(1);
  const editorInstance = useRef<EditorJS | null>(null);

  // initialize Editor.js
  useEffect(() => {
    if (editorInstance.current) return;

    const editor = new EditorJS({
      holder: "editorjs",
      placeholder: "Start typing...",
      tools: {
        header: { class: Header as any, config: { placeholder: "Heading" } },
        list: { class: List as any, inlineToolbar: true },
      },
      data: {
        blocks: [
          { type: "header", data: { text: "Physics Project", level: 1 } },
          {
            type: "paragraph",
            data: { text: "Objective: Demonstrate momentum conservation." },
          },
        ],
      },
      onReady: () => {
        editorInstance.current = editor;
      },
      autofocus: true,
    });

    return () => {
      if (editorInstance.current && editorInstance.current.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [activeNote]);

  return (
    <div className="flex w-full h-full gap-4">
      {/* - Sidebar 25% - */}
      <div className="w-1/4 h-full flex flex-col gap-4 min-w-[200px]">
        {/* search bar */}
        <div className="flex gap-2">
          <div
            className="flex-1 flex items-center gap-2 bg-[#0f0f12]/60 border border-white/5 rounded-xl px-3 py-3
          backdrop-blur-xl"
          >
            <Search size={16} className="text-white/40" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-white/20"
            />
          </div>
          <button
            className="aspect-square flex items-center justify-center bg-indigo-500 hover:bg-indigo-400
          text-white rounded-xl transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* notes list */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
          {MOCK_NOTES.map((note) => (
            <div
              key={note.id}
              onClick={() => setActiveNote(note.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all group
                ${
                  activeNote === note.id
                    ? "bg-white/10 border-white/10 shadow-lg"
                    : "bg-[#0f0f12]/40 border-transparent hover:bg-white/5"
                }`}
            >
              <h3
                className={`font-bold text-sm ${
                  activeNote === note.id ? "text-white" : "text-slate-400"
                }`}
              >
                {note.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 truncate">
                {note.preview}
              </p>
              <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                <FileText size={10} /> {note.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* - Notes deitor 75% - */}
      <div
        className="flex-1 h-full bg-[#0f0f12]/60 backdrop-blur-xl rounded-3xl border border-white/5
      overflow-hidden flex flex-col relative"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">
            Last edited just now
          </div>
          <button className="text-slate-500 hover:text-white">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* prose class makes the text look like a document */}
          <div
            id="editorjs"
            className="prose prose-invert prose-lg max-w-none text-slate-300/90"
          ></div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import { Plus, Search, FileText, Save, Trash2 } from "lucide-react";

// - Types -
interface Note {
  id: number;
  title: string;
  date: string;
  preview: string;
  blocks: OutputData["blocks"];
}

// - Default Data -
const INITIAL_NOTES: Note[] = [
  {
    id: 1,
    title: "Untitled Note",
    date: "Just now",
    preview: "",
    blocks: [
      { type: "header", data: { text: "Untitled Note", level: 1 } },
      {
        type: "paragraph",
        data: { text: "Start typing here..." },
      },
    ],
  },
];

export default function NotesView() {
  // - State -
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("flowsynapse-notes");
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [activeNoteId, setActiveNoteId] = useState<number>(notes[0]?.id || 1);
  const editorInstance = useRef<EditorJS | null>(null);
  const previousIdRef = useRef<number>(activeNoteId);

  // Find the active note (removed fallback to notes[0] to prevent stale data loading)
  const activeNote = notes.find((n) => n.id === activeNoteId);

  // - Actions -

  const saveCurrentNote = async (): Promise<Note[]> => {
    // If editor isn't ready or note doesn't exist, return current list
    if (!editorInstance.current || !activeNote) return notes;

    try {
      const savedData = await editorInstance.current.save();

      const updatedNotes = notes.map((note) => {
        if (note.id === activeNoteId) {
          const headerBlock = savedData.blocks.find((b) => b.type === "header");
          const paragraphBlock = savedData.blocks.find(
            (b) => b.type === "paragraph"
          );

          const newTitle =
            headerBlock?.data.text || note.title || "Untitled Note";

          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = paragraphBlock?.data.text || "No additional text";
          const newPreview = tempDiv.textContent || "";

          return {
            ...note,
            blocks: savedData.blocks,
            title: newTitle,
            preview:
              newPreview.substring(0, 30) +
              (newPreview.length > 30 ? "..." : ""),
            date: "Just now",
          };
        }
        return note;
      });

      setNotes(updatedNotes);
      localStorage.setItem("flowsynapse-notes", JSON.stringify(updatedNotes));
      return updatedNotes;
    } catch (e) {
      console.error("Save failed:", e);
      return notes;
    }
  };

  const handleCreateNote = async () => {
    const currentNotes = await saveCurrentNote();

    const newId = Date.now();
    const newNote: Note = {
      id: newId,
      title: "Untitled Note",
      date: "Just now",
      preview: "Start typing...",
      blocks: [
        { type: "header", data: { text: "Untitled Note", level: 1 } },
        { type: "paragraph", data: { text: "Start typing here..." } },
      ],
    };

    const updatedList = [newNote, ...currentNotes];
    setNotes(updatedList);
    localStorage.setItem("flowsynapse-notes", JSON.stringify(updatedList));
    setActiveNoteId(newId);
  };

  const handleSwitchNote = async (id: number) => {
    if (id === activeNoteId) return;
    await saveCurrentNote();
    setActiveNoteId(id);
  };

  const handleDeleteNote = () => {
    const remainingNotes = notes.filter((n) => n.id !== activeNoteId);

    if (remainingNotes.length === 0) {
      const defaultNote = INITIAL_NOTES[0];
      defaultNote.id = Date.now();
      setNotes([defaultNote]);
      localStorage.setItem("flowsynapse-notes", JSON.stringify([defaultNote]));
      setActiveNoteId(defaultNote.id);
    } else {
      setNotes(remainingNotes);
      localStorage.setItem("flowsynapse-notes", JSON.stringify(remainingNotes));
      setActiveNoteId(remainingNotes[0].id);
    }
  };

  // - Editor Initialization -
  useEffect(() => {
    // if no note data yet, wait for next render
    if (!activeNote) return;

    // prevent re-initialization on save
    // if editor exists and the id hasnt changed, it means it just saved
    // we dont want to reload the editor , it kills the cursor position
    if (editorInstance.current && activeNoteId === previousIdRef.current) {
      return;
    }

    // cleanup previous instance if switching ids
    if (editorInstance.current) {
      if (typeof editorInstance.current.destroy === "function") {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    }

    // HARD RESET DOM (ffs)
    const container = document.getElementById("editorjs");
    if (container) container.innerHTML = "";

    const editor = new EditorJS({
      holder: "editorjs",
      placeholder: "Start typing...",
      tools: {
        header: {
          class: Header as any,
          config: {
            placeholder: "Heading",
            levels: [1, 2, 3],
            defaultLevel: 1,
          },
        },
        list: { class: List as any, inlineToolbar: true },
      },
      data: {
        blocks: activeNote.blocks,
      },
      autofocus: true,
    });

    editorInstance.current = editor;
    previousIdRef.current = activeNoteId;

    return () => {
      // relying on the check above to destroy old instances
    };
  }, [activeNoteId, notes]);

  return (
    <div className="flex w-full h-full gap-4">
      {/* CSS Styles */}
      <style>{`
        .ce-inline-toolbar {
          background-color: #1a1a1a !important;
          border: 1px solid rgba(255,255,255,0.1);
          color: white !important;
          z-index: 1000 !important;
          }

        .ce-inline-tool svg, .ce-conversion-tool__icon svg {
          fill: black !important;
          color: black !important;
          }

        .ce-inline-tool--active svg, .ce-inline-tool--active {
          fill: #818cf8 !important;
          color: #818cf8 !important;
          }

        .ce-inline-tool:hover {
          background-color: rgba(255,255,255,0.1) !important;
          }

        .ce-conversion-toolbar {
          background-color: #1a1a1a !important;
          border: 1px solid rgba(255,255,255,0.1)
          }

        .ce-conversion-tool {
          color: white !important;
          }

        .ce-conversion-tool:hover {
          background-color: rgba(255,255,255,0.1) !important;
          }
        #editorjs h1 {
          font-size: 2.25rem !important;
          font-weight: 800 !important;
          margin-bottom: 0.5rem;
          line-height: 1.2;
          }

        #editorjs h2 {
          font-size: 1.875rem !important;
          font-weight: 700 !important;
          margin-bottom: 0.5rem;
          }

        #editorjs h3 {
          font-size: 1.5rem !important;
          font-weight: 620 !important;
          }

        .ce-toolbar__plus, .ce-toolbar__settings-btn {
          color: rgba(255, 255, 255, 0.8) !important;
          background-color: transparent !important;
          transition: all 0.2s ease;
          }

        .ce-toolbar__plus:hover, .ce-toolbar__settings-btn:hover {
          color: #000000 !important;
          background-color: #ffffff !important
          }

        #editorjs ::selection {
          background-color: rgba(255, 255, 255, 0.9);
          color: #000000;
          }

      `}</style>

      {/* - Sidebar - */}
      <div className="w-1/4 h-full flex flex-col gap-4 min-w-[220px]">
        {/* search & create button */}
        <div className="flex gap-2">
          <div
            className="flex-1 flex items-center gap-2 bg-[#0f0f12]/60 border border-white/5 rounded-xl
            px-3 py-3 backdrop-blur-xl"
          >
            <Search size={16} className="text-white/40" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-white w-full
                placeholder:text-white/20"
            />
          </div>

          <button
            onClick={handleCreateNote}
            className="aspect-square flex w-12 items-center justify-center bg-indigo-500
            hover:bg-indigo-400 text-white rounded-xl transition-all hover:scale-105 active:scale-95
              shadow-lg shadow-indigo-500/20"
            title="Create New Note"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Note List */}
        <div
          className="flex-1 bg-black/15 backdrop-blur-xs rounded-2xl border border-white/8
          overflow-hidden flex flex-col p-2"
        >
          <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => handleSwitchNote(note.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all group ${
                  activeNoteId === note.id
                    ? "bg-white/10 shadow-md"
                    : "hover:bg-white/5"
                }`}
              >
                <h3
                  className={`font-bold text-sm ${
                    activeNoteId === note.id ? "text-white" : "text-slate-300"
                  }`}
                >
                  {note.title}
                </h3>
                <p
                  className={`text-xs mt-1 truncate ${
                    activeNoteId === note.id
                      ? "text-slate-300"
                      : "text-slate-400"
                  }`}
                >
                  {note.preview}
                </p>
                <div
                  className="flex items-center gap-2 mt-3 text-[10px] text-slate-300 font-bold uppercase
                  tracking-wider"
                >
                  <FileText size={10} /> {note.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* - Editor Area - */}
      <div
        className="flex-1 h-full bg-[#0f0f12]/60 backdrop-blur-xl rounded-3xl border border-white/5
        overflow-hidden flex flex-col relative"
      >
        {/* top bar with SAVE and DELETE */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">
            {activeNoteId === activeNote?.id
              ? "Editing..."
              : "Last saved just now"}
          </div>

          <div className="flex items-center gap-2">
            {/* save button */}
            <button
              onClick={() => saveCurrentNote()}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all
              flex items-center gap-2"
              title="Save Note"
            >
              <Save size={18} />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">
                Save
              </span>
            </button>

            {/* delete button */}
            <button
              onClick={handleDeleteNote}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
              title="Delete Note"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* editor content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div
            id="editorjs"
            className="prose prose-invert prose-lg max-w-none text-slate-300/90"
          ></div>
        </div>
      </div>
    </div>
  );
}

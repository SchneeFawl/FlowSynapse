import { Edit3, Clock, FileText } from "lucide-react";
import BentoCard from "./bentocard";

// Define the shape of the data we expect
interface NoteData {
  id: number;
  title: string;
  date: string;
  preview: string;
  blocks?: any[];
}

interface RecentNoteProps {
  className?: string;
  note?: NoteData | null;
  onEdit?: (id: number) => void;
}

// destructure onEdit here so it is available in the function scope
export default function RecentNote({
  className = "",
  note,
  onEdit,
}: RecentNoteProps) {
  // if no note exists, show a placeholder
  if (!note) {
    return (
      <BentoCard
        title="Recently viewed note"
        className={`group relative ${className}`}
      >
        <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
          <FileText size={48} className="mb-4 opacity-50" />
          <p className="text-sm font-medium uppercase tracking-widest">
            No notes yet
          </p>
        </div>
      </BentoCard>
    );
  }

  // function to render rich block content
  const renderContent = () => {
    if (!note.blocks || note.blocks.length === 0) {
      // Fallback if no blocks (e.g. legacy data)
      return <p>{note.preview}</p>;
    }

    // skip the first block (main title)
    // we assume index 0 is the main heading shown at the top of the card
    const contentBlocks = note.blocks.slice(1);

    return contentBlocks.map((block: any, i: number) => {
      // create HTML object for dangerouslySetInnerHTML
      const htmlContent = { __html: block.data.text };
      const key = i;

      switch (block.type) {
        case "header":
          // Render sub-headings (after the main title)
          // Using h4 to keep them distinct but smaller than the main card title
          return (
            <h4
              key={key}
              className="font-bold text-indigo-300 mt-3 mb-1 text-xs uppercase tracking-wider"
              dangerouslySetInnerHTML={htmlContent}
            />
          );

        case "paragraph":
          // Standard text
          return (
            <p
              key={key}
              className="mb-2"
              dangerouslySetInnerHTML={htmlContent}
            />
          );

        case "list":
          // Handle lists (ordered vs unordered)
          const ListTag = block.data.style === "ordered" ? "ol" : "ul";
          return (
            <ListTag
              key={key}
              className="list-disc list-inside mb-2 pl-1 space-y-1"
            >
              {block.data.items.map((item: any, idx: number) => {
                // FIX: Handle cases where item is an object instead of a string
                const content =
                  typeof item === "string"
                    ? item
                    : item.content || item.text || "";

                return (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: content }} />
                );
              })}
            </ListTag>
          );

        default:
          return null;
      }
    });
  };

  return (
    <BentoCard
      title="Recently viewed note"
      className={`group relative ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
        <div className="overflow-hidden">
          <h2 className="text-2xl font-bold text-white tracking-tight truncate pr-4">
            {note.title}
          </h2>
          <div className="flex items-center gap-3 mt-2 text-xs font-medium text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <Clock size={12} /> {note.date}
            </span>
            {/* Optional: You could add tags here if you implement categories later */}
          </div>
        </div>

        <button
          onClick={() => onEdit && onEdit(note.id)} // trigger the callback
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 border
        border-white/5 transition-all hover:scale-105 active:scale-90 shrink-0"
        >
          <Edit3 size={18} className="text-white/70" />
        </button>
      </div>

      {/* Note Content Preview */}
      <div className="opacity-80 font-medium text-s leading-relaxed text-slate-200 h-full overflow-hidden relative">
        {/* Container with Line Clamp logic */}
        <div
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 8, // Limits to exactly 8 lines
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {renderContent()}
        </div>

        {/* Decorative elements to maintain the 'Editor' aesthetic */}
        <div className="pl-4 border-l-2 border-indigo-500/50 italic text-slate-400 text-sm mt-4">
          Reading mode
        </div>
      </div>
    </BentoCard>
  );
}

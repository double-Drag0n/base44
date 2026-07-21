import React, { useState, useEffect } from "react";
import { Search, Tag } from "lucide-react";

const CATEGORIES = [
  "All",
  "Nature",
  "Portrait",
  "Architecture",
  "Travel",
  "Food",
  "Art",
  "Animals",
  "Sports",
  "Other",
];

export default function SearchFilter({ onFilter }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [tagInput, setTagInput] = useState("");
  const [activeTags, setActiveTags] = useState([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onFilter({ query, category, tags: activeTags });
    }, 250);
    return () => clearTimeout(handler);
  }, [query, category, activeTags]);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !activeTags.includes(t)) {
      setActiveTags([...activeTags, t]);
    }
    setTagInput("");
  };

  const removeTag = (tag) => {
    setActiveTags(activeTags.filter((t) => t !== tag));
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-sky-100 space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search photos by title or description..."
          className="w-full rounded-full border border-slate-200 pl-12 pr-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-slate-50"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              category === cat
                ? "bg-sky-500 text-white shadow-md shadow-sky-200"
                : "bg-slate-50 text-slate-600 hover:bg-sky-50 hover:text-sky-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tag filter */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="Filter by tag..."
            className="w-full rounded-full border border-slate-200 pl-11 pr-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-slate-50"
          />
        </div>
        <button
          onClick={addTag}
          className="px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200"
        >
          Add
        </button>
      </div>

      {activeTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeTags.map((tag) => (
            <button
              key={tag}
              onClick={() => removeTag(tag)}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-medium hover:bg-sky-200"
            >
              #{tag} <span className="text-sky-400">✕</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

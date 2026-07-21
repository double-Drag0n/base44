import React, { useState, useEffect } from "react";
import { Trash2, Search, Edit3, X, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Image } from "@/components/ui/image";

const CATEGORIES = [
  "Nature", "Portrait", "Architecture", "Travel",
  "Food", "Art", "Animals", "Sports", "Other",
];

export default function PhotoManager() {
  const { toast } = useToast();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Photo.list("-created_date", 200);
    setPhotos(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this photo? This cannot be undone.")) return;
    await base44.entities.Photo.delete(id);
    await base44.entities.Comment.deleteMany({ photo_id: id });
    toast({ title: "Photo deleted" });
    load();
  };

  const saveEdit = async () => {
    await base44.entities.Photo.update(editing.id, {
      title: editing.title,
      description: editing.description,
      category: editing.category,
      tags: editing.tags,
    });
    setEditing(null);
    toast({ title: "Photo updated" });
    load();
  };

  const filtered = photos.filter((p) =>
    p.title?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search photos..."
          className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
        />
      </div>

      {loading ? (
        <p className="text-slate-400 text-center py-8 text-sm">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-slate-400 text-center py-8 text-sm">No photos found.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((photo) => (
            <div
              key={photo.id}
              className="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-100"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                {photo.image_url && (
                  <Image src={photo.image_url} alt={photo.title} fittingType="fill" className="w-full h-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">{photo.title}</p>
                <p className="text-xs text-slate-400">
                  {photo.category} · {photo.likes_count || 0} likes · {(photo.tags || []).length} tags
                </p>
              </div>
              <button
                onClick={() => setEditing({ ...photo, tags: photo.tags || [] })}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-sky-50 hover:text-sky-500"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(photo.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Edit Photo</h3>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              placeholder="Title"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <textarea
              value={editing.description || ""}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              rows={3}
              placeholder="Description"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <select
              value={editing.category}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input
              value={(editing.tags || []).join(", ")}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                })
              }
              placeholder="Tags (comma separated)"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <button
              onClick={saveEdit}
              className="w-full py-2.5 rounded-xl bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

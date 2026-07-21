import React, { useState, useEffect } from "react";
import { Trash2, Edit3, X, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

export default function AlbumManager() {
  const { toast } = useToast();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Album.list("-created_date", 200);
    setAlbums(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this album? Photos will remain but be unassigned.")) return;
    // Unassign photos in this album
    await base44.entities.Photo.updateMany(
      { album_id: id },
      { $unset: { album_id: "" } }
    );
    await base44.entities.Album.delete(id);
    toast({ title: "Album deleted" });
    load();
  };

  const saveEdit = async () => {
    await base44.entities.Album.update(editing.id, {
      title: editing.title,
      description: editing.description,
    });
    setEditing(null);
    toast({ title: "Album updated" });
    load();
  };

  return (
    <div>
      {loading ? (
        <p className="text-slate-400 text-center py-8 text-sm">Loading...</p>
      ) : albums.length === 0 ? (
        <p className="text-slate-400 text-center py-8 text-sm">No albums yet.</p>
      ) : (
        <div className="space-y-2">
          {albums.map((album) => (
            <div
              key={album.id}
              className="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-100"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center shrink-0">
                <span className="text-lg">📁</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">{album.title}</p>
                <p className="text-xs text-slate-400 truncate">
                  {album.description || "No description"}
                </p>
              </div>
              <button
                onClick={() => setEditing({ ...album })}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-sky-50 hover:text-sky-500"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(album.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Edit Album</h3>
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
              rows={2}
              placeholder="Description"
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

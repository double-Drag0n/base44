import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import AlbumCard from "@/components/AlbumCard";

export default function Albums() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [albums, setAlbums] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Album.list("-created_date", 100);
    setAlbums(data);
    // Get photo counts per album
    const allPhotos = await base44.entities.Photo.filter({});
    const c = {};
    allPhotos.forEach((p) => {
      if (p.album_id) c[p.album_id] = (c[p.album_id] || 0) + 1;
    });
    setCounts(c);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await base44.entities.Album.create({
      title: form.title.trim(),
      description: form.description.trim(),
    });
    setForm({ title: "", description: "" });
    setShowForm(false);
    toast({ title: "Album created" });
    load();
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <h2 className="text-xl font-bold text-slate-800">Sign in to manage albums</h2>
        <p className="text-slate-500 mt-2 text-sm">
          Create an account to organize your photos into personal galleries.
        </p>
        <button
          onClick={() => base44.auth.redirectToLogin(window.location.href)}
          className="mt-6 px-7 py-3 rounded-full bg-sky-500 text-white font-medium shadow-lg shadow-sky-200 hover:bg-sky-600 transition-all"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-800">
            My Albums
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Organize your photos into personal collections.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-500 text-white font-medium shadow-md shadow-sky-200 hover:bg-sky-600 transition-all"
        >
          <Plus className="w-4 h-4" /> New Album
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-8 bg-white rounded-2xl p-5 shadow-sm border border-sky-100 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Create Album</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Album title..."
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            placeholder="Description (optional)..."
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-full bg-sky-500 text-white text-sm font-medium hover:bg-sky-600"
          >
            Create
          </button>
        </form>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-white shadow-sm overflow-hidden animate-pulse">
              <div className="aspect-video bg-slate-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg">No albums yet.</p>
          <p className="text-slate-400 text-sm mt-1">
            Create one to start organizing your photos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              photoCount={counts[album.id] || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

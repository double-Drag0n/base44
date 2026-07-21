import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, X, Image as ImageIcon } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Image } from "@/components/ui/image";

const CATEGORIES = [
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

export default function Upload() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Nature",
    album_id: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (user) {
      base44.entities.Album.list("-created_date", 100).then(setAlbums);
    }
  }, [user]);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setPreview(file_url);
      if (!form.title) {
        setForm((f) => ({ ...f, title: file.name.replace(/\.[^.]+$/, "") }));
      }
    } catch {
      toast({ title: "Upload failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) {
      setForm({ ...form, tags: [...form.tags, t] });
    }
    setTagInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!preview) {
      toast({ title: "Please select an image first", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const photo = await base44.entities.Photo.create({
        title: form.title,
        description: form.description,
        image_url: preview,
        category: form.category,
        tags: form.tags,
        album_id: form.album_id || undefined,
        likes_count: 0,
      });
      toast({ title: "Photo published!" });
      navigate(`/photo/${photo.id}`);
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-4">
          <UploadIcon className="w-8 h-8 text-sky-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Sign in to upload</h2>
        <p className="text-slate-500 mt-2 text-sm">
          You need an account to publish photos and join the community.
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="font-display text-3xl font-bold text-slate-800 mb-1">
        Upload a Photo
      </h1>
      <p className="text-slate-500 text-sm mb-8">
        Share your work with the community. Fill in the details below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File picker */}
        {!preview ? (
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-sky-200 rounded-3xl bg-white py-16 flex flex-col items-center justify-center hover:border-sky-400 hover:bg-sky-50/50 transition-all">
              {uploading ? (
                <>
                  <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mb-3" />
                  <p className="text-sm text-slate-500">Uploading...</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center mb-3">
                    <ImageIcon className="w-7 h-7 text-sky-500" />
                  </div>
                  <p className="font-medium text-slate-700">
                    Click to select an image
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    PNG, JPG, WebP up to 10MB
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
              disabled={uploading}
            />
          </label>
        ) : (
          <div className="relative rounded-3xl overflow-hidden bg-white shadow-sm">
            <Image src={preview} alt="Preview" fittingType="fit" className="w-full max-h-80 object-contain bg-slate-50" />
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Title
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            placeholder="Give your photo a name..."
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Caption / Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Describe your photo..."
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        {/* Category + Album */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Album (optional)
            </label>
            <select
              value={form.album_id}
              onChange={(e) => setForm({ ...form, album_id: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
            >
              <option value="">No album</option>
              {albums.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Tags
          </label>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag())
              }
              placeholder="Add tags and press Enter..."
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      tags: form.tags.filter((t) => t !== tag),
                    })
                  }
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-medium hover:bg-sky-200"
                >
                  #{tag} <span className="text-sky-400">✕</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading || !preview}
          className="w-full py-3 rounded-full bg-sky-500 text-white font-medium shadow-lg shadow-sky-200 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {uploading ? "Publishing..." : "Publish Photo"}
        </button>
      </form>
    </div>
  );
}

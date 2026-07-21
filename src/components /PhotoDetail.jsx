import React, { useState, useEffect } from "react";
import { Heart, Download, Edit3, Check, X } from "lucide-react";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import CommentSection from "@/components/CommentSection";

export default function PhotoDetail({ photo, onUpdate }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(photo.likes_count || 0);
  const [editing, setEditing] = useState(false);
  const [desc, setDesc] = useState(photo.description || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("liked_photos") || "[]");
    setLiked(stored.includes(photo.id));
    setLikeCount(photo.likes_count || 0);
    setDesc(photo.description || "");
  }, [photo.id, photo.likes_count, photo.description]);

  const isOwner = user && photo.created_by_id === user.id;

  const handleLike = () => {
    const stored = JSON.parse(localStorage.getItem("liked_photos") || "[]");
    if (liked) {
      const updated = stored.filter((id) => id !== photo.id);
      localStorage.setItem("liked_photos", JSON.stringify(updated));
      setLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
      base44.entities.Photo.update(photo.id, {
        likes_count: Math.max(0, likeCount - 1),
      });
    } else {
      localStorage.setItem(
        "liked_photos",
        JSON.stringify([...stored, photo.id])
      );
      setLiked(true);
      setLikeCount((c) => c + 1);
      base44.entities.Photo.update(photo.id, { likes_count: likeCount + 1 });
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = photo.image_url;
    a.download = photo.title || "photo";
    a.target = "_blank";
    a.click();
    toast({ title: "Download started" });
  };

  const saveDescription = async () => {
    setSaving(true);
    try {
      await base44.entities.Photo.update(photo.id, { description: desc });
      onUpdate?.({ ...photo, description: desc });
      setEditing(false);
      toast({ title: "Caption updated" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="rounded-3xl overflow-hidden bg-white shadow-xl shadow-slate-200/50">
            <Image
              src={photo.image_url}
              alt={photo.title}
              fittingType="fit"
              className="w-full max-h-[70vh] object-contain bg-slate-50"
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{photo.title}</h1>

            {/* Caption / description */}
            {isOwner && editing ? (
              <div className="mt-3 space-y-2">
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="Add a caption or description..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveDescription}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" /> Save
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setDesc(photo.description || "");
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex items-start gap-2">
                <p className="text-slate-600 text-sm leading-relaxed flex-1">
                  {photo.description || "No description yet."}
                </p>
                {isOwner && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-slate-400 hover:text-sky-500 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {photo.tags && photo.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {photo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                liked
                  ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                  : "bg-white text-slate-600 hover:bg-rose-50 border border-slate-200"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${liked ? "fill-current" : ""}`}
              />
              {likeCount}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm bg-white text-slate-600 hover:bg-sky-50 border border-slate-200 transition-all"
            >
              <Download className="w-4 h-4" /> Download
            </button>
          </div>

          <CommentSection photoId={photo.id} />
        </div>
      </div>
    </div>
  );
}

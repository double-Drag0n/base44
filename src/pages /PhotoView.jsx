import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PhotoDetail from "@/components/PhotoDetail";

export default function PhotoView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allIds, setAllIds] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [p, all] = await Promise.all([
        base44.entities.Photo.get(id),
        base44.entities.Photo.list("-created_date", 200),
      ]);
      setPhoto(p);
      setAllIds(all.map((x) => x.id));
      setLoading(false);
    })();
  }, [id]);

  const currentIndex = allIds.indexOf(id);
  const goPrev = () =>
    currentIndex > 0 && navigate(`/photo/${allIds[currentIndex - 1]}`);
  const goNext = () =>
    currentIndex < allIds.length - 1 &&
    navigate(`/photo/${allIds[currentIndex + 1]}`);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="text-center py-32">
        <p className="text-slate-400">Photo not found.</p>
        <Link
          to="/"
          className="text-sky-500 hover:underline mt-2 inline-block"
        >
          Back to gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between mb-2">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Gallery
        </Link>
        <div className="flex gap-2">
          <button
            onClick={goPrev}
            disabled={currentIndex <= 0}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            disabled={currentIndex >= allIds.length - 1}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <PhotoDetail photo={photo} onUpdate={setPhoto} />
    </div>
  );
}

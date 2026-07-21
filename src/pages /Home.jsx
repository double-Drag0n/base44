import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { Upload, Sparkles } from "lucide-react";
import PhotoCard from "@/components/PhotoCard";
import SearchFilter from "@/components/SearchFilter";

export default function Home() {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ query: "", category: "All", tags: [] });

  useEffect(() => {
    (async () => {
      const data = await base44.entities.Photo.list("-created_date", 200);
      setPhotos(data);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return photos.filter((p) => {
      if (filters.query) {
        const q = filters.query.toLowerCase();
        if (
          !p.title?.toLowerCase().includes(q) &&
          !p.description?.toLowerCase().includes(q)
        )
          return false;
      }
      if (filters.category !== "All" && p.category !== filters.category)
        return false;
      if (filters.tags.length > 0) {
        const photoTags = (p.tags || []).map((t) => t.toLowerCase());
        if (!filters.tags.every((t) => photoTags.includes(t))) return false;
      }
      return true;
    });
  }, [photos, filters]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-100 to-[#eaf4fb]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-sky-300 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur border border-sky-200 text-sm text-sky-700 font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Discover stunning photography
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-slate-800 tracking-tight max-w-3xl mx-auto leading-tight">
            A beautiful home for your{" "}
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              photos
            </span>
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
            Browse, download, and engage with a community of photographers.
            Share your stories one frame at a time.
          </p>
          {user ? (
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 mt-8 px-7 py-3 rounded-full bg-sky-500 text-white font-medium shadow-lg shadow-sky-200 hover:bg-sky-600 hover:scale-105 transition-all"
            >
              <Upload className="w-5 h-5" /> Upload a Photo
            </Link>
          ) : (
            <button
              onClick={() => base44.auth.redirectToLogin(window.location.href)}
              className="inline-flex items-center gap-2 mt-8 px-7 py-3 rounded-full bg-sky-500 text-white font-medium shadow-lg shadow-sky-200 hover:bg-sky-600 hover:scale-105 transition-all"
            >
              <Upload className="w-5 h-5" /> Join to Upload
            </button>
          )}
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6">
          <SearchFilter onFilter={setFilters} />
        </div>

        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl font-bold text-slate-800">
            {filters.category !== "All" || filters.tags.length > 0 || filters.query
              ? "Filtered Results"
              : "Latest Photos"}
          </h2>
          <span className="text-sm text-slate-400">
            {filtered.length} photo{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white shadow-sm overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-slate-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No photos found.</p>
            <p className="text-slate-400 text-sm mt-1">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

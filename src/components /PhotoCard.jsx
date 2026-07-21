import React from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function PhotoCard({ photo }) {
  return (
    <Link
      to={`/photo/${photo.id}`}
      className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={photo.image_url}
          alt={photo.title}
          fittingType="fill"
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {photo.category && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-medium text-slate-700">
            {photo.category}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 truncate">{photo.title}</h3>
        {photo.description && (
          <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">
            {photo.description}
          </p>
        )}
        <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {photo.likes_count || 0}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {(photo.tags || []).slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

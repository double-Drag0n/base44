import React from "react";
import { Link } from "react-router-dom";
import { FolderOpen, ImageIcon } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function AlbumCard({ album, photoCount = 0 }) {
  return (
    <Link
      to={`/album/${album.id}`}
      className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-video bg-slate-100 overflow-hidden">
        {album.cover_image_url ? (
          <Image
            src={album.cover_image_url}
            alt={album.title}
            fittingType="fill"
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100">
            <FolderOpen className="w-10 h-10 text-sky-300" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 truncate">{album.title}</h3>
        {album.description && (
          <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">
            {album.description}
          </p>
        )}
        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
          <ImageIcon className="w-3 h-3" /> {photoCount} photo{photoCount !== 1 ? "s" : ""}
        </p>
      </div>
    </Link>
  );
}

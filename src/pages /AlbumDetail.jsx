import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FolderOpen } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PhotoCard from "@/components/PhotoCard";

export default function AlbumDetail() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [a, allPhotos] = await Promise.all([
        base44.entities.Album.get(id),
        base44.entities.Photo.filter({ album_id: id }),
      ]);
      setAlbum(a);
      setPhotos(allPhotos.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!album) {
    return (
      <div className="text-center py-32">
        <p className="text-slate-400">Album not found.</p>
        <Link to="/albums" className="text-sky-500 hover:underline mt-2 inline-block">
          Back to albums
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link
        to="/albums"
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-sky-600 transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Albums
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
          <FolderOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-800">
            {album.title}
          </h1>
          {album.description && (
            <p className="text-slate-500 text-sm mt-0.5">{album.description}</p>
          )}
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg">This album is empty.</p>
          <Link
            to="/upload"
            className="text-sky-500 hover:underline mt-2 inline-block"
          >
            Upload a photo to this album
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      )}
    </div>
  );
}

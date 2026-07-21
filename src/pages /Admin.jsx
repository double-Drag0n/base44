import React, { useState, useEffect } from "react";
import { Image as ImageIcon, MessageCircle, FolderOpen, Users, TrendingUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import PhotoManager from "@/components/admin/PhotoManager";
import CommentManager from "@/components/admin/CommentManager";
import AlbumManager from "@/components/admin/AlbumManager";

const tabs = [
  { id: "photos", label: "Photos", icon: ImageIcon },
  { id: "comments", label: "Comments", icon: MessageCircle },
  { id: "albums", label: "Albums", icon: FolderOpen },
];

export default function Admin() {
  const { user } = useAuth();
  const [active, setActive] = useState("photos");
  const [stats, setStats] = useState({ photos: 0, comments: 0, albums: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [photos, comments, albums, users] = await Promise.all([
          base44.entities.Photo.list(),
          base44.entities.Comment.list(),
          base44.entities.Album.list(),
          base44.entities.User.list(),
        ]);
        setStats({
          photos: photos.length,
          comments: comments.length,
          albums: albums.length,
          users: users.length,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🔒</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Admin access required</h2>
        <p className="text-slate-500 mt-2 text-sm">
          You need an admin account to access the CMS dashboard.
        </p>
      </div>
    );
  }

  const statCards = [
    { label: "Photos", value: stats.photos, icon: ImageIcon, color: "from-sky-400 to-blue-500" },
    { label: "Comments", value: stats.comments, icon: MessageCircle, color: "from-violet-400 to-purple-500" },
    { label: "Albums", value: stats.albums, icon: FolderOpen, color: "from-emerald-400 to-teal-500" },
    { label: "Users", value: stats.users, icon: Users, color: "from-amber-400 to-orange-500" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-slate-800">CMS Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage your photos, comments, and albums.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-slate-800">
                {loading ? "—" : s.value}
              </p>
              <p className="text-sm text-slate-400">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                active === tab.id
                  ? "bg-sky-500 text-white shadow-md shadow-sky-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-sky-50"
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
        {active === "photos" && <PhotoManager />}
        {active === "comments" && <CommentManager />}
        {active === "albums" && <AlbumManager />}
      </div>
    </div>
  );

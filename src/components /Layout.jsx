import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Camera, Upload, FolderOpen, Home as HomeIcon, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";

const navItems = [
  { to: "/", label: "Gallery", icon: HomeIcon },
  { to: "/upload", label: "Upload", icon: Upload },
  { to: "/albums", label: "My Albums", icon: FolderOpen },
];

export default function Layout() {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user && user.role === "admin";
  const items = isAdmin
    ? [...navItems, { to: "/admin", label: "CMS", icon: ShieldCheck }]
    : navItems;

  return (
    <div className="min-h-screen flex flex-col bg-[#eaf4fb]">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-200 group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-slate-800 tracking-tight">
              Lumen
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {items.map((item) => {
              const active =
                item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all",
                    active
                      ? "bg-sky-500 text-white shadow-md shadow-sky-200"
                      : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-sky-100 bg-white/50 backdrop-blur-sm py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-400">
          Lumen — Share your world, one frame at a time.
        </div>
      </footer>
    </div>
  );
}

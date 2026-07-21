import React, { useState, useEffect } from "react";
import { Trash2, MessageCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

export default function CommentManager() {
  const { toast } = useToast();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Comment.list("-created_date", 200);
    setComments(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this comment?")) return;
    await base44.entities.Comment.delete(id);
    toast({ title: "Comment deleted" });
    load();
  };

  return (
    <div>
      {loading ? (
        <p className="text-slate-400 text-center py-8 text-sm">Loading...</p>
      ) : comments.length === 0 ? (
        <p className="text-slate-400 text-center py-8 text-sm">No comments yet.</p>
      ) : (
        <div className="space-y-2">
          {comments.map((c) => (
            <div
              key={c.id}
              className="flex items-start gap-3 bg-white rounded-xl p-3 border border-slate-100"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-300 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700">{c.text}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(c.created_date).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(c.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

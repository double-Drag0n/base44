import React, { useState, useEffect } from "react";
import { Send, MessageCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export default function CommentSection({ photoId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const loadComments = async () => {
    setLoading(true);
    const data = await base44.entities.Comment.filter({ photo_id: photoId });
    setComments(data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date)));
    setLoading(false);
  };

  useEffect(() => {
    loadComments();
  }, [photoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await base44.entities.Comment.create({ photo_id: photoId, text: text.trim() });
    setText("");
    loadComments();
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100">
      <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-4">
        <MessageCircle className="w-4 h-4 text-sky-500" />
        Comments ({comments.length})
      </h3>

      {user && (
        <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts..."
            className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <button
            type="submit"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-slate-400 text-center py-4">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">
          No comments yet. Be the first!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-300 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {(c.created_by_id || "A").charAt(0).toUpperCase()}
              </div>
              <div className="bg-slate-50 rounded-2xl rounded-tl-sm px-4 py-2.5 flex-1">
                <p className="text-sm text-slate-700">{c.text}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(c.created_date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

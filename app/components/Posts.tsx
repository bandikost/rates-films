
"use client";

import { useEffect, useState } from "react";
import { TelegramPost } from "@/interface/telegram";

export default function Posts() {
  const [posts, setPosts] = useState<TelegramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/telegram/posts", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return <p className="text-zinc-400">Загрузка постов...</p>;
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      {posts.map((post) => (
        <article
          key={post.id}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
        >
          <div className="text-xs text-zinc-500 mb-3">
            Message ID: {post.telegram_message_id}
          </div>

          <p className="whitespace-pre-wrap break-words">
            {post.text || "Пост без текста"}
          </p>

          <div className="text-xs text-zinc-500 mt-4">
            {new Date(post.published_at).toLocaleString("ru-RU")}
          </div>
        </article>
      ))}

      {posts.length === 0 && (
        <p className="text-zinc-500">Постов пока нет.</p>
      )}
    </div>
  );
}

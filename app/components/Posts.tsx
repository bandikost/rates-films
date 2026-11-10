
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

        if (!res.ok) throw new Error("Failed to fetch posts");

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

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));

  const formatTime = (date: string) =>
    new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));

  return (
    <div className="journal min-h-screen px-3 py-5 sm:px-6 sm:py-10">
      <div className="journal-inner mx-auto max-w-[1120px]">

        {/* TOP LINE */}
        <div className="flex flex-wrap justify-between gap-2 border-b border-[#c8c2b7] px-5 py-3 text-[10px] uppercase tracking-[0.13em] text-[#77736c] sm:px-9">
          <span>Личный журнал / Кинематограф</span>
          <span>Интернет-издание · 2008</span>
        </div>

        <header className="px-5 pb-7 pt-9 sm:px-9 sm:pt-12">
          <div className="border-b-[3px] border-[#242321] pb-6">
            <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#77736c]">
              <span>Авторские заметки</span>
              <span>Кино / Культура / Жизнь</span>
            </div>

            <h1 className="journal-title text-5xl leading-[0.9] sm:text-7xl lg:text-[90px]">
              Увядшие подсолнухи
            </h1>

            <div className="mt-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <p className="font-serif text-sm italic text-[#77736c]">
                «Каждый фильм оставляет что-то после себя»
              </p>

              <span className="text-[10px] uppercase tracking-[0.15em] text-[#77736c]">
                Независимый киножурнал
              </span>
            </div>
          </div>


          <nav className="flex flex-wrap gap-x-7 gap-y-3 border-b border-[#c8c2b7] py-4 text-xs font-bold uppercase tracking-wider">
            <a href="#posts" className="journal-link">
              Главная
            </a>
            <a href="#archive" className="journal-link">
              Архив
            </a>
            <a href="#about" className="journal-link">
              Об авторе
            </a>
          </nav>
        </header>

        <div className="grid md:grid-cols-[minmax(0,1fr)_260px]">

          <section id="posts" className="min-w-0 px-5 pb-10 sm:px-9">

            <div className="mb-8 flex items-center justify-between border-b border-[#242321] pb-3">
              <h2 className="text-sm font-bold uppercase tracking-[0.15em]">
                Последние записи
              </h2>

              <span className="text-[10px] text-[#77736c]">
                {posts.length} публикаций
              </span>
            </div>

            {loading ? (
              <p className="py-16 text-center text-sm italic text-[#77736c]">
                Загружаем записи...
              </p>
            ) : posts.length === 0 ? (
              <p className="py-16 text-center text-sm italic text-[#77736c]">
                Пока здесь нет публикаций.
              </p>
            ) : (
              posts.map((post, index) => (
                <article key={post.id} className="journal-post py-8 first:pt-2">

                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-[10px] uppercase tracking-[0.12em] text-[#77736c]">
                    <span>
                      {formatDate(post.published_at)}
                    </span>

                    <span>
                      Запись № {posts.length - index}
                    </span>
                  </div>

                  <h3 className="mb-5 font-serif text-2xl font-bold leading-tight tracking-tight sm:text-[30px]">
                    {index === 0
                      ? "Последняя запись"
                      : `Из кинодневника · ${formatDate(post.published_at)}`}
                  </h3>

                  <div className="whitespace-pre-wrap break-words font-serif text-[15px] leading-[1.85] text-[#38332f] sm:text-base">
                    {post.text || "Публикация без текста."}
                  </div>


                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-[#c8c2b7] pt-3 text-[10px] text-[#77736c]">
                    <span>
                      {formatTime(post.published_at)}
                    </span>

                    <span>
                      Кино · Личные впечатления
                    </span>
                  </div>
                </article>
              ))
            )}
          </section>


          <aside className="journal-sidebar px-5 pb-10 pt-8 sm:px-7">

 
            <section id="about" className="mb-9">
              <h3 className="mb-4 border-b border-[#242321] pb-2 text-xs font-bold uppercase tracking-[0.15em]">
                Об авторе
              </h3>

              <div className="mb-4 border border-[#c8c2b7] bg-[#e5e1d8] p-2">
                <div className="flex aspect-[4/3] items-center justify-center bg-[#d4d0c7] text-[#77736c]">
                  <span className="text-xs italic">
                    Фотография автора
                  </span>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-[#55504a]">
                Авторские размышления о кинематографе,
                просмотренных фильмах и впечатлениях,
                которые остаются после просмотра.
              </p>
            </section>


            <section className="mb-9">
              <h3 className="mb-3 border-b border-[#242321] pb-2 text-xs font-bold uppercase tracking-[0.15em]">
                Где меня найти
              </h3>

              <p className="mb-3 text-xs leading-relaxed text-[#77736c]">
                Больше записей и обсуждений — в Telegram.
              </p>

              <a
                href="https://t.me/"
                target="_blank"
                rel="noreferrer"
                className="journal-link text-sm"
              >
                Мой Telegram →
              </a>
            </section>

      
            <section id="archive" className="mb-9">
              <h3 className="mb-3 border-b border-[#242321] pb-2 text-xs font-bold uppercase tracking-[0.15em]">
                Архив записей
              </h3>

              {posts.length > 0 ? (
                <ul className="space-y-2 text-xs text-[#55504a]">
                  {Array.from(
                    new Set(
                      posts.map((post) =>
                        new Date(post.published_at).getFullYear()
                      )
                    )
                  ).map((year) => (
                    <li key={year}>
                      <span className="journal-link">
                        {year}
                      </span>
                      {" "}({posts.filter(
                        (post) =>
                          new Date(post.published_at).getFullYear() === year
                      ).length})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs italic text-[#77736c]">
                  Архив пока пуст.
                </p>
              )}
            </section>

          
            <section>
              <h3 className="mb-3 border-b border-[#242321] pb-2 text-xs font-bold uppercase tracking-[0.15em]">
                О журнале
              </h3>

              <p className="text-xs leading-relaxed text-[#77736c]">
                Небольшое пространство для больших
                впечатлений. Без рейтингов, алгоритмов
                и спешки. Просто кино и мысли о нём.
              </p>
            </section>

          </aside>
        </div>

 
        <footer className="border-t-[3px] border-[#242321] px-5 py-6 sm:px-9">
          <div className="flex flex-col justify-between gap-3 text-[10px] uppercase tracking-[0.12em] text-[#77736c] sm:flex-row">
            <span>© 2008–2026 · После титров</span>
            <span>Личный киножурнал</span>
          </div>
        </footer>

      </div>
    </div>
  );
}

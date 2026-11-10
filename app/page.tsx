import Posts from "./components/Posts";



export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">
        Telegram Posts
      </h1>

      <Posts />
    </main>
  );
}

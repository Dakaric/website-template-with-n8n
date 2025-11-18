export default function Header() {
  return (
    <header className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/50">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <a href="/" className="text-lg font-semibold">AI Automations Kurs</a>
        <nav className="flex items-center gap-6 text-sm">
          <a href="/" className="hover:underline">Start</a>
          <a href="/blog" className="hover:underline">Blog</a>
        </nav>
      </div>
    </header>
  );
}



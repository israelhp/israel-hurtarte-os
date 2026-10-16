import { SITE } from "@/lib/site";

// Phase 1 placeholder. The desktop shell lands in Phase 3 (PORT-DESKTOP-001).
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="font-mono text-4xl font-semibold tracking-tight">{SITE.name}</h1>
    </main>
  );
}

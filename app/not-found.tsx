import type { Metadata } from "next";
import { Button } from "@/components/ui";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="mt-[76px] bg-ink">
      <div className="container-x py-24 text-center">
        <p className="eyebrow text-white/60">404</p>
        <h1 className="mt-3 text-[34px] font-bold text-white">This page doesn&apos;t exist</h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-white/70">Try the fleet or the locations we serve.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/cars/" variant="light">Our cars</Button>
          <Button href="/rent-a-car/" variant="ghost-dark">Locations</Button>
        </div>
      </div>
    </main>
  );
}

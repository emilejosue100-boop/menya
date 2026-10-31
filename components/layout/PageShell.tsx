import { type ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="w-full">
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-16 flex flex-col gap-12 md:gap-16">
        {children}
      </div>
    </main>
  );
}

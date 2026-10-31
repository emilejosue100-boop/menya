"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  if (isLogin) {
    return (
      <>
        <div className="flex-1 bg-background">{children}</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="flex-1 w-full pt-[72px] pb-16 lg:pb-0 bg-background min-h-[calc(100vh-72px)]">{children}</div>
      <Footer />
      <BottomNav />
    </>
  );
}

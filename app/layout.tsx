import type { Metadata } from "next";
import { Inter, Nunito, Nunito_Sans } from "next/font/google";
import { AppLayoutShell } from "@/components/layout/AppLayoutShell";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-nunito",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-nunito-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Menya — Cancer Support",
  description: "Empowering families across Africa with cancer knowledge, survivor circles, and local care.",
  icons: {
    icon: "/images/logo-mark.svg",
    shortcut: "/images/logo-mark.svg",
    apple: "/images/logo-mark.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${nunitoSans.variable} ${nunito.variable} ${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AppLayoutShell>{children}</AppLayoutShell>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Caveat, Inter } from "next/font/google";
import { CrayonDefs } from "@/components/art/CrayonDefs";
import { CursorLabel } from "@/components/shell/CursorLabel";
import { Header } from "@/components/shell/Header";
import { HeaderVeil } from "@/components/shell/HeaderVeil";
import { Loader } from "@/components/shell/Loader";
import { RevealObserver } from "@/components/shell/RevealObserver";
import { ScrollManager } from "@/components/shell/ScrollManager";
import { ShellScript } from "@/components/shell/ShellScript";
import { meta } from "@/content/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const caveat = Caveat({ subsets: ["latin"], weight: ["500"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: { default: meta.title, template: "%s — Nick Nguyen" },
  description: meta.description,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${caveat.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <ShellScript />
      </head>
      <body>
        <CrayonDefs />
        <Loader />
        <HeaderVeil />
        <Header />
        {children}
        <CursorLabel />
        <RevealObserver />
        <ScrollManager />
      </body>
    </html>
  );
}

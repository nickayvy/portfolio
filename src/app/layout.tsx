import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CursorFx } from "@/components/cursor-fx";
import { SiteLoader } from "@/components/site-loader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "nickayy",
  description: "Portfolio of nickayy",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} is-booting h-full scroll-smooth antialiased [&.is-booting]:overflow-hidden`}>
      <body className="min-h-full font-sans">
        <SiteLoader />
        {children}
        <CursorFx />
      </body>
    </html>
  );
}

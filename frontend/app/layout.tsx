import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { clsx } from "clsx";
import Providers from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AURA | Personal Focus & Well-Being",
  description: "Optimize your environment. Transform yourself.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={clsx(
          inter.variable,
          "min-h-screen bg-background font-sans text-foreground antialiased"
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

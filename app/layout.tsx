import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Jira Clone",
  description: "A simple Jira clone built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased">
        <Providers>
          <Sidebar />
          <div className="pl-64 min-h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

import "@/app/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WORKFLEX",
  description: "Employee and project management",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { CodegenProvider } from "@/components/providers/codegen-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codegen Agent Dashboard",
  description: "Autonomous Codegen Agent Dashboard - Next.js app with comprehensive Codegen API integration, statistics visualization, and automated development workflows",
  keywords: ["codegen", "ai", "automation", "dashboard", "development", "nextjs"],
  authors: [{ name: "Codegen Team" }],
  creator: "Codegen Agent Dashboard",
  publisher: "Codegen",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <QueryProvider>
          <CodegenProvider>
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">
                {children}
              </div>
            </div>
          </CodegenProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./icon-fix.css";
import { ClerkProvider } from "@clerk/nextjs";
import ClientLayout from "@/components/client-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital Evidence Metadata Viewer",
  description: "A forensic tool for analyzing files and extracting metadata",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`${inter.className} h-full`}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}

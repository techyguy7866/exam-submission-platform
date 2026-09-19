import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ZKExam — Confidential Exam Submission on Midnight Network",
  description: "Submit exam answers with complete privacy using zero-knowledge proofs on Midnight Network. Your answers, identity, and scores stay private.",
  keywords: ["Midnight Network", "ZK proofs", "privacy", "exam submission", "blockchain", "Compact"],
  openGraph: {
    title: "ZKExam — Confidential Exam Submission Platform",
    description: "Privacy-preserving exam submission powered by Midnight Network zero-knowledge proofs.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

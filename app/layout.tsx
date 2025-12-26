import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "Cangkir - Shape to Your Idea",
  description: "Cangkir adalah startup teknologi yang menghadirkan solusi digital indah untuk bisnis dan dunia. Kami melayani jasa pembuatan website premium, pengembangan produk, dan transformasi digital yang berfokus pada estetika dan fungsi.",
  keywords: ["jasa pembuatan website", "solusi digital", "startup teknologi", "web design", "software house", "digital crafting", "aplikasi web"],
  authors: [{ name: "Cangkir Team" }],
  openGraph: {
    title: "Cangkir - Shape to Your Idea",
    description: "Menghadirkan solusi digital indah untuk bisnis dan dunia. Jasa pembuatan website premium dan inovasi teknologi.",
    type: "website",
    locale: "id_ID",
    siteName: "Cangkir",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cangkir - Shape to Your Idea",
    description: "Menghadirkan solusi digital indah untuk bisnis dan dunia.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://cangkir.eproject.tech"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

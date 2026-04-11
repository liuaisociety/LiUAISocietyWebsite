import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LiU AI Society",
  description: "A student association at Linköping University devoted to artificial intelligence.",
  metadataBase: new URL("https://liuais.se"),
  openGraph: {
    title: "LiU AI Society",
    description: "A student association at Linköping University devoted to artificial intelligence.",
    url: "https://liuais.se",
    siteName: "LiU AI Society",
    images: [
      {
        url: "/images/LiUAIS.png",
        width: 1200,
        height: 630,
        alt: "LiU AI Society logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LiU AI Society",
    description: "A student association at Linköping University devoted to artificial intelligence.",
    images: ["/images/LiUAIS.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LiU AI Society",
  alternateName: "LIUAIS",
  url: "https://liuais.se",
  logo: "https://liuais.se/images/LiUAISlogo.svg",
  description:
    "A student association at Linköping University devoted to artificial intelligence.",
  sameAs: [
    "https://www.facebook.com/liuaisociety",
    "https://www.linkedin.com/company/liu-ai-society/",
    "https://www.instagram.com/liuaisociety/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

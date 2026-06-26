import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const SITE_URL = "https://certflow.example"; // EDIT: your production URL

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "CertFlow — Issue Certificates of Insurance in seconds",
  description:
    "CertFlow lets small US independent insurance agencies issue COIs instantly. Clients self-serve, additional-insured wording fills in automatically, and certificates auto-reissue at renewal. Join the waitlist.",
  keywords: [
    "certificate of insurance",
    "COI software",
    "ACORD 25",
    "additional insured",
    "independent insurance agency",
    "insurance agency software",
  ],
  openGraph: {
    title: "CertFlow — Stop typing certificates of insurance by hand",
    description:
      "Issue COIs in seconds, let clients self-serve, and auto-reissue at renewal. Built for small US independent P&C agencies. Join the waitlist.",
    type: "website",
    url: SITE_URL,
    siteName: "CertFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "CertFlow — Stop typing certificates of insurance by hand",
    description:
      "Issue COIs in seconds, let clients self-serve, and auto-reissue at renewal. Join the waitlist.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

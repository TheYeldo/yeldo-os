import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://yeldo-os.vercel.app",
  ),
  title: {
    default: "YeldoOS — Frontend Developer Portfolio",
    template: "%s · YeldoOS",
  },
  description:
    "An interactive developer portfolio presented as an original operating system in the browser.",
  applicationName: "YeldoOS",
  authors: [{ name: "Yeldo", url: "https://github.com/TheYeldo" }],
  creator: "Yeldo",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  openGraph: {
    type: "website",
    siteName: "YeldoOS",
    title: "YeldoOS — Frontend Developer Portfolio",
    description:
      "An interactive developer portfolio presented as an original operating system in the browser.",
    url: "/ru",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "YeldoOS browser desktop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YeldoOS",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}

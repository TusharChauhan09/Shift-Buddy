import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AppSessionProvider from "@/components/providers/session-provider";
import { ErrorBoundary } from "@/components/error-boundary";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shift-Buddy",
  description: "Your mutual shift guide for hostel room swaps and exchanges",
  icons: {
    icon: "/shift.png",
    apple: "/shift.png",
  },
  openGraph: {
    title: "Shift-Buddy",
    description: "Your mutual shift guide for hostel room swaps and exchanges",
    images: [
      {
        url: "/shift.png",
        width: 1200,
        height: 630,
        alt: "Shift-Buddy Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shift-Buddy",
    description: "Your mutual shift guide for hostel room swaps and exchanges",
    images: ["/shift.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <ErrorBoundary>
          <AppSessionProvider>{children}</AppSessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

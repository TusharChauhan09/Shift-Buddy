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
  title: "Shift Buddy - Your Mutual Shift Guide",
  description: "Your mutual shift guide for hostel room swaps and exchanges",
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

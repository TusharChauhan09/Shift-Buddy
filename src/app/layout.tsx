import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AppSessionProvider from "@/components/providers/session-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { ThemeProvider } from "@/components/theme-provider";

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
  metadataBase: new URL('https://shift-buddy-red.vercel.app'),
  title: "Shift-Buddy",
  description: "Your mutual shift guide for hostel room swaps and exchanges",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/shift.png", type: "image/png" },
      { url: "/shift.png", sizes: "32x32", type: "image/png" },
      { url: "/shift.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/shift.png", sizes: "180x180", type: "image/png" }],
    shortcut: [{ url: "/shift.png" }],
  },
  openGraph: {
    title: "Shift-Buddy",
    description: "Your mutual shift guide for hostel room swaps and exchanges",
    images: [
      {
        url: "/shift.png",
        width: 1200,
        height: 1200,
        alt: "Shift-Buddy Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <AppSessionProvider>{children}</AppSessionProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Inter, Inter_Tight, Playfair_Display, Crimson_Text, Outfit, DM_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const interTight = Inter_Tight({ subsets: ["latin"], display: "swap", variable: "--font-inter-tight" });
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap", variable: "--font-playfair" });
const crimson = Crimson_Text({ weight: ["400", "600"], subsets: ["latin"], display: "swap", variable: "--font-crimson" });
const outfit = Outfit({ subsets: ["latin"], display: "swap", variable: "--font-outfit" });
const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-dm-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://seamuns.site"),
  title: {
    default: "SEAMUNs | Model United Nations in South East Asia",
    template: "%s | SEAMUNs",
  },
  description: "Track upcoming and previous Model United Nations conferences across South East Asia 🌏. Find committees, chairs, and awards.",

  keywords: ["MUN", "Model United Nations", "South East Asia", "Conference", "Debate", "Diplomacy", "SEAMUN", "Delegate"],
  authors: [{ name: "SEAMUNs Team" }],
  openGraph: {
    title: "SEAMUNs | Model United Nations in South East Asia",
    description: "Track upcoming and previous Model United Nations conferences across South East Asia 🌏",
    url: "https://seamuns.site",
    siteName: "SEAMUNs",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/assets/logo.png",
        width: 800,
        height: 600,
        alt: "SEAMUNs Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEAMUNs | Model United Nations in South East Asia",
    description: "Track upcoming and previous Model United Nations conferences across South East Asia 🌏",
    images: ["/assets/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SEAMUNs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={`${inter.variable} ${interTight.variable} ${playfair.variable} ${crimson.variable} ${outfit.variable} ${dmSans.variable}`}>
        <head>
          {/* Critical font: preload for faster first render */}
          <link
            rel="preload"
            href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap"
            as="style"
          />
          <link
            href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap"
            rel="stylesheet"
          />
          {/* Font Awesome */}
          <link
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
            rel="stylesheet"
          />
        </head>
        <body>
          <ErrorBoundary>{children}</ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}


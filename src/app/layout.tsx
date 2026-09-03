import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import { SiteNav } from "@/components/site/SiteNav";
import { ChamberProvider } from "@/context/ChamberContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hut4Devs — Trails of trust",
    template: "%s · Hut4Devs",
  },
  description:
    "Community-built infrastructure for shared responsibilities, peer support, and repayments. Accommodation is where we begin.",
  icons: { icon: "/favicon.svg" },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3ede3" },
    { media: "(prefers-color-scheme: dark)", color: "#12100e" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const themeBoot = `(function(){try{var t=localStorage.getItem("hut4dev.theme");if(t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark"}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body className={`${display.variable} ${serif.variable} ${mono.variable} grain`}>
        <ThemeProvider>
          <ChamberProvider>
            <SiteNav />
            {children}
          </ChamberProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

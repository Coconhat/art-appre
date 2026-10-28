import type { Metadata, Viewport } from "next";
import { Amiri, Courier_Prime, Newsreader } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

// Newsreader was drawn for reading news on screens. Here it carries news people
// usually scroll past, set large enough that you have to slow down and read it.
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
});

// Arabic words are set in Amiri, a Naskh face, so they are never faked in Latin type.
const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

// Only the 1947 roll-call replica uses a typewriter face: it is part of that document.
const courier = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-courier",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gaano Kalayo? (How far is far?)",
  description:
    "An interactive artwork about distance, memory, and a place 8,843 kilometres from Manila.",
};

export const viewport: Viewport = {
  themeColor: "#0b1621",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${amiri.variable} ${courier.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks that scripts run, so scroll-revealed text only starts hidden when it can be revealed. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

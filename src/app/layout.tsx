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
// Only two words use it, both far down the page, so it is fetched when they need it.
const amiri = Amiri({
  subsets: ["arabic"],
  weight: "400",
  variable: "--font-amiri",
  display: "swap",
  preload: false,
});

// Only the 1947 roll-call replica uses a typewriter face: it is part of that document.
const courier = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-courier",
  display: "swap",
  preload: false,
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
        {/* Marks that scripts run, so scroll-revealed text only starts hidden when it can be
            revealed, and holds the page still until the 3D scenes are ready (LoadGate lets go;
            the timer is a safety net in case it never runs). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var d=document.documentElement;d.classList.add('js','loading');setTimeout(function(){d.classList.remove('loading')},20000)",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

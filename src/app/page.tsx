import { ChapterNav } from "@/components/ChapterNav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Threshold } from "@/components/chapters/Threshold";
import { Home } from "@/components/chapters/Home";
import { KeyChapter } from "@/components/chapters/KeyChapter";
import { Vote } from "@/components/chapters/Vote";
import { Wall } from "@/components/chapters/Wall";
import { Walk } from "@/components/chapters/Walk";
import { Count } from "@/components/chapters/Count";
import { Gallery } from "@/components/chapters/Gallery";
import { Thread } from "@/components/chapters/Thread";
import { Price } from "@/components/chapters/Price";
import { Freedom } from "@/components/chapters/Freedom";

/**
 * Gaano Kalayo? (How far is far?) An artwork in ten parts. It opens with a question and
 * a home, and lets the subject, Palestine, arrive on its own; the Philippines is in the
 * story from 1947 on, and in the price of everything by 2026. The colours of the
 * Palestinian flag are withheld until the end.
 */
export default function Page() {
  return (
    <>
      <SmoothScroll />
      <ChapterNav />
      <main>
        <Threshold />
        <Home />
        <KeyChapter />
        <Vote />
        <Wall />
        <Walk />
        <Count />
        <Gallery />
        <Thread />
        <Price />
        <Freedom />
      </main>
    </>
  );
}

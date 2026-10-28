import { DustBeam } from "@/components/art/DustBeam";
import { LoadGate } from "@/components/LoadGate";

/**
 * The first screen asks the question and nothing else. It does not say where, or who.
 * The professor's brief: build curiosity first, let the subject arrive on its own.
 */
export function Threshold() {
  return (
    <section
      id="simula"
      aria-labelledby="title"
      className="relative h-svh min-h-[560px] overflow-hidden bg-night"
    >
      <div className="absolute inset-0 animate-[beam_3.2s_var(--ease-out-expo)_both]">
        <DustBeam />
      </div>

      <div className="frame relative z-10 flex h-full flex-col justify-end pb-[13svh]">
        <h1
          id="title"
          lang="fil"
          className="t-display italic animate-[rise_2.4s_var(--ease-out-expo)_0.3s_both]"
        >
          Gaano kalayo?
        </h1>
        <p className="t-statement measure mt-5 md:mt-7 animate-[rise_2.4s_var(--ease-out-expo)_0.75s_both]">
          How far is far? A work of art about a real place, in ten parts.
        </p>
        <LoadGate className="mt-4 animate-[rise_2.4s_var(--ease-out-expo)_1.1s_both]" />
      </div>

      <div
        aria-hidden
        className="absolute bottom-[13svh] right-[clamp(1rem,4.5vw,3.5rem)] z-10 hidden flex-col items-center gap-3 sm:flex"
      >
        <span className="t-small italic text-paper-dim [writing-mode:vertical-rl]">scroll</span>
        <span className="relative block h-16 w-px overflow-hidden bg-paper/20">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_2.6s_ease-in-out_infinite] bg-paper" />
        </span>
      </div>

      <style>{`
        @keyframes rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @keyframes beam { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cue { from { transform: translateY(-100%); } to { transform: translateY(200%); } }
      `}</style>
    </section>
  );
}

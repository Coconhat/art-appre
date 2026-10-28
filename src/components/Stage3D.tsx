"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = Omit<CanvasProps, "children"> & {
  children: ReactNode;
  /** What the scene shows, for people who cannot see it. */
  label: string;
  className?: string;
};

/**
 * A WebGL canvas that only exists while its chapter is near the screen and only
 * renders while the chapter is on it, so at most two scenes ever hold the GPU.
 */
export function Stage3D({ children, label, className = "stage-canvas", ...canvas }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const host = ref.current?.closest("section") ?? ref.current;
    if (!host) return;
    const nearObserver = new IntersectionObserver(([e]) => setNear(e.isIntersecting), {
      rootMargin: "120% 0px",
    });
    const visibleObserver = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    nearObserver.observe(host);
    visibleObserver.observe(host);
    return () => {
      nearObserver.disconnect();
      visibleObserver.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={className} role="img" aria-label={label}>
      {near && (
        <Canvas
          dpr={[1, 1.75]}
          gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
          frameloop={visible ? "always" : "never"}
          {...canvas}
        >
          {children}
        </Canvas>
      )}
    </div>
  );
}

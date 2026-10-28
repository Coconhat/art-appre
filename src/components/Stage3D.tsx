"use client";

import { Canvas, useThree, type CanvasProps } from "@react-three/fiber";
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
  // Phone screens have three pixels to every point; past one and a half the scene only gets
  // slower. (Scenes are client-only, loaded with ssr: false, so the screen can be asked here.)
  const [dpr] = useState<[number, number]>(() =>
    window.matchMedia("(max-width: 767px), (pointer: coarse)").matches ? [1, 1.5] : [1, 1.75],
  );

  useEffect(() => {
    const host = ref.current?.closest("section") ?? ref.current;
    if (!host) return;
    const nearObserver = new IntersectionObserver(([e]) => setNear(e.isIntersecting), {
      rootMargin: "150% 0px",
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
          dpr={dpr}
          gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
          frameloop={visible ? "always" : "never"}
          {...canvas}
        >
          {children}
          <Warmup />
        </Canvas>
      )}
    </div>
  );
}

/**
 * Compiles the scene's shaders and draws one frame as soon as the canvas exists, while its
 * chapter is still below the screen, so the scene is already there when it scrolls in.
 */
function Warmup() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const advance = useThree((s) => s.advance);

  useEffect(() => {
    let live = true;
    gl.compileAsync(scene, camera)
      .catch(() => undefined)
      .then(() => {
        if (live) advance(performance.now());
      });
    return () => {
      live = false;
    };
  }, [gl, scene, camera, advance]);

  return null;
}

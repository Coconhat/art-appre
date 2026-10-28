"use client";

import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Stage3D } from "@/components/Stage3D";
import { follow, mulberry32, smoothstep } from "@/lib/random";
import { CHILD_SHARE, TOTAL, countAt } from "./countData";

type Props = { progress: RefObject<number> };

export default function LightsStage({ progress }: Props) {
  return (
    <Stage3D
      label="A field of small flickering lights, like candles, growing from one light to tens of thousands. The children's lights are smaller."
      camera={{ position: [0, 1, 2], fov: 42, near: 0.01, far: 500 }}
    >
      <Lights progress={progress} />
    </Stage3D>
  );
}

const SPREAD = 0.24; // distance between neighbouring candles

const vertex = /* glsl */ `
  attribute float aIndex;
  attribute float aRand;
  attribute float aChild;
  uniform float uCount;
  uniform float uTime;
  uniform float uChildren;
  uniform float uSize;
  varying float vAlpha;
  varying float vChild;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float lit = clamp(uCount - aIndex, 0.0, 1.0);
    float flicker = 0.72 + 0.28 * sin(uTime * (1.4 + aRand * 2.6) + aRand * 40.0);
    float size = uSize * mix(1.0, 0.6, aChild) * (0.85 + aRand * 0.3);
    gl_PointSize = clamp(size / -mv.z, 1.5, 170.0) * step(0.001, lit);
    float focus = mix(1.0, mix(0.16, 1.35, aChild), uChildren);
    vAlpha = lit * flicker * focus;
    vChild = aChild;
  }
`;

const fragment = /* glsl */ `
  uniform float uChildren;
  varying float vAlpha;
  varying float vChild;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float glow = pow(smoothstep(0.5, 0.0, d), 2.0);
    vec3 warm = vec3(1.0, 0.76, 0.42);
    vec3 pale = vec3(1.0, 0.93, 0.82);
    vec3 col = mix(warm, pale, vChild * uChildren);
    float a = glow * vAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(col * a, a);
  }
`;

let field: THREE.BufferGeometry | null = null;

/** Lays out every light once, ahead of time (see LoadGate); later mounts reuse the field. */
export function prepare() {
  field ??= buildField();
  return field;
}

function buildField() {
  const rand = mulberry32(74561);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const positions = new Float32Array(TOTAL * 3);
  const index = new Float32Array(TOTAL);
  const randoms = new Float32Array(TOTAL);
  const child = new Float32Array(TOTAL);
  for (let i = 0; i < TOTAL; i++) {
    // phyllotaxis: each new light takes the next place on a spiral, so the field grows evenly outward
    const r = SPREAD * Math.sqrt(i + 0.5);
    const a = i * golden;
    positions[i * 3] = Math.cos(a) * r + (rand() - 0.5) * SPREAD * 0.4;
    positions[i * 3 + 1] = (rand() - 0.5) * 0.04;
    positions[i * 3 + 2] = Math.sin(a) * r + (rand() - 0.5) * SPREAD * 0.4;
    index[i] = i;
    randoms[i] = rand();
    child[i] = i > 0 && rand() < CHILD_SHARE ? 1 : 0;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  g.setAttribute("aIndex", new THREE.BufferAttribute(index, 1));
  g.setAttribute("aRand", new THREE.BufferAttribute(randoms, 1));
  g.setAttribute("aChild", new THREE.BufferAttribute(child, 1));
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), SPREAD * Math.sqrt(TOTAL) + 1);
  return g;
}

function Lights({ progress }: Props) {
  const { camera, size } = useThree();
  const smooth = useRef(0);
  const geometry = prepare();

  // Built here rather than as JSX so the uniforms updated each frame are the material's own.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uCount: { value: 0 },
          uTime: { value: 0 },
          uChildren: { value: 0 },
          uSize: { value: 30 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );
  const uniforms = material.uniforms;

  useFrame((state, delta) => {
    smooth.current = follow(smooth.current, progress.current ?? 0, 3, delta);
    const p = smooth.current;
    const count = countAt(p);
    uniforms.uCount.value = count;
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uChildren.value = smoothstep(0.75, 0.79, p) * (1 - smoothstep(0.85, 0.89, p));
    // sized from the spacing between candles as it appears on screen, so the field reads at every distance
    const projection = (size.height * state.gl.getPixelRatio()) / (2 * Math.tan((42 * Math.PI) / 360));
    uniforms.uSize.value = projection * SPREAD * 2.6;

    // The camera steps back as the field grows, so every stage of the count fills the screen.
    const radius = SPREAD * Math.sqrt(Math.max(count, 1)) + 0.35;
    const dist = radius * (size.width < size.height ? 3.4 : 2.3);
    camera.position.set(0, dist * 0.62, dist * 0.8);
    camera.lookAt(0, -radius * 0.05, 0);
  });

  return (
    <points geometry={geometry} material={material} frustumCulled={false} />
  );
}

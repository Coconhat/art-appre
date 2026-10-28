"use client";

import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Stage3D } from "@/components/Stage3D";
import { follow, smoothstep } from "@/lib/random";
import landDots from "@/data/land-dots.json";

type Props = { progress: RefObject<number> };

const R = 2;
const DEG = Math.PI / 180;

export const PINS = {
  manila: { name: "Manila", lat: 14.6, lon: 120.98 },
  gaza: { name: "Gaza", lat: 31.5, lon: 34.47 },
  israel: { name: "Israel", lat: 32.08, lon: 34.78 },
  newYork: { name: "New York, 1947", lat: 40.74, lon: -73.84 },
  redSea: { name: "Red Sea", lat: 14.2, lon: 42.2 },
} as const;

type Pin = (typeof PINS)[keyof typeof PINS];

/** Each thread: where it starts and ends, how high it arcs, and when (chapter progress) it is sewn. */
const THREADS: { from: Pin; to: Pin; lift: number; sew: [number, number] }[] = [
  { from: PINS.manila, to: PINS.gaza, lift: 0.2, sew: [0.14, 0.22] },
  { from: PINS.newYork, to: PINS.gaza, lift: 0.24, sew: [0.3, 0.37] },
  { from: PINS.manila, to: PINS.israel, lift: 0.3, sew: [0.4, 0.46] },
  { from: PINS.manila, to: PINS.redSea, lift: 0.14, sew: [0.64, 0.7] },
];

/** Where the globe faces, by chapter progress: [p, lat, lon, zoom]. */
const VIEWS: [number, number, number, number][] = [
  [0, 14.6, 121, 1],
  [0.12, 14.6, 121, 1],
  [0.22, 24, 78, 0.92],
  [0.28, 24, 78, 0.92],
  [0.34, 38, -20, 0.9],
  [0.38, 38, -20, 0.9],
  [0.44, 30, 40, 1.18],
  [0.62, 30, 40, 1.18],
  [0.68, 18, 72, 1],
  [0.76, 18, 72, 1],
  [0.82, 14.6, 121, 1.08],
  [0.9, 22, 80, 0.9],
];

function viewAt(p: number) {
  let i = 1;
  while (i < VIEWS.length - 1 && p > VIEWS[i][0]) i++;
  const [a, la1, lo1, z1] = VIEWS[i - 1];
  const [b, la2, lo2, z2] = VIEWS[i];
  const t = smoothstep(a, b, p);
  let dLon = lo2 - lo1;
  if (dLon > 180) dLon -= 360;
  if (dLon < -180) dLon += 360;
  return { lat: la1 + (la2 - la1) * t, lon: lo1 + dLon * t, zoom: z1 + (z2 - z1) * t };
}

export function toXYZ(lat: number, lon: number, r = R) {
  const la = lat * DEG;
  const lo = lon * DEG;
  return new THREE.Vector3(r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo));
}

const stitchVertex = /* glsl */ `
  uniform float uSize;
  varying float vFacing;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    vec3 n = normalize(normalMatrix * position);
    vFacing = dot(n, normalize(-mv.xyz));
    gl_PointSize = uSize / -mv.z;
  }
`;

const stitchFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vFacing;
  void main() {
    if (vFacing < 0.02) discard;
    vec2 p = gl_PointCoord - 0.5;
    float line = min(abs(p.x - p.y), abs(p.x + p.y));
    float a = smoothstep(0.13, 0.05, line) * step(length(p), 0.46) * smoothstep(0.02, 0.35, vFacing);
    if (a < 0.02) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

const threadVertex = /* glsl */ `
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vFacing = dot(normalize(normalMatrix * position), normalize(-mv.xyz));
    gl_Position = projectionMatrix * mv;
  }
`;

const threadFragment = /* glsl */ `
  uniform float uDraw;
  uniform float uDashes;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    if (vUv.x > uDraw) discard;
    // a running stitch: thread above the cloth, then under it
    if (fract(vUv.x * uDashes) > 0.62) discard;
    float shade = 0.7 + 0.3 * sin(vUv.y * 6.2831);
    gl_FragColor = vec4(uColor * shade * mix(0.55, 1.0, smoothstep(-0.2, 0.3, vFacing)), 1.0);
  }
`;

const clothVertex = /* glsl */ `
  varying vec3 vN;
  varying vec3 vView;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const clothFragment = /* glsl */ `
  varying vec3 vN;
  varying vec3 vView;
  varying vec2 vUv;
  void main() {
    float rim = pow(1.0 - max(dot(vN, vView), 0.0), 2.5);
    float weave = 0.5 + 0.5 * sin(vUv.x * 1600.0) * sin(vUv.y * 800.0);
    vec3 base = vec3(0.075, 0.095, 0.125) + weave * 0.012;
    gl_FragColor = vec4(base + rim * vec3(0.16, 0.2, 0.26), 1.0);
  }
`;

export default function GlobeStage({ progress, labels }: Props & { labels: RefObject<(HTMLElement | null)[]> }) {
  return (
    <Stage3D
      label="A globe embroidered in cross-stitch on dark cloth. Red running-stitch threads are sewn from Manila to Gaza, from New York to Gaza, from Manila to Israel and from Manila to the Red Sea."
      camera={{ position: [0, 0, 6.6], fov: 34 }}
    >
      <Globe progress={progress} labels={labels} />
    </Stage3D>
  );
}

function buildStitches() {
  const dots = landDots as number[];
  const positions = new Float32Array((dots.length / 2) * 3);
  for (let i = 0; i < dots.length; i += 2) {
    const v = toXYZ(dots[i], dots[i + 1], R * 1.002);
    positions.set([v.x, v.y, v.z], (i / 2) * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return g;
}

/** Each thread's arc as a tube, and how many stitches it is sewn with. */
function buildThreads() {
  return THREADS.map((t) => {
    const a = toXYZ(t.from.lat, t.from.lon, 1).normalize();
    const b = toXYZ(t.to.lat, t.to.lon, 1).normalize();
    const angle = a.angleTo(b);
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 80; i++) {
      const s = i / 80;
      // slerp along the great circle, lifted off the cloth in the middle
      const v = new THREE.Vector3()
        .copy(a)
        .multiplyScalar(Math.sin((1 - s) * angle) / Math.sin(angle))
        .add(b.clone().multiplyScalar(Math.sin(s * angle) / Math.sin(angle)));
      pts.push(v.multiplyScalar(R * (1.004 + Math.sin(Math.PI * s) * t.lift * Math.min(1, angle))));
    }
    const geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 260, 0.014, 6, false);
    return { geometry, dashes: Math.round(angle * 60), sew: t.sew };
  });
}

let built: { stitches: THREE.BufferGeometry; threads: ReturnType<typeof buildThreads> } | null = null;

/** Embroiders the land and lays the threads once, ahead of time (see LoadGate); later mounts reuse them. */
export function prepare() {
  built ??= { stitches: buildStitches(), threads: buildThreads() };
  return built;
}

function Globe({ progress, labels }: Props & { labels: RefObject<(HTMLElement | null)[]> }) {
  const { camera, size } = useThree();
  const group = useRef<THREE.Group>(null);
  const smooth = useRef(0);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const normal = useMemo(() => new THREE.Vector3(), []);
  const { stitches, threads: arcs } = prepare();

  // Materials are built here, not as JSX, so the uniforms updated every frame are the ones on the GPU.
  // Shader colours are written as display (sRGB) values, since raw shaders skip colour conversion.
  const stitchMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: stitchVertex,
        fragmentShader: stitchFragment,
        uniforms: { uSize: { value: 60 }, uColor: { value: new THREE.Vector3(0.86, 0.8, 0.69) } },
        transparent: true,
        depthWrite: false,
      }),
    [],
  );

  const threads = useMemo(
    () =>
      arcs.map(({ geometry, dashes, sew }) => {
        const material = new THREE.ShaderMaterial({
          vertexShader: threadVertex,
          fragmentShader: threadFragment,
          uniforms: {
            uDraw: { value: 0 },
            uDashes: { value: dashes },
            uColor: { value: new THREE.Vector3(0.82, 0.11, 0.2) },
          },
        });
        return { geometry, material, sew };
      }),
    [arcs],
  );

  const pins = useMemo(() => Object.values(PINS).map((p) => toXYZ(p.lat, p.lon, R * 1.01)), []);

  useFrame((state, delta) => {
    smooth.current = follow(smooth.current, progress.current ?? 0, 2.4, delta);
    const p = smooth.current;
    const view = viewAt(p);
    const drift = smoothstep(0.92, 1, p) * state.clock.elapsedTime * 0.02;
    if (group.current) {
      group.current.rotation.set(view.lat * DEG, -view.lon * DEG - drift, 0, "XYZ");
      const wide = size.width >= 768;
      group.current.position.set(wide ? 1.3 : 0, wide ? 0 : 1.0, 0);
      group.current.scale.setScalar(view.zoom * (wide ? 0.8 : 0.5));
      group.current.updateMatrixWorld();
    }
    stitchMaterial.uniforms.uSize.value = 52 * state.gl.getPixelRatio() * (size.height / 900);
    threads.forEach((t) => {
      t.material.uniforms.uDraw.value = smoothstep(t.sew[0], t.sew[1], p);
    });

    // place names, kept on the visible face of the globe
    Object.values(PINS).forEach((pin, i) => {
      const el = labels.current?.[i];
      if (!el || !group.current) return;
      tmp.copy(pins[i]).applyMatrix4(group.current.matrixWorld);
      normal.copy(tmp).sub(group.current.position).normalize();
      const facing = normal.dot(tmp.clone().sub(camera.position).normalize().negate());
      tmp.project(camera);
      const shown = facing > 0.15 && labelVisible(i, p);
      el.style.opacity = shown ? "1" : "0";
      el.style.transform = `translate(${(tmp.x * 0.5 + 0.5) * size.width}px, ${(-tmp.y * 0.5 + 0.5) * size.height}px)`;
    });
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[R, 96, 64]} />
        <shaderMaterial vertexShader={clothVertex} fragmentShader={clothFragment} />
      </mesh>
      <points geometry={stitches} material={stitchMaterial} />
      {threads.map((t, i) => (
        <mesh key={i} geometry={t.geometry} material={t.material} />
      ))}
      {/* French knots where the threads are tied off */}
      {pins.map((v, i) => (
        <mesh key={i} position={v}>
          <sphereGeometry args={[0.03, 12, 10]} />
          <meshBasicMaterial color="#d11d36" />
        </mesh>
      ))}
    </group>
  );
}

/** Which place names are on the cloth at each point in the chapter. */
function labelVisible(i: number, p: number) {
  const key = Object.keys(PINS)[i] as keyof typeof PINS;
  switch (key) {
    case "manila":
      return p < 0.3 || p > 0.62;
    case "gaza":
      return (p > 0.18 && p < 0.41) || (p > 0.52 && p < 0.64);
    case "newYork":
      return p > 0.3 && p < 0.42;
    case "israel":
      return p > 0.42 && p < 0.52;
    case "redSea":
      return p > 0.66 && p < 0.8;
    default:
      return false;
  }
}

"use client";

import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Stage3D } from "@/components/Stage3D";
import { ambient } from "@/lib/audio";
import { clamp01, follow, lerp, mulberry32, smoothstep } from "@/lib/random";

type Props = { progress: RefObject<number> };

export default function KeyStage({ progress }: Props) {
  return (
    <Stage3D
      label="A rusted iron house key, turning slowly in a beam of lamplight, then turning once as if in a lock."
      camera={{ position: [0, 0.15, 7.2], fov: 32 }}
    >
      <KeyScene progress={progress} />
    </Stage3D>
  );
}

/** Iron that has spent 78 years in a pocket, a drawer, a tin box: rust grows from object-space noise. */
function makeRustMaterial() {
  const material = new THREE.MeshStandardMaterial({ color: "#2a2724", metalness: 0.85, roughness: 0.5 });
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vObj;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvObj = position;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        varying vec3 vObj;
        float h3(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
        float vn(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
                     mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z); }
        float fbm(vec3 p){ float a = 0.5; float s = 0.0; for (int i = 0; i < 5; i++) { s += a * vn(p); p *= 2.03; a *= 0.5; } return s; }`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        float rust = smoothstep(0.42, 0.72, fbm(vObj * 3.1));
        float pits = smoothstep(0.58, 0.92, fbm(vObj * 15.0 + 4.0));
        vec3 iron = vec3(0.13, 0.125, 0.12);
        vec3 rustCol = mix(vec3(0.36, 0.15, 0.06), vec3(0.62, 0.31, 0.12), fbm(vObj * 7.0));
        diffuseColor.rgb = mix(iron, rustCol, rust * 0.9) * (1.0 - pits * 0.45);`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
        roughnessFactor = mix(0.34, 0.95, rust);`,
      )
      .replace(
        "#include <metalnessmap_fragment>",
        `#include <metalnessmap_fragment>
        metalnessFactor = mix(0.92, 0.2, rust);`,
      );
  };
  return material;
}

function buildKey() {
  const hole = (x: number, y: number, r: number) => {
    const p = new THREE.Path();
    p.absarc(x, y, r, 0, Math.PI * 2, true);
    return p;
  };

  // The bow: a ring pierced with four petals around a centre, like the keys of old stone houses.
  const bowShape = new THREE.Shape();
  bowShape.absarc(0, 0, 0.72, 0, Math.PI * 2, false);
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 + Math.PI / 4;
    bowShape.holes.push(hole(Math.cos(a) * 0.31, Math.sin(a) * 0.31, 0.155));
  }
  bowShape.holes.push(hole(0, 0, 0.06));
  const bow = new THREE.ExtrudeGeometry(bowShape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.045,
    bevelSize: 0.045,
    bevelSegments: 4,
    curveSegments: 56,
  });
  bow.translate(-1.92, 0, -0.06);

  const neck = new THREE.CylinderGeometry(0.15, 0.1, 0.44, 28);
  neck.rotateZ(Math.PI / 2);
  neck.translate(-1.08, 0, 0);

  const collarA = new THREE.TorusGeometry(0.118, 0.034, 14, 44);
  collarA.rotateY(Math.PI / 2);
  collarA.translate(-0.84, 0, 0);
  const collarB = collarA.clone();
  collarB.translate(0.11, 0, 0);

  const shank = new THREE.CylinderGeometry(0.082, 0.082, 2.3, 32);
  shank.rotateZ(Math.PI / 2);
  shank.translate(0.3, 0, 0);

  const tip = new THREE.SphereGeometry(0.083, 24, 14);
  tip.translate(1.45, 0, 0);

  // The bit, cut with the wards that only one lock in the world would accept.
  const outline: [number, number][] = [
    [0, 0], [0.56, 0], [0.56, -0.6], [0.45, -0.6], [0.45, -0.46], [0.34, -0.46],
    [0.34, -0.6], [0.22, -0.6], [0.22, -0.38], [0.11, -0.38], [0.11, -0.6], [0, -0.6],
  ];
  const bitShape = new THREE.Shape();
  bitShape.moveTo(...outline[0]);
  outline.slice(1).forEach(([x, y]) => bitShape.lineTo(x, y));
  bitShape.closePath();
  const slot = new THREE.Path();
  slot.moveTo(0.16, -0.12);
  slot.lineTo(0.16, -0.21);
  slot.lineTo(0.4, -0.21);
  slot.lineTo(0.4, -0.12);
  slot.closePath();
  bitShape.holes.push(slot);
  const bit = new THREE.ExtrudeGeometry(bitShape, {
    depth: 0.09,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
  });
  bit.translate(0.86, 0.03, -0.045);

  return [bow, neck, collarA, collarB, shank, tip, bit].map((g) => {
    g.translate(0.55, 0, 0); // centre the key on its own length
    return g;
  });
}

function makeDust(count: number) {
  const rand = mulberry32(1948);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (rand() - 0.5) * 7;
    positions[i * 3 + 1] = (rand() - 0.5) * 4.5;
    positions[i * 3 + 2] = (rand() - 0.5) * 3;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const material = new THREE.PointsMaterial({
    size: 0.035,
    map: new THREE.CanvasTexture(c),
    color: "#f5d29a",
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geometry, material);
}

let built: { parts: THREE.BufferGeometry[]; dust: THREE.Points } | null = null;

/** Builds the key and its dust once, ahead of time (see LoadGate); later mounts reuse them. */
export function prepare() {
  built ??= { parts: buildKey(), dust: makeDust(420) };
  return built;
}

function KeyScene({ progress }: Props) {
  const place = useRef<THREE.Group>(null);
  const showcase = useRef<THREE.Group>(null);
  const turn = useRef<THREE.Group>(null);
  const spot = useRef<THREE.SpotLight>(null);
  const smooth = useRef(0);
  const clicked = useRef(false);
  const { viewport, camera } = useThree();

  const { parts, dust } = prepare();
  const material = useMemo(() => makeRustMaterial(), []);
  const target = useMemo(() => new THREE.Object3D(), []);
  const wide = viewport.aspect > 1.15;

  useFrame((state, delta) => {
    smooth.current = follow(smooth.current, progress.current ?? 0, 3.2, delta);
    const p = smooth.current;
    const t = state.clock.elapsedTime;

    if (place.current) {
      // The key gets the right half of a wide screen, the upper half of a phone. A phone's
      // width is all there is, so it is sized to still fit when the camera moves in at the end.
      const room = wide ? viewport.width * 0.5 : viewport.width;
      place.current.scale.setScalar(Math.min(0.7, room / (wide ? 4.7 : 5.6)));
      place.current.position.set(
        wide ? viewport.width * 0.25 : 0,
        (wide ? 0 : viewport.height * 0.2) + Math.sin(t * 0.7) * 0.04,
        0,
      );
      target.position.copy(place.current.position);
    }

    // Shown from every side, then settling side-on to the viewer.
    const spin = clamp01(p / 0.84);
    const eased = spin * spin * (3 - 2 * spin);
    if (showcase.current) {
      showcase.current.rotation.y = lerp(-0.9, Math.PI * 2, eased);
      showcase.current.rotation.x = Math.sin(spin * Math.PI * 2) * 0.22 * (1 - eased);
    }

    // At the end it turns once, the way it would in its own lock.
    const lock = smoothstep(0.86, 0.95, p);
    if (turn.current) turn.current.rotation.x = -lock * (Math.PI / 2);
    if (lock > 0.98 && !clicked.current) {
      clicked.current = true;
      ambient.click();
    } else if (lock < 0.5) {
      clicked.current = false;
    }

    if (spot.current) spot.current.intensity = 80 + lock * 60;
    camera.position.z = lerp(7.2, 6.1, p);

    const pos = dust.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i) + delta * 0.05;
      if (y > 2.25) y = -2.25;
      pos.setY(i, y);
      pos.setX(i, pos.getX(i) + Math.sin(t * 0.3 + i) * delta * 0.01);
    }
    pos.needsUpdate = true;
  });

  return (
    <>
      <ambientLight intensity={0.12} color="#9fb4d0" />
      <primitive object={target} />
      <spotLight
        ref={spot}
        position={[-2.4, 4.6, 4.2]}
        angle={0.42}
        penumbra={0.9}
        intensity={80}
        decay={2}
        color="#ffd59a"
        target={target}
      />
      <pointLight position={[3.5, -1.2, -2.6]} intensity={7} color="#7090d0" />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2.6} color="#ffd9a0" scale={[3, 5, 1]} position={[-3, 2, 3]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.7} color="#5d7fb8" scale={[6, 2, 1]} position={[3, -2, -3]} target={[0, 0, 0]} />
      </Environment>

      <group ref={place}>
        <group ref={showcase}>
          <group ref={turn}>
            {parts.map((geometry, i) => (
              <mesh key={i} geometry={geometry} material={material} />
            ))}
          </group>
        </group>
      </group>
      <primitive object={dust} />
    </>
  );
}

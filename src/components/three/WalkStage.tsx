"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Stage3D } from "@/components/Stage3D";
import { clamp01, follow, lerp, mulberry32, smoothstep } from "@/lib/random";
import {
  CAMPS,
  PLACES,
  SOUTH_A,
  SOUTH_B,
  TOWNS,
  eastEdge,
  inside,
  outline,
  routeAt,
} from "./walkData";

type Props = { progress: RefObject<number>; steer: RefObject<number> };
type SceneProps = Props & { labels: RefObject<(HTMLSpanElement | null)[]> };

const HAZE = "#b9b3a8";

export default function WalkStage(props: Props) {
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  // The heaviest scene: resolution drops on slow school laptops and rises again when it can.
  const [dpr, setDpr] = useState(1.5);
  return (
    <>
      <Stage3D
        label="A 3D map of the Gaza Strip seen from above and behind a small child walking south, past ruined buildings and growing camps of tents, with crowds walking the same way, until a wall at the Egyptian border."
        shadows
        dpr={dpr}
        camera={{ position: [40, 160, -60], fov: 45, near: 0.5, far: 1600 }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)} />
        <WalkScene {...props} labels={labels} />
      </Stage3D>
      {/* place names, positioned over the map each frame */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
        {PLACES.map((place, i) => (
          <span
            key={place.name}
            ref={(el) => {
              labels.current[i] = el;
            }}
            className="absolute left-0 top-0 whitespace-nowrap font-serif text-[0.95rem] italic text-ink opacity-0 [text-shadow:0_0_8px_rgba(222,216,206,0.95),0_0_2px_rgba(222,216,206,1)]"
          >
            {place.name}
          </span>
        ))}
      </div>
    </>
  );
}

function density(x: number, z: number) {
  let d = 0.07;
  for (const t of TOWNS) d += t.w * Math.exp(-((z - t.z) ** 2 + (x - t.x) ** 2) / (2 * t.s * t.s));
  return d;
}

/** Share of buildings damaged or destroyed, by area (UNOSAT puts it at about 81% overall). */
function damage(x: number, z: number) {
  if (z < 140) return 0.9;
  if (z < 280) return x < 18 ? 0.45 : 0.66;
  if (z < 345) return x < 20 ? 0.35 : 0.88;
  return 0.92;
}

function makeTown() {
  const rand = mulberry32(2023);
  const box = new THREE.BoxGeometry(1, 1, 1);
  box.translate(0, 0.5, 0);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  const standing: { m: THREE.Matrix4; c: THREE.Color }[] = [];
  const rubble: { m: THREE.Matrix4; c: THREE.Color }[] = [];

  let placed = 0;
  let guard = 0;
  while (placed < 6400 && guard++ < 400000) {
    const z = rand() * 410;
    const x = rand() * 128;
    if (!inside(x, z, 1.4)) continue;
    const d = density(x, z);
    if (rand() * 2.7 > d) continue;
    placed++;
    const city = Math.min(1, d / 2.2);
    const grid = 0.14 + (rand() - 0.5) * 0.12;
    if (rand() > damage(x, z)) {
      e.set(0, grid, 0);
      q.setFromEuler(e);
      s.set(1.1 + rand() * 2.3, 1 + rand() * (1.4 + city * 5), 1.1 + rand() * 2.3);
      p.set(x, 0, z);
      standing.push({
        m: m.compose(p, q, s).clone(),
        c: new THREE.Color().setHSL(0.08, 0.06, 0.52 + rand() * 0.16),
      });
    } else {
      const pieces = rand() < 0.45 ? 3 : 2;
      for (let k = 0; k < pieces; k++) {
        e.set((rand() - 0.5) * 0.8, grid + rand() * 1.2, (rand() - 0.5) * 0.8);
        q.setFromEuler(e);
        s.set(0.6 + rand() * 1.9, 0.18 + rand() * (0.5 + city * 0.6), 0.6 + rand() * 1.9);
        p.set(x + (rand() - 0.5) * 2.2, -0.12, z + (rand() - 0.5) * 2.2);
        rubble.push({
          m: m.compose(p, q, s).clone(),
          c: new THREE.Color().setHSL(0.07, 0.05, 0.34 + rand() * 0.2),
        });
      }
    }
  }

  const make = (list: { m: THREE.Matrix4; c: THREE.Color }[], roughness: number, windows: boolean) => {
    const material = new THREE.MeshStandardMaterial({ roughness, metalness: 0 });
    if (windows) material.onBeforeCompile = addWindows;
    const mesh = new THREE.InstancedMesh(box, material, list.length);
    list.forEach(({ m: matrix, c }, i) => {
      mesh.setMatrixAt(i, matrix);
      mesh.setColorAt(i, c);
    });
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.instanceMatrix.needsUpdate = true;
    return mesh;
  };
  return { standing: make(standing, 0.92, true), rubble: make(rubble, 1, false) };
}

/**
 * Concrete blocks become buildings: rows of dark windows on the walls, some of them
 * blown out, and scorch marks, all from world position so no textures are loaded.
 */
function addWindows(shader: THREE.WebGLProgramParametersWithUniforms) {
  shader.vertexShader = shader.vertexShader
    .replace("#include <common>", "#include <common>\nvarying vec3 vWorld;\nvarying vec3 vFaceN;")
    .replace(
      "#include <worldpos_vertex>",
      `#include <worldpos_vertex>
      vec4 wp = vec4(transformed, 1.0);
      #ifdef USE_INSTANCING
        wp = instanceMatrix * wp;
      #endif
      vWorld = (modelMatrix * wp).xyz;
      vFaceN = normal;`,
    );
  shader.fragmentShader = shader.fragmentShader
    .replace(
      "#include <common>",
      `#include <common>
      varying vec3 vWorld;
      varying vec3 vFaceN;
      float wHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }`,
    )
    .replace(
      "#include <color_fragment>",
      `#include <color_fragment>
      if (abs(vFaceN.y) < 0.5) {
        float along = abs(vFaceN.x) > 0.5 ? vWorld.z : vWorld.x;
        vec2 cell = vec2(floor(along / 0.75), floor(vWorld.y / 0.85));
        vec2 f = vec2(fract(along / 0.75), fract(vWorld.y / 0.85));
        float win = step(0.3, f.x) * step(f.x, 0.72) * step(0.35, f.y) * step(f.y, 0.8) * step(0.6, vWorld.y);
        float blown = step(0.72, wHash(cell + floor(vWorld.xz * 0.05)));
        diffuseColor.rgb *= 1.0 - win * mix(0.55, 0.85, blown);
        float scorch = smoothstep(0.55, 0.95, wHash(floor(vWorld.xz * 0.6) + floor(vWorld.y * 0.4)));
        diffuseColor.rgb *= 1.0 - scorch * 0.35;
      }`,
    );
}

function makeTents() {
  const rand = mulberry32(2024);
  const cone = new THREE.ConeGeometry(0.62, 0.72, 4, 1);
  cone.rotateY(Math.PI / 4);
  cone.translate(0, 0.36, 0);
  const items: { x: number; z: number; s: number; c: THREE.Color }[] = [];
  const white = new THREE.Color("#ece8df");
  const tarp = new THREE.Color("#5f80a6");
  const grey = new THREE.Color("#b3aea4");
  for (const camp of CAMPS) {
    for (let i = 0; i < camp.n; i++) {
      const r = camp.r * Math.sqrt(rand());
      const a = rand() * Math.PI * 2;
      // tents go up in rows, so snap them to a loose grid
      const x = Math.round((camp.x + r * Math.cos(a)) / 1.45) * 1.45 + (rand() - 0.5) * 0.3;
      const z = Math.round((camp.z + r * Math.sin(a)) / 1.6) * 1.6 + (rand() - 0.5) * 0.3;
      if (!inside(x, z, 0.8)) continue;
      const pick = rand();
      items.push({ x, z, s: 0.8 + rand() * 0.5, c: pick < 0.2 ? tarp : pick < 0.36 ? grey : white });
    }
  }
  const mesh = new THREE.InstancedMesh(
    cone,
    new THREE.MeshStandardMaterial({ roughness: 0.85, flatShading: true }),
    items.length,
  );
  const m = new THREE.Matrix4();
  items.forEach((t, i) => {
    m.makeScale(t.s, t.s, t.s);
    m.setPosition(t.x, 0, t.z);
    mesh.setMatrixAt(i, m);
    mesh.setColorAt(i, t.c);
  });
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

const CROWD = 1100;

function makeCrowd() {
  const rand = mulberry32(1310);
  const capsule = new THREE.CapsuleGeometry(0.17, 0.42, 2, 6);
  capsule.translate(0, 0.38, 0);
  const mesh = new THREE.InstancedMesh(capsule, new THREE.MeshStandardMaterial({ roughness: 0.9 }), CROWD);
  const palette = ["#3b3a3c", "#5a4b45", "#2f3b52", "#6b5a52", "#7b6d66", "#4a4f57", "#8a6f6a", "#2c2a29", "#9a8f86"];
  const people = Array.from({ length: CROWD }, (_, i) => {
    mesh.setColorAt(i, new THREE.Color(palette[Math.floor(rand() * palette.length)]));
    return { dx: (rand() - 0.5) * 2, dz: (rand() - 0.5) * 90, speed: 0.5 + rand() * 1.1, phase: rand() * 10, s: 0.75 + rand() * 0.45 };
  });
  mesh.castShadow = true;
  mesh.count = 0;
  return { mesh, people };
}

function makeGround() {
  const shape = new THREE.Shape();
  outline().forEach(([x, z], i) => (i ? shape.lineTo(x, -z) : shape.moveTo(x, -z)));
  const geometry = new THREE.ShapeGeometry(shape);
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function makeFence() {
  const posts: [number, number][] = [];
  for (let z = 0; z <= 410; z += 4) posts.push([eastEdge(z), z]);
  for (let x = 4; x < eastEdge(0); x += 4) posts.push([x, 0]);
  const geometry = new THREE.BoxGeometry(0.16, 2.2, 0.16);
  geometry.translate(0, 1.1, 0);
  const mesh = new THREE.InstancedMesh(geometry, new THREE.MeshStandardMaterial({ color: "#3a3936" }), posts.length);
  const m = new THREE.Matrix4();
  posts.forEach(([x, z], i) => {
    m.makeTranslation(x, 0, z);
    mesh.setMatrixAt(i, m);
  });
  const wire = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(
      posts.slice(0, Math.floor(410 / 4) + 1).map(([x, z]) => new THREE.Vector3(x, 1.9, z)),
    ),
    new THREE.LineBasicMaterial({ color: "#3a3936" }),
  );
  return { posts: mesh, wire };
}

function makeWadi() {
  const pts: THREE.Vector3[] = [];
  const end = eastEdge(140);
  for (let i = 0; i <= 24; i++) {
    const x = (end * i) / 24;
    pts.push(new THREE.Vector3(x, 0.02, 140 + Math.sin(i * 0.9) * 2.4 + i * 0.25));
  }
  const geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 1.5, 6, false);
  geometry.scale(1, 0.04, 1);
  return geometry;
}

function WalkScene({ progress, steer, labels }: SceneProps) {
  const { camera, viewport, size, gl } = useThree();
  const smooth = useRef(0);
  const frame = useRef(0);
  const walker = useRef<THREE.Group>(null);
  const legs = useRef<THREE.Group[]>([]);
  const sun = useRef<THREE.DirectionalLight>(null);
  const fog = useRef<THREE.Fog>(null);
  const drones = useRef<THREE.Group>(null);
  const pos = useRef(new THREE.Vector3(32, 0, 60));
  const travelled = useRef(0);
  const look = useRef(new THREE.Vector3(40, 0, 120));

  const town = useMemo(() => makeTown(), []);
  const tents = useMemo(() => makeTents(), []);
  const crowd = useMemo(() => makeCrowd(), []);
  const ground = useMemo(() => makeGround(), []);
  const fence = useMemo(() => makeFence(), []);
  const wadi = useMemo(() => makeWadi(), []);
  const sunTarget = useMemo(() => new THREE.Object3D(), []);
  const wallLength = Math.hypot(SOUTH_B.x - SOUTH_A.x, SOUTH_B.z - SOUTH_A.z);
  const wallAngle = -Math.atan2(SOUTH_B.z - SOUTH_A.z, SOUTH_B.x - SOUTH_A.x);
  const wide = size.width >= 768;

  useEffect(() => () => {
    town.standing.geometry.dispose();
    tents.geometry.dispose();
    crowd.mesh.geometry.dispose();
  }, [town, tents, crowd]);

  // Shadows are redrawn by hand (see useFrame) instead of on every frame.
  useEffect(() => {
    gl.shadowMap.autoUpdate = false;
    gl.shadowMap.needsUpdate = true;
    return () => {
      gl.shadowMap.autoUpdate = true;
    };
  }, [gl]);

  const m = useMemo(() => new THREE.Matrix4(), []);
  const camTarget = useMemo(() => new THREE.Vector3(), []);
  const camPos = useMemo(() => new THREE.Vector3(), []);
  const projected = useMemo(() => new THREE.Vector3(), []);
  const INTRO_POS = useMemo(() => new THREE.Vector3(40, 190, -70), []);
  const INTRO_LOOK = useMemo(() => new THREE.Vector3(40, 0, 130), []);
  const OUTRO_LOOK = useMemo(() => new THREE.Vector3(55, 0, 190), []);
  const outroPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    smooth.current = follow(smooth.current, progress.current ?? 0, 2.6, dt);
    const p = smooth.current;
    const t = state.clock.elapsedTime;

    // Where the walker should be: on the route, nudged by the visitor, never outside the strip.
    const route = routeAt(p);
    const lateral = (steer.current ?? 0) * 24;
    const z = route.z;
    const x = THREE.MathUtils.clamp(route.x + lateral, 3, eastEdge(z) - 3);
    const prev = pos.current.clone();
    pos.current.x = THREE.MathUtils.damp(pos.current.x, x, 3, dt);
    pos.current.z = z;
    travelled.current += prev.distanceTo(pos.current);

    if (walker.current) {
      walker.current.position.copy(pos.current);
      const phase = travelled.current * 1.6;
      const moving = Math.min(1, prev.distanceTo(pos.current) / (dt * 4 + 1e-4));
      walker.current.children[1].position.y = Math.abs(Math.sin(phase)) * 0.08 * moving;
      legs.current.forEach((leg, i) => {
        if (leg) leg.rotation.x = Math.sin(phase + i * Math.PI) * 0.55 * moving;
      });
    }

    // Camera: an aerial view of the north, then behind the child, then high above the whole strip.
    const intro = 1 - smoothstep(0.12, 0.22, p);
    const outro = smoothstep(0.93, 0.995, p);
    const side = wide ? 10 : 0;
    // on phones the text card covers the lower third, so the child is framed higher
    camPos.set(pos.current.x + side, wide ? 21 : 27, pos.current.z - (wide ? 19 : 17));
    camTarget.set(pos.current.x + side, 0, pos.current.z + (wide ? 17 : 3));
    camPos.lerp(INTRO_POS, intro);
    camTarget.lerp(INTRO_LOOK, intro);
    outroPos.set(60, viewport.aspect < 1 ? 380 : 300, 560);
    camPos.lerp(outroPos, outro);
    camTarget.lerp(OUTRO_LOOK, outro);
    camera.position.copy(camPos);
    if (look.current.distanceTo(camTarget) > 25) look.current.copy(camTarget);
    else look.current.lerp(camTarget, 1 - Math.exp(-dt * 10));
    camera.lookAt(look.current);
    camera.updateMatrixWorld();

    PLACES.forEach((place, i) => {
      const el = labels.current?.[i];
      if (!el) return;
      projected.set(place.x, 1.5, place.z).project(camera);
      const onScreen = projected.z < 1 && Math.abs(projected.x) < 1.05 && Math.abs(projected.y) < 1.05;
      el.style.opacity = onScreen ? "1" : "0";
      if (onScreen) {
        el.style.transform = `translate(${(projected.x * 0.5 + 0.5) * size.width}px, ${
          (-projected.y * 0.5 + 0.5) * size.height
        }px) translate(-50%, -50%)`;
      }
    });

    if (fog.current) {
      const high = Math.max(intro, outro);
      fog.current.near = lerp(70, 260, high);
      fog.current.far = lerp(210, 900, high);
    }

    if (sun.current) {
      sun.current.position.set(pos.current.x - 40, 70, pos.current.z + 30);
      sunTarget.position.copy(pos.current);
    }
    // Shadows only matter close to the child, and every other frame is enough there;
    // from the air (start and end) they are left as they are.
    frame.current++;
    if (Math.max(intro, outro) < 0.5 && frame.current % 2 === 0) gl.shadowMap.needsUpdate = true;

    // The crowd: more people on the road the further south you go.
    const count = Math.floor(lerp(260, CROWD, clamp01((p - 0.15) / 0.7)));
    crowd.mesh.count = count;
    const center = routeAt(Math.min(0.92, Math.max(0.2, p))).x;
    for (let i = 0; i < count; i++) {
      const person = crowd.people[i];
      person.dz += person.speed * dt;
      if (person.dz > 50) person.dz -= 95;
      if (person.dz < -45) person.dz += 95;
      const pz = pos.current.z + person.dz;
      const px = THREE.MathUtils.clamp(center + person.dx * 30, 1.5, eastEdge(pz) - 1.5);
      const bob = Math.abs(Math.sin(t * 4 * person.speed + person.phase)) * 0.06;
      m.makeScale(person.s, person.s, person.s);
      m.setPosition(px, bob, pz);
      crowd.mesh.setMatrixAt(i, m);
    }
    crowd.mesh.instanceMatrix.needsUpdate = true;

    // Drones circle ahead of the walker. Gazans call their sound "zanana".
    if (drones.current) {
      drones.current.children.forEach((d, i) => {
        const a = t * (0.12 + i * 0.03) + i * 2.1;
        const r = 26 + i * 9;
        d.position.set(pos.current.x + Math.cos(a) * r, 26 + i * 4, pos.current.z + 40 + Math.sin(a) * r);
        d.rotation.y = -a;
      });
    }
  });

  return (
    <>
      <color attach="background" args={[HAZE]} />
      <fog ref={fog} attach="fog" args={[HAZE, 70, 210]} />
      <hemisphereLight args={["#e7ecf0", "#6c6356", 1.05]} />
      <primitive object={sunTarget} />
      <directionalLight
        ref={sun}
        castShadow={wide}
        intensity={2.1}
        color="#fff1dc"
        target={sunTarget}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
        shadow-camera-near={1}
        shadow-camera-far={220}
        shadow-bias={-0.0006}
      />

      {/* land beyond the fence, and the sea */}
      <mesh rotation-x={-Math.PI / 2} position={[200, -0.08, 205]} receiveShadow>
        <planeGeometry args={[900, 1400]} />
        <meshStandardMaterial color="#6f6a62" roughness={1} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[-250, -0.04, 205]}>
        <planeGeometry args={[500, 1400]} />
        <meshStandardMaterial color="#3d6a70" roughness={0.35} metalness={0.1} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[-1.2, -0.02, 205]}>
        <planeGeometry args={[2.4, 1400]} />
        <meshBasicMaterial color="#d8e2df" transparent opacity={0.55} />
      </mesh>

      <mesh geometry={ground} receiveShadow>
        <meshStandardMaterial color="#c4bdb1" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={wadi} position-y={0.02}>
        <meshStandardMaterial color="#8c8475" roughness={1} />
      </mesh>

      <primitive object={town.standing} />
      <primitive object={town.rubble} />
      <primitive object={tents} />
      <primitive object={crowd.mesh} />
      <primitive object={fence.posts} />
      <primitive object={fence.wire} />

      {/* the wall at the Egyptian border */}
      <mesh
        position={[(SOUTH_A.x + SOUTH_B.x) / 2, 4, (SOUTH_A.z + SOUTH_B.z) / 2]}
        rotation-y={wallAngle}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[wallLength, 8, 1.4]} />
        <meshStandardMaterial color="#a19e96" roughness={0.95} />
      </mesh>

      <group ref={drones}>
        {[0, 1, 2].map((i) => (
          <group key={i}>
            <mesh castShadow>
              <boxGeometry args={[0.28, 0.16, 1.7]} />
              <meshStandardMaterial color="#2b2b2c" />
            </mesh>
            <mesh castShadow position-z={-0.1}>
              <boxGeometry args={[3.4, 0.05, 0.42]} />
              <meshStandardMaterial color="#2b2b2c" />
            </mesh>
          </group>
        ))}
      </group>

      {/* the child, seen from behind, hands clasped at the back (after Naji al-Ali's Handala) */}
      <group ref={walker}>
        <mesh rotation-x={-Math.PI / 2} position-y={0.05}>
          <ringGeometry args={[1.25, 1.55, 48]} />
          <meshBasicMaterial color="#f0b965" transparent opacity={0.9} />
        </mesh>
        <group scale={2.3}>
          {[-0.085, 0.085].map((lx, i) => (
            <group
              key={lx}
              position={[lx, 0.42, 0]}
              ref={(el) => {
                if (el) legs.current[i] = el;
              }}
            >
              <mesh position-y={-0.2} castShadow>
                <capsuleGeometry args={[0.055, 0.3, 2, 6]} />
                <meshStandardMaterial color="#7a5a45" />
              </mesh>
            </group>
          ))}
          <mesh position-y={0.66} castShadow>
            <capsuleGeometry args={[0.15, 0.32, 3, 10]} />
            <meshStandardMaterial color="#38332e" roughness={0.95} />
          </mesh>
          {/* arms folded behind the back */}
          {[-1, 1].map((sx) => (
            <mesh key={sx} position={[sx * 0.1, 0.66, -0.12]} rotation={[0.5, 0, sx * -0.55]} castShadow>
              <capsuleGeometry args={[0.04, 0.26, 2, 6]} />
              <meshStandardMaterial color="#38332e" />
            </mesh>
          ))}
          <mesh position={[0, 0.54, -0.18]} castShadow>
            <sphereGeometry args={[0.055, 10, 8]} />
            <meshStandardMaterial color="#7a5a45" />
          </mesh>
          <mesh position-y={1.02} castShadow>
            <sphereGeometry args={[0.15, 16, 12]} />
            <meshStandardMaterial color="#7a5a45" />
          </mesh>
          {Array.from({ length: 11 }, (_, i) => {
            const a = (i / 10) * Math.PI - Math.PI / 2;
            return (
              <mesh key={i} position={[Math.sin(a) * 0.12, 1.12 + Math.cos(a) * 0.05, -0.04 - Math.cos(a) * 0.06]} rotation={[-0.5, 0, -a * 0.9]}>
                <coneGeometry args={[0.035, 0.16, 4]} />
                <meshStandardMaterial color="#1e1c1a" />
              </mesh>
            );
          })}
        </group>
      </group>
    </>
  );
}

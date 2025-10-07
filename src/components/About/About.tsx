"use client";

import Image from "next/image";
import Link from "next/link";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useCallback, useLayoutEffect } from "react";
import * as THREE from "three";

type Social = { label: string; url: string };
type Member = {
  slug: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  socials?: Social[];
};

/** Utility: interpolate colors */
function lerpColor(a: THREE.Color, b: THREE.Color, t: number) {
  return new THREE.Color(
    a.r + (b.r - a.r) * t,
    a.g + (b.g - a.g) * t,
    a.b + (b.b - a.b) * t
  );
}

/** Instanced grid with mouse-driven ripple coloring */
function GridWaveDots({
  cols = 50,
  rows = 20,
  dotRadius = 0.008,
  base = "#9ca3af",      // gray-400
  highlight = "#22d3ee", // cyan-400
  speed = 2.2,
  frequency = 6.0,
  falloff = 2.0,
}: {
  cols?: number;
  rows?: number;
  dotRadius?: number;
  base?: string;
  highlight?: string;
  speed?: number;
  frequency?: number;
  falloff?: number;
}) {
  const { viewport } = useThree(); // object, not a function
  const vw = viewport.width;
  const vh = viewport.height;

  // Grid positions that auto-fit the current viewport
  const positions = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = ((c + 0.5) / cols - 0.5) * vw;
        const y = (0.5 - (r + 0.5) / rows) * vh;
        pts.push(new THREE.Vector3(x, y, 0));
      }
    }
    return pts;
  }, [vw, vh, cols, rows]);

  const count = positions.length;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geom = useMemo(() => new THREE.CircleGeometry(dotRadius, 16), [dotRadius]);
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ vertexColors: true }),
    []
  );

  // Set instance transforms once
  useLayoutEffect(() => {
    for (let i = 0; i < count; i++) {
      dummy.position.copy(positions[i]);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current?.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  }, [count, positions, dummy]);

  // Colors
  const baseColor = useMemo(() => new THREE.Color(base), [base]);
  const hiColor = useMemo(() => new THREE.Color(highlight), [highlight]);
  const tmpColor = useMemo(() => new THREE.Color(), []);
  const [center, setCenter] = useState<THREE.Vector3 | null>(null);
  const timeRef = useRef(0);

  // Mouse → set ripple center using the instance under cursor
  const onPointerMove = useCallback(
    (e: any) => {
      if (typeof e.instanceId === "number") {
        setCenter(positions[e.instanceId]);
      }
    },
    [positions]
  );

  // Animate per-instance colors
  useFrame((_, dt) => {
    timeRef.current += dt;
    const t = timeRef.current;

    for (let i = 0; i < count; i++) {
      const p = positions[i];
      const d = center ? p.distanceTo(center) : 10; // far if none yet
      const wave = Math.max(0, Math.sin(frequency * (t * speed - d)) * Math.exp(-falloff * d));
      const intensity = Math.min(1, Math.max(0, (wave + 1) / 2)); // map [-1,1]→[0,1]
      tmpColor.copy(lerpColor(baseColor, hiColor, intensity));
      meshRef.current.setColorAt(i, tmpColor);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  // Cleanup
  useLayoutEffect(() => {
    return () => {
      geom.dispose();
      material.dispose();
    };
  }, [geom, material]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geom, material, count]}
      onPointerMove={onPointerMove}
      raycast={THREE.InstancedMesh.prototype.raycast}
    />
  );
}

export default function About({ member }: { member: Member }) {
  return (
    <main className="p-8 justify-center relative">
      {/* Background canvas */}
      <div className="fixed inset-0 -z-10">
        <Canvas
          orthographic
          camera={{ position: [0, 0, 5], zoom: 300, near: -10, far: 10 }}
        >
          <GridWaveDots cols={50} rows={20} />
        </Canvas>
      </div>

      <Link href="/about" className="text-sm underline underline-offset-2">
        ← Back
      </Link>

        <div className="flex justify-center items-start">
        <Image
          src={member.image}
          alt={`${member.name} portrait`}
          width={800}
          height={800}
          className="rounded-2xl object-cover"
          priority
        />  
        </div>

      <article className="prodDetailsOptionsBox p-8 space-y-6 translate-y-60 absolute top-5 text-zinc-700 w-96">
        <header className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold">{member.name}</h1>
          <p className="">{member.role}</p>

        <div className="">
        <p className="leading-7">{member.bio}</p>
        </div>
        </header>
       </article>

     

       

        {member.socials?.length ? (
          <ul className="flex gap-4">
            {member.socials.map((s) => (
              <li key={s.label}>
                <a className="underline" href={s.url} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
 
    </main>
  );
}

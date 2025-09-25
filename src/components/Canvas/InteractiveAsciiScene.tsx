'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera as DreiOrthographicCamera } from '@react-three/drei';

// ———————————————————————————————————————————————————————————————
// Public API
// ———————————————————————————————————————————————————————————————

export default function InteractiveAsciiScene({
  imageSrc = '/tt-ascii-art.png',
  cols = 160,
  rows = 120,
  cell = 6,
  asciiChars = ' .:-=+*#%@',
}: {
  imageSrc?: string;
  cols?: number;
  rows?: number;
  cell?: number;
  asciiChars?: string;
}) {
  const mousePixels = useRef(new THREE.Vector2());

  return (
    <div
      onPointerMove={(e) => {
        // Flip Y for gl_FragCoord (origin bottom-left)
        mousePixels.current.set(e.clientX, window.innerHeight - e.clientY);
      }}
      style={{ width: '100%', height: '100vh' }}
    >
      <Canvas gl={{ antialias: true, alpha: false }}>
        <ResponsiveOrthoCamera />
        <color attach="background" args={[0, 0, 0]} />
        <HoverField mouse={mousePixels.current} />
        <ASCIIPlane
          mouse={mousePixels.current}
          imageSrc={imageSrc}
          cols={cols}
          rows={rows}
          cell={cell}
          asciiChars={asciiChars}
        />
      </Canvas>
    </div>
  );
}

// ———————————————————————————————————————————————————————————————
// Camera: orthographic, responsive to viewport size
// ———————————————————————————————————————————————————————————————

function ResponsiveOrthoCamera() {
  const { size } = useThree();
  const cam = useRef<THREE.OrthographicCamera>(null!);

  // Update frustum on resize; makeDefault handles setting the active camera
  useEffect(() => {
    const aspect = size.width / size.height || 1;
    cam.current.left = -aspect;
    cam.current.right = aspect;
    cam.current.top = 1;
    cam.current.bottom = -1;
    cam.current.near = -10;
    cam.current.far = 10;
    cam.current.zoom = 1;
    cam.current.updateProjectionMatrix();
  }, [size]);

  return <DreiOrthographicCamera ref={cam} makeDefault position={[0, 0, 5]} />;
}


// ———————————————————————————————————————————————————————————————
// Fullscreen fragment shader reacting to the mouse
// ———————————————————————————————————————————————————————————————

function HoverField({ mouse }: { mouse: THREE.Vector2 }) {
  const { size } = useThree();
  const material = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      uniforms: {
        uResolution: { value: new THREE.Vector2(size.width, size.height) },
        uMouse: { value: new THREE.Vector2() },
        uTime: { value: 0 },
      },
      vertexShader: /* glsl */ `
        void main(){
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec2 uResolution; // px
        uniform vec2 uMouse;      // px
        uniform float uTime;

        // Cosine palette
        vec3 palette(float t){
          return 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + t));
        }

        void main(){
          vec2 uv = gl_FragCoord.xy / uResolution; // 0..1
          vec2 m  = uMouse / uResolution;

          float d = distance(uv, m);
          float ring = 0.18 + 0.015 * sin(40.0*d - uTime*2.0);
          float fall = exp(-12.0*d);
          float t = fall + smoothstep(ring+0.02, ring-0.02, d) * 0.25;
          vec3 col = palette(t + 0.15 * sin(uTime*0.5));

          gl_FragColor = vec4(col, 1.0);
        }
      `,
      depthWrite: false,
      depthTest: false,
    });
    return m;
  }, []); // uniforms are updated per-frame

  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ clock, size }) => {
    (material.uniforms.uTime.value as number) = clock.getElapsedTime();
    (material.uniforms.uResolution.value as THREE.Vector2).set(size.width, size.height);
    (material.uniforms.uMouse.value as THREE.Vector2).copy(mouse);
  });

  return (
    <mesh position={[0, 0, 0]}>
      {/* 2x2 NDC-filling quad */}
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

// ———————————————————————————————————————————————————————————————
// Center ASCII plane: image -> ASCII canvas -> texture -> hover FX
// ———————————————————————————————————————————————————————————————

function ASCIIPlane({
  mouse,
  imageSrc,
  cols,
  rows,
  cell,
  asciiChars,
}: {
  mouse: THREE.Vector2;
  imageSrc: string;
  cols: number;
  rows: number;
  cell: number;
  asciiChars: string;
}) {
  const { size } = useThree();
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);
  const [pixelSize, setPixelSize] = useState<[number, number]>([cols * cell, rows * cell]);

  // Convert image -> ASCII once on load
  useEffect(() => {
    let cancelled = false;
    const src = new window.Image();
    src.crossOrigin = 'anonymous';
    src.src = imageSrc;

    const srcC = document.createElement('canvas');
    const srcCtx = srcC.getContext('2d', { willReadFrequently: true })!;
    const asciiC = document.createElement('canvas');
    const asciiCtx = asciiC.getContext('2d')!;

    src.onload = () => {
      if (cancelled) return;

      // 1) sample source at grid size
      srcC.width = cols;
      srcC.height = rows;
      srcCtx.drawImage(src, 0, 0, cols, rows);
      const img = srcCtx.getImageData(0, 0, cols, rows).data;

      // 2) paint ASCII to higher-res canvas (cell px per char)
      asciiC.width = cols * cell;
      asciiC.height = rows * cell;
      setPixelSize([asciiC.width, asciiC.height]);

      asciiCtx.fillStyle = '#000';
      asciiCtx.fillRect(0, 0, asciiC.width, asciiC.height);
      asciiCtx.fillStyle = '#fff';
      asciiCtx.font =
        `${cell}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
      asciiCtx.textBaseline = 'top';

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const r = img[i],
            g = img[i + 1],
            b = img[i + 2];
          const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          const idx = Math.max(0, Math.min(asciiChars.length - 1, Math.floor(lum * (asciiChars.length - 1))));
          const ch = asciiChars[idx];
          asciiCtx.fillText(ch, x * cell, y * cell);
        }
      }

      const t = new THREE.CanvasTexture(asciiC);
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.NearestFilter;
      t.needsUpdate = true;
      setTex((prev) => {
        prev?.dispose();
        return t;
      });
    };

    return () => {
      cancelled = true;
      setTex((prev) => {
        prev?.dispose();
        return null;
      });
    };
  }, [imageSrc, cols, rows, cell, asciiChars]);

  const material = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      uniforms: {
        uAsciiTex: { value: null },
        uResolution: { value: new THREE.Vector2(size.width, size.height) },
        uMouse: { value: new THREE.Vector2() },
        uPlanePx: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uAsciiTex;
        uniform vec2 uResolution; // screen px
        uniform vec2 uMouse;      // screen px
        uniform vec2 uPlanePx;    // plane pixel span
        uniform float uTime;
        varying vec2 vUv;

        void main(){
          // Base ASCII tex
          vec4 base = texture2D(uAsciiTex, vUv);

          // Map mouse to plane pixels
          vec2 uvPx   = vUv * uPlanePx;
          vec2 mousePx = (uMouse / uResolution) * uPlanePx;
          float d = distance(uvPx, mousePx);

          // Effects
          float glow = exp(-0.035 * d);
          float wobble = 0.5 + 0.5 * sin(uTime * 3.0 + d * 0.05);
          vec3 tint = mix(base.rgb, vec3(1.0, 0.92, 0.75), clamp(glow, 0.0, 1.0));

          // Slight character “melt” by offsetting sample coords near the mouse
          vec2 dir = normalize(uvPx - mousePx + 1e-5);
          vec2 offset = dir * glow * 0.01 * wobble; // tweak strength
          vec3 col = texture2D(uAsciiTex, clamp(vUv + offset, 0.0, 1.0)).rgb;

          // Combine with tint
          col = mix(col, tint, 0.6 * glow);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    return m;
  }, []); // uniforms are updated per-frame

  useEffect(() => () => material.dispose(), [material]);

  useFrame(({ clock, size }) => {
    (material.uniforms.uTime.value as number) = clock.getElapsedTime();
    (material.uniforms.uResolution.value as THREE.Vector2).set(size.width, size.height);
    (material.uniforms.uMouse.value as THREE.Vector2).copy(mouse);
    if (tex) {
      material.uniforms.uAsciiTex.value = tex;
      material.uniforms.uPlanePx.value = new THREE.Vector2(pixelSize[0], pixelSize[1]);
    }
  });

  // Keep the on-screen plane sized by aspect of the ASCII canvas (~65% viewport height).
  const [w, h] = useMemo(() => {
    const [pxW, pxH] = pixelSize;
    const aspect = pxW / pxH;
    const scale = 0.65; // fraction of viewport height in NDC units (±1 => height 2)
    const vh = scale * 2;
    const vw = vh * aspect;
    return [vw, vh];
  }, [pixelSize]);

  return (
    <mesh position={[0, 0, 0.01]}>
      <planeGeometry args={[w, h]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

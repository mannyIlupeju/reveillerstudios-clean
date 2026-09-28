import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { useCanvas } from '../../Context/context/CanvasContext';
import { useRouter } from "next/navigation";


const ThreeSketch = () => {
  const { backgroundCanvasRef } = useCanvas()
  const modelRef = useRef<THREE.Group | null>(null);
  const router = useRouter();

  const [activeBox, setActiveBox] = useState<string | null>(null);


  
  useEffect(() => {
  if (!backgroundCanvasRef.current) return;

  let renderer: THREE.WebGLRenderer | null = null;
  let animationId: number;
  let particlesGeometry: THREE.BufferGeometry | null = null;
  let particlesMaterial: THREE.PointsMaterial | null = null;
  let dracoLoader: DRACOLoader | null = null;
  let controls: OrbitControls | null = null;
  let handleResize: (() => void) | null = null;
  let cancelled = false;
  let idleCallbackId: number | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const initThree = () => {
    // React Strict Mode double-invokes this effect in dev (mount -> cleanup -> mount).
    // Because setup is deferred below, the cleanup from the first mount can run before
    // this callback fires; without this guard it would still run and create a second
    // renderer/OrbitControls/animate loop layered onto the same canvas, causing visible
    // glitching whenever the model is rotated (two loops fighting over one canvas).
    if (cancelled) return;

    const canvas = backgroundCanvasRef.current;
    if (!canvas) return;

    /* ---------------- SCENE ---------------- */
    const scene = new THREE.Scene();
    // Transparent so the split-screen video background (rendered behind this
    // canvas in the DOM) shows through everywhere the particles/model don't
    // cover.
    scene.background = null;

    /* ---------------- CAMERA ---------------- */
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight
    );
    camera.position.z = 5;
    scene.add(camera);

    /* ---------------- RENDERER ---------------- */
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // alpha: true alone isn't enough -- the clear alpha still defaults to
    // opaque, which would paint over the video background behind the canvas.
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    /* ---------------- PARTICLES ---------------- */
    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load(
      "/textures/particles/8.png"
    );

    const particleCount =
      window.innerWidth < 768 ? 1500 : 3000;

    particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    particlesMaterial = new THREE.PointsMaterial({
      color: 0xff0000,
      size: 0.1,
      transparent: true,
      opacity: 0.7,
      alphaMap: particleTexture,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particles);

    /* ---------------- MODEL ---------------- */
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const updateModelScale = () => {
      if (!modelRef.current) return;

      const scaleFactor = Math.min(
        window.innerWidth / 50,
        window.innerHeight / 50
      );

      modelRef.current.scale.setScalar(scaleFactor * 2);
    };

    gltfLoader.load(
      "/models/GLTF/10rvr3dlogoMetal.glb",
      (gltf) => {
        modelRef.current = gltf.scene;
        updateModelScale();
        modelGroup.add(gltf.scene);
      }
    );

    /* ---------------- LIGHT ---------------- */
    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      3
    );
    scene.add(ambientLight);

    /* ---------------- CONTROLS ---------------- */
    controls = new OrbitControls(camera, canvas);
    controls.enableZoom = false;

    /* ---------------- RESIZE ---------------- */
    handleResize = () => {
      if (!renderer) return;

      camera.aspect =
        window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      );
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
      );

      updateModelScale();
    };

    window.addEventListener("resize", handleResize);

    /* ---------------- ANIMATE ---------------- */
    const animate = () => {
      if (cancelled) return;
      animationId = requestAnimationFrame(animate);

      modelGroup.rotation.y += 0.01;
      particles.rotation.y += 0.001;

      controls?.update();
      renderer?.render(scene, camera);
    };

    animate();
  };

  /* ---------------- DEFER INIT ---------------- */
  const start = () => initThree();

  if ("requestIdleCallback" in window) {
    idleCallbackId = (window as any).requestIdleCallback(start);
  } else {
    timeoutId = setTimeout(start, 200);
  }

  /* ---------------- CLEANUP ---------------- */
  return () => {
    cancelled = true;

    // Cancel a still-pending deferred init so Strict Mode's mount/cleanup/mount
    // in dev never results in a second renderer being created for this canvas.
    if (idleCallbackId !== null && "cancelIdleCallback" in window) {
      (window as any).cancelIdleCallback(idleCallbackId);
    }
    if (timeoutId !== null) clearTimeout(timeoutId);

    if (animationId) cancelAnimationFrame(animationId);

    renderer?.dispose();
    particlesGeometry?.dispose();
    particlesMaterial?.dispose();
    dracoLoader?.dispose();
    controls?.dispose();

    if (handleResize) window.removeEventListener("resize", handleResize);
  };
}, []);
  

  return (
    <div className="relative w-full">
      {/* Split-screen video background: shop-releases video on top/left,
          gallery video on bottom/right. Purely decorative -- the clickable
          hit layer with the labels lives on top, in the same split, further
          below. Stacks vertically on small screens so neither half gets too
          thin. */}
      <div
        className="absolute inset-0 z-0 overflow-hidden flex flex-col md:flex-row pointer-events-none"
        aria-hidden="true"
      >
        <div className="relative w-full h-1/2 md:h-full md:w-1/2 overflow-hidden">
          <video
            preload="none"
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            controls={false}
            className="absolute inset-0 w-full h-full object-cover select-none"
            tabIndex={-1}
            onContextMenu={e => e.preventDefault()}
          >
            <source
              src="https://res.cloudinary.com/doynaagx7/video/upload/v1764343516/Timeline_1cool_zrhjrd.mov"
            />
          </video>
        </div>
        <div className="relative w-full h-1/2 md:h-full md:w-1/2 overflow-hidden">
          <video
            preload="none"
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            controls={false}
            className="absolute inset-0 w-full h-full object-cover select-none"
            tabIndex={-1}
            onContextMenu={e => e.preventDefault()}
          >
            <source
              src="https://res.cloudinary.com/doynaagx7/video/upload/v1753965091/rvryulcal_tbtijd_fr1sdk.mp4"
            />
          </video>
        </div>
      </div>

      {/* 3D particles/logo -- transparent, sits between the video and the
          click/label layer so both remain visible around it. */}
      <canvas ref={backgroundCanvasRef} className="relative z-10"/>

      {/* Clickable split-screen hit layer: same left/right (or top/bottom
          on mobile) split as the video behind it, each half a link with its
          label on top of the video. Replaces the old draggable circles. */}
      <div className="absolute inset-0 z-20 flex flex-col md:flex-row">
        <div
          className="relative flex-1 flex items-center justify-center cursor-pointer"
          onTouchStart={() => setActiveBox('shop')}
          onTouchEnd={() => setActiveBox(null)}
          onMouseDown={() => setActiveBox('shop')}
          onMouseUp={() => setActiveBox(null)}
          onMouseLeave={() => setActiveBox(null)}
          onClick={() => router.push('/shop/collections/new-releases')}
        >
          <div
            className="absolute inset-0 transition-colors duration-200"
            style={{ background: activeBox === 'shop' ? 'rgba(255,140,0,0.5)' : 'rgba(0,0,0,0.2)' }}
          />
          <h1 className="relative z-10 text-xl sm:text-2xl md:text-4xl text-yellow-300 text-center font-bold uppercase tracking-widest px-4">
            Shop New Releases
          </h1>
        </div>
        <div
          className="relative flex-1 flex items-center justify-center cursor-pointer"
          onTouchStart={() => setActiveBox('gallery')}
          onTouchEnd={() => setActiveBox(null)}
          onMouseDown={() => setActiveBox('gallery')}
          onMouseUp={() => setActiveBox(null)}
          onMouseLeave={() => setActiveBox(null)}
          onClick={() => router.push('/gallery')}
        >
          <div
            className="absolute inset-0 transition-colors duration-200"
            style={{ background: activeBox === 'gallery' ? 'rgba(255,140,0,0.5)' : 'rgba(0,0,0,0.2)' }}
          />
          <h1 className="relative z-10 text-xl sm:text-2xl md:text-4xl text-yellow-400 text-center font-bold uppercase tracking-widest px-4">
            Gallery
          </h1>
        </div>
      </div>
    </div>
  )
};

export default ThreeSketch;

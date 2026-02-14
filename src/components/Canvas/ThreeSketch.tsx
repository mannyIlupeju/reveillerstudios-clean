import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { useCanvas } from '../../Context/context/CanvasContext';
import * as motion from "motion/react-client"
import { useRouter } from "next/navigation";


const ThreeSketch = () => {
  const { backgroundCanvasRef } = useCanvas()
  const modelRef = useRef<THREE.Group | null>(null);
  const router = useRouter();

  const [box2Pos, setBox2Pos] = useState({ x: 0, y: 0 });
  const [activeBox, setActiveBox] = useState<string | null>(null);


  
  useEffect(() => {
  if (!backgroundCanvasRef.current) return;

  let renderer: THREE.WebGLRenderer | null = null;
  let animationId: number;
  let particlesGeometry: THREE.BufferGeometry | null = null;
  let particlesMaterial: THREE.PointsMaterial | null = null;
  let dracoLoader: DRACOLoader | null = null;
  let controls: OrbitControls | null = null;

  const initThree = () => {
    const canvas = backgroundCanvasRef.current;
    if (!canvas) return;

    /* ---------------- SCENE ---------------- */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd3d3d3);

    /* ---------------- CAMERA ---------------- */
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight
    );
    camera.position.z = 5;
    scene.add(camera);

    /* ---------------- RENDERER ---------------- */
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
      "/models/GLTF/10rvr3dlogoMetal.gltf",
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
    const handleResize = () => {
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
    (window as any).requestIdleCallback(start);
  } else {
    setTimeout(start, 200);
  }

  /* ---------------- CLEANUP ---------------- */
  return () => {
    if (animationId) cancelAnimationFrame(animationId);

    renderer?.dispose();
    particlesGeometry?.dispose();
    particlesMaterial?.dispose();
    dracoLoader?.dispose();
    controls?.dispose();

    window.removeEventListener("resize", () => {});
  };
}, []);
  

  return (
    <>   
      <canvas ref={backgroundCanvasRef} className="relative"/>
        <motion.div 
          drag
          dragConstraints={backgroundCanvasRef}
          dragElastic={0.05}
          onDragEnd={(e, info) => setBox2Pos({ x: info.point.x, y: info.point.y})}
          initial={{ x: -100, y: -400 }}
          animate={{ x: -10, y: 300}}
          transition={{ duration: 2, ease: 'easeIn' }}
          className="box box1 flex  justify-center items-center relative cursor-grab"
          onTouchStart={() => setActiveBox('box1')}
          onTouchEnd={() => setActiveBox(null)}
          onMouseDown={() => setActiveBox('box1')}
          onMouseUp={() => setActiveBox(null)}
          onClick={() => router.push('/shop/collections/new-releases')}
        >
          <video 
            preload = "none"
            autoPlay 
            loop 
            muted 
            playsInline
            disablePictureInPicture
            controls={false}
            className="videoOverlay absolute inset-0 w-full h-full object-cover z-9 select-none pointer-events-none"
            tabIndex={-1}
            onContextMenu={e => e.preventDefault()}
          >
            <source 
            src="https://res.cloudinary.com/doynaagx7/video/upload/v1764343516/Timeline_1cool_zrhjrd.mov"
            />
          </video>
           {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 z-10 transition-colors duration-200" style={{background: activeBox === 'box1' ? 'rgba(255,140,0,0.5)' : 'rgba(0,0,0,0.2)'}}></div>

          {/* Text */}
          <h1 className="z-20 text-white text-xl font-bold">New Releases</h1>

        </motion.div>
        <motion.div
          drag
          dragConstraints={backgroundCanvasRef}
          dragElastic={0.05}
          initial={{ x: 500, y: -500 }}
          animate={{ x: 500, y: 300}}
          transition={{ duration: 1, ease: 'easeIn' }}
          className="box box2 flex justify-center items-center relative cursor-grab p-4"
          onTouchStart={() => setActiveBox('box2')}
          onTouchEnd={()=> setActiveBox(null)}
          onMouseDown={() => setActiveBox('box2')}
          onMouseUp={() => setActiveBox('box2')}
          onClick={() => router.push('/about')}

          // Remove onClick to prevent double trigger
        >
          <video 
            preload = "none"
            width="auto" 
            height="auto" 
            autoPlay 
            loop 
            muted 
            playsInline
            disablePictureInPicture
            controls={false}
            className="videoOverlay absolute inset-0 w-full h-full object-cover z-9 select-none pointer-events-none"
            tabIndex={-1}
            onContextMenu={e => e.preventDefault()}
          >
            <source 
            src="https://res.cloudinary.com/doynaagx7/video/upload/v1753965091/rvryulcal_tbtijd_fr1sdk.mp4"
            />
          </video>
           {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 transition-colors duration-200" style={{background: activeBox === 'box2' ? 'rgba(255,140,0,0.5)' : 'rgba(0,0,0,0.2)'}}></div>

          {/* Text */}
          <h1 className="z-20 text-white text-xl font-bold">About</h1>

        </motion.div>
        
       
       
    </>
  )
};

export default ThreeSketch;
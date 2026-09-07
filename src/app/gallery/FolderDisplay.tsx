'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { useFolders } from '@/Context/context/FoldersContext';

type FolderDisplayProps = {
  folders: string[];
};

// Constants
const FRUSTUM_SIZE = 1000;
const SCROLL_COOLDOWN = 120;
const DELTA_THRESHOLD = 40;
const PLANE_WIDTH = 1000;
const PLANE_HEIGHT = 700;
const SPACING = { x: 250, y: 300, z: -200 };
const ROTATION = { x: 4, y: -15, z: -1.5 };
const HOVER_OFFSET = 400;
const ANIMATION_SPEED = 0.05;
const HOVER_SPEED = 0.5;

// Audio context for sound effects
// let audioContext: AudioContext | null = null;

// const getAudioContext = () => {
//   if (!audioContext) {
//     audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//   }
//   return audioContext;
// };

// const playHoverSound = () => {
//   try {
//     const ctx = getAudioContext();
//     const oscillator = ctx.createOscillator();
//     const gainNode = ctx.createGain();
    
//     oscillator.connect(gainNode);
//     gainNode.connect(ctx.destination);
    
//     oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
//     oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
//     oscillator.type = 'sine';
    
//     gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
//     gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
//     oscillator.start(ctx.currentTime);
//     oscillator.stop(ctx.currentTime + 0.15);
//   } catch (error) {
//     console.error('Error playing hover sound:', error);
//   }
// };

// const playClickSound = () => {
//   try {
//     const ctx = getAudioContext();
//     const oscillator = ctx.createOscillator();
//     const gainNode = ctx.createGain();
    
//     oscillator.connect(gainNode);
//     gainNode.connect(ctx.destination);
    
//     oscillator.frequency.setValueAtTime(600, ctx.currentTime);
//     oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.2);
//     oscillator.type = 'square';
    
//     gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
//     gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
//     oscillator.start(ctx.currentTime);
//     oscillator.stop(ctx.currentTime + 0.2);
//   } catch (error) {
//     console.error('Error playing click sound:', error);
//   }
// };

function FolderDisplay({ folders }: FolderDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoveredMeshRef = useRef<THREE.Mesh | null>(null);
  const router = useRouter();
  const { setFolders } = useFolders();

  useEffect(() => {
    if (folders && folders.length > 0) {
      setFolders(folders);
    }
  }, [folders, setFolders]);

  useEffect(() => {
    if (!containerRef.current || !folders || folders.length === 0) return;

    const cleanup = initScene();
    return cleanup;
  }, [folders, router]);

  const initScene = () => {
    document.body.style.overflow = 'hidden';

    const { scene, camera, renderer } = setupRenderer();
    const planes = setupPlanes(scene, folders);
    const state = createState();
    
    setupEventListeners(renderer, camera, planes, state);
    animate(renderer, scene, camera, planes, state);

    return () => cleanupScene(renderer, scene, planes, tooltipRef.current);
  };

  const setupRenderer = () => {
    const dpr = window.devicePixelRatio || 1;
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    renderer.setPixelRatio(Math.min(dpr, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current!.appendChild(renderer.domElement);

    const camera = createCamera();
    scene.add(new THREE.AmbientLight(0xffffff, 10));

    setupResizeHandler(camera, renderer);

    return { scene, camera, renderer };
  };

  const createCamera = () => {
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(
      (FRUSTUM_SIZE * aspect) / -2,
      (FRUSTUM_SIZE * aspect) / 2,
      FRUSTUM_SIZE / 2,
      FRUSTUM_SIZE / -2,
      1,
      5000
    );
    
    camera.position.set(600, 800, 1000);
    camera.zoom = getCameraZoom(window.innerWidth);
    camera.updateProjectionMatrix();
    
    return camera;
  };

  const getCameraZoom = (width: number) => {
    if (width > 1280) return 0.5;
    if (width > 768) return 0.35;
    return 0.32;
  };

  const setupResizeHandler = (camera: THREE.OrthographicCamera, renderer: THREE.WebGLRenderer) => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspect = width / height;

      camera.left = (-FRUSTUM_SIZE * aspect) / 2;
      camera.right = (FRUSTUM_SIZE * aspect) / 2;
      camera.top = FRUSTUM_SIZE / 2;
      camera.bottom = -FRUSTUM_SIZE / 2;
      camera.zoom = getCameraZoom(width);
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
  };

  const setupPlanes = (scene: THREE.Scene, folders: string[]) => {
    const planes: { mesh: THREE.Mesh; folder: string; hitMesh: THREE.Mesh }[] = [];
    const loader = new THREE.TextureLoader();
    let cancelled = false;

    folders.forEach((folder) => {
      const imageUrl = getImageUrl(folder);
      
      loader.load(imageUrl, (texture) => {
        if (cancelled) {
          texture.dispose();
          return;
        }
        
        configureTexture(texture, loader as any);
        const mesh = createPlaneMesh(texture);
        scene.add(mesh);

        // Invisible mesh used only for hover raycasting. It always mirrors
        // the plane's resting (pre-hover-offset) transform -- see
        // updatePlanePositions -- so the hover-slide animation below can't
        // shift the raycast target out from under the cursor and flicker
        // hover onto a neighboring plane. Not added to the scene since it's
        // never rendered.
        const hitMesh = new THREE.Mesh(mesh.geometry, new THREE.MeshBasicMaterial());
        hitMesh.visible = false;

        planes.push({ mesh, folder, hitMesh });
        updatePlanePositions(planes, 0);
      });
    });

    return planes;
  };

  const getImageUrl = (folder: string) => {
    const folderPath = folder.replace(/\/?$/, '/');
    return `https://${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${folderPath}thumbnail.jpg`;
  };

  const configureTexture = (texture: THREE.Texture, renderer: any) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = renderer.capabilities?.getMaxAnisotropy?.() || 16;
  };

  const createPlaneMesh = (texture: THREE.Texture) => {
    const geometry = new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT);
    const material = new THREE.MeshBasicMaterial({ 
      map: texture, 
      transparent: true,
      depthTest: true,
      depthWrite: true
    });
    return new THREE.Mesh(geometry, material);
  };

  const updatePlanePositions = (
    planes: { mesh: THREE.Mesh; folder: string; hitMesh: THREE.Mesh }[], 
    scrollIndex: number
  ) => {
    planes.forEach((plane, i) => {
      const displayIndex = (i - scrollIndex + folders.length) % folders.length;
      const mesh = plane.mesh;
      
      mesh.position.set(
        displayIndex * SPACING.x,
        displayIndex * SPACING.y,
        displayIndex * SPACING.z
      );
      
      mesh.rotation.set(
        THREE.MathUtils.degToRad(ROTATION.x),
        THREE.MathUtils.degToRad(ROTATION.y),
        THREE.MathUtils.degToRad(ROTATION.z)
      );
      
      mesh.userData.baseX = mesh.position.x;

      plane.hitMesh.position.copy(mesh.position);
      plane.hitMesh.rotation.copy(mesh.rotation);
      plane.hitMesh.updateMatrixWorld(true);
    });
  };

  const createState = () => ({
    scrollIndex: 0,
    currentIndex: 0,
    lastScrollTime: 0,
    touchStartY: null as number | null,
    lastHoveredMesh: null as THREE.Mesh | null,
    cancelled: false,
    stop: false
  });

  const setupEventListeners = (
    renderer: THREE.WebGLRenderer,
    camera: THREE.OrthographicCamera,
    planes: { mesh: THREE.Mesh; folder: string; hitMesh: THREE.Mesh }[],
    state: ReturnType<typeof createState>
  ) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event: MouseEvent) => {
      updateMousePosition(event, renderer.domElement, mouse);
      raycaster.setFromCamera(mouse, camera);
      
      const intersects = raycaster.intersectObjects(planes.map((p) => p.mesh));
      if (intersects.length > 0) {
        const clicked = planes.find((p) => p.mesh === intersects[0].object);
        // if (clicked) {
        //   playClickSound();
         if (!clicked) return;
        router.push(`/gallery/${encodeURIComponent(clicked.folder)}`);
        // }
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!tooltipRef.current) return;
      
      updateMousePosition(event, renderer.domElement, mouse);
      raycaster.setFromCamera(mouse, camera);

      // Hover uses each plane's stable hitMesh rather than its live mesh --
      // the live mesh slides on hover (HOVER_OFFSET), which would otherwise
      // move it out from under the cursor and cause hover to flicker onto a
      // neighboring plane.
      const intersects = raycaster.intersectObjects(planes.map((p) => p.hitMesh));

      if (intersects.length > 0) {
        const hovered = planes.find((p) => p.hitMesh === intersects[0].object);
        if (hovered) {
          // Play sound only when hovering a new mesh
          // if (state.lastHoveredMesh !== hovered.mesh) {
          //   playHoverSound();
          //   state.lastHoveredMesh = hovered.mesh;
          // }
          
          showTooltip(hovered.folder, event.clientX, event.clientY);
          hoveredMeshRef.current = hovered.mesh;
        }
      } else {
        hideTooltip();
        hoveredMeshRef.current = null;
        state.lastHoveredMesh = null;
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (!folders.length || event.deltaMode !== 0) return;
      
      const now = Date.now();
      if (now - state.lastScrollTime < SCROLL_COOLDOWN) return;
      
      state.scrollIndex = (state.scrollIndex + (event.deltaY > 0 ? 1 : -1) + folders.length) % folders.length;
      state.lastScrollTime = now;
      updatePlanePositions(planes, state.scrollIndex);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        state.touchStartY = event.touches[0].clientY;
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (state.touchStartY === null) return;
      
      const deltaY = state.touchStartY - event.touches[0].clientY;
      if (Math.abs(deltaY) > DELTA_THRESHOLD) {
        state.scrollIndex = (state.scrollIndex + (deltaY > 0 ? 1 : -1) + folders.length) % folders.length;
        updatePlanePositions(planes, state.scrollIndex);
        state.touchStartY = event.touches[0].clientY;
      }
    };

    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('wheel', onWheel);
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false });
  };

  const updateMousePosition = (
    event: MouseEvent, 
    element: HTMLElement, 
    mouse: THREE.Vector2
  ) => {
    const rect = element.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  };

  const showTooltip = (folder: string, x: number, y: number) => {
    if (!tooltipRef.current) return;
    
    tooltipRef.current.style.display = 'block';
    tooltipRef.current.textContent = folder.replace(/\/$/, '').replace(/-/g, ' ');
    tooltipRef.current.style.left = x + 10 + 'px';
    tooltipRef.current.style.top = y + 10 + 'px';
  };

  const hideTooltip = () => {
    if (tooltipRef.current) {
      tooltipRef.current.style.display = 'none';
    }
  };

  const animate = (
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.OrthographicCamera,
    planes: { mesh: THREE.Mesh; folder: string; hitMesh: THREE.Mesh }[],
    state: ReturnType<typeof createState>
  ) => {
    const loop = () => {
      if (state.stop) return;
      requestAnimationFrame(loop);

      state.currentIndex += (state.scrollIndex - state.currentIndex) * ANIMATION_SPEED;

      planes.forEach(({ mesh }) => {
        const offset = hoveredMeshRef.current === mesh ? HOVER_OFFSET : 0;
        const baseX = mesh.userData.baseX ?? mesh.position.x;
        mesh.userData.baseX = baseX;
        mesh.position.x += (baseX + offset - mesh.position.x) * HOVER_SPEED;
      });

      renderer.render(scene, camera);
    };

    loop();
  };

  const cleanupScene = (
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    planes: { mesh: THREE.Mesh; folder: string; hitMesh: THREE.Mesh }[],
    tooltip: HTMLDivElement | null
  ) => {
    document.body.style.overflow = 'hidden';
    window.removeEventListener('resize', () => {});

    planes.forEach(({ mesh, hitMesh }) => {
      scene.remove(mesh);
      if (mesh.material instanceof THREE.Material) {
        mesh.material.dispose();
      }
      mesh.geometry.dispose();
      if ((mesh.material as any).map) {
        (mesh.material as any).map.dispose();
      }
      // hitMesh shares mesh's (already-disposed) geometry -- only its own
      // material needs cleanup here.
      if (hitMesh.material instanceof THREE.Material) {
        hitMesh.material.dispose();
      }
    });

    renderer.dispose();

    if (renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }

    if (tooltip) {
      tooltip.style.display = 'none';
    }
  };

  return (
    <div ref={containerRef} className="w-full relative overflow-y-hidden">
      <div
        ref={tooltipRef}
        style={{
          display: 'none',
          position: 'fixed',
          pointerEvents: 'none',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '14px',
          zIndex: 1000,
          maxWidth: '300px',
          whiteSpace: 'nowrap',
        }}
      />
    </div>
  );
}

export default FolderDisplay;
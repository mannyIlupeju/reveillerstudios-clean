'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { useFolders } from '@/Context/context/FoldersContext';

type FolderDisplayProps = {
  folders: string[];
};

function FolderDisplay({ folders }: FolderDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoveredMeshRef = useRef<THREE.Mesh | null>(null);
  const router = useRouter();
  const { setFolders } = useFolders();

  // Set folders in context
  useEffect(() => {
    if (folders && folders.length > 0) {
      setFolders(folders);
    }
  }, [folders, setFolders]);

  useEffect(() => {
    if (!containerRef.current || !folders || folders.length === 0) return;

    document.body.style.overflow = 'hidden';

    const dpr = window.devicePixelRatio || 1;
    const tooltipNode = tooltipRef.current;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const getCameraZoom = (width: number) => {
      if (width > 1280) return 0.5;
      if (width > 768) return 0.35;
      return 0.32;
    };

    const frustumSize = 1000;
    const aspect = window.innerWidth / window.innerHeight;

    const camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      1,
      5000
    );
    camera.position.set(600, 800, 1000);
    camera.zoom = getCameraZoom(window.innerWidth);
    camera.updateProjectionMatrix();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspect = width / height;

      camera.left = (-frustumSize * aspect) / 2;
      camera.right = (frustumSize * aspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.zoom = getCameraZoom(width);
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    const light = new THREE.AmbientLight(0xffffff, 10);
    scene.add(light);

    const loader = new THREE.TextureLoader();
    const planes: { mesh: THREE.Mesh; folder: string }[] = [];

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let scrollIndex = 0;
    let currentIndex = 0;
    let lastScrollTime = 0;
    const SCROLL_COOLDOWN = 120;
    const DELTA_THRESHOLD = 40;

    let cancelled = false;

    const onClick = (event: MouseEvent) => {
      if (!renderer.domElement) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planes.map((p) => p.mesh));
      if (intersects.length > 0) {
        const clicked = planes.find((p) => p.mesh === intersects[0].object);
        if (clicked) {
          router.push(`/gallery/${encodeURIComponent(clicked.folder)}`);
        }
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!renderer.domElement || !tooltipRef.current) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planes.map((p) => p.mesh));
      if (intersects.length > 0) {
        const hovered = planes.find((p) => p.mesh === intersects[0].object);
        if (hovered) {
          tooltipRef.current.style.display = 'block';
          tooltipRef.current.textContent = hovered.folder.replace(/\/$/, '').replace(/-/g, ' ');
          tooltipRef.current.style.left = event.clientX + 10 + 'px';
          tooltipRef.current.style.top = event.clientY + 10 + 'px';
          hoveredMeshRef.current = hovered.mesh;
        }
      } else {
        tooltipRef.current.style.display = 'none';
        hoveredMeshRef.current = null;
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (!folders.length || event.deltaMode !== 0) return;
      const now = Date.now();
      if (now - lastScrollTime < SCROLL_COOLDOWN) return;
      scrollIndex = (scrollIndex + (event.deltaY > 0 ? 1 : -1) + folders.length) % folders.length;
      lastScrollTime = now;
      updatePlanePositions();
    };

    let touchStartY: number | null = null;
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) touchStartY = event.touches[0].clientY;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (touchStartY === null) return;
      const deltaY = touchStartY - event.touches[0].clientY;
      if (Math.abs(deltaY) > DELTA_THRESHOLD) {
        scrollIndex = (scrollIndex + (deltaY > 0 ? 1 : -1) + folders.length) % folders.length;
        updatePlanePositions();
        touchStartY = event.touches[0].clientY;
      }
    };

    const updatePlanePositions = () => {
      planes.forEach((plane, i) => {
        const displayIndex = (i - scrollIndex + folders.length) % folders.length;
        const mesh = plane.mesh;
        mesh.position.set(displayIndex * 250, displayIndex * 300, -displayIndex * 200);
        mesh.rotation.set(
          THREE.MathUtils.degToRad(4),
          THREE.MathUtils.degToRad(-15),
          THREE.MathUtils.degToRad(-1.5)
        );
        mesh.userData.baseX = mesh.position.x;
      });
    };

    let stop = false;
    const animate = () => {
      if (stop) return;
      requestAnimationFrame(animate);
      currentIndex += (scrollIndex - currentIndex) * 0.05;

      planes.forEach(({ mesh }) => {
        const offset = hoveredMeshRef.current === mesh ? 400 : 0;
        const baseX = mesh.userData.baseX ?? mesh.position.x;
        mesh.userData.baseX = baseX;
        mesh.position.x += (baseX + offset - mesh.position.x) * 0.5;
      });

      renderer.render(scene, camera);
    };

    // Clean up planes before loading new ones
    planes.length = 0;

    folders.forEach((folder, index) => {
      const folderPath = folder.replace(/\/?$/, '/');
      const imageUrl = `https://${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${folderPath}thumbnail.jpg`;

      loader.load(imageUrl, (texture) => {
        if (cancelled) {
          texture.dispose();
          return;
        }
        const geometry = new THREE.PlaneGeometry(1000, 700);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);
        planes.push({ mesh: plane, folder });

        updatePlanePositions();
      });
    });

    animate();

    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('wheel', onWheel);
    renderer.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    renderer.domElement.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      stop = true;
      cancelled = true;
      document.body.style.overflow = 'hidden';
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('touchstart', onTouchStart);
      renderer.domElement.removeEventListener('touchmove', onTouchMove);

      // 🧼 Clean up meshes and dispose materials/textures
      planes.forEach(({ mesh }) => {
        scene.remove(mesh);
        if (mesh.material instanceof THREE.Material) {
          mesh.material.dispose();
        }
        mesh.geometry.dispose();
        if ((mesh.material as any).map) {
          (mesh.material as any).map.dispose();
        }
      });

      renderer.dispose();

      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }

      if (tooltipNode) {
        tooltipNode.style.display = 'none';
      }
    };
  }, [folders, router]);

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
'use client'

import React from 'react'   
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';



function FolderDisplay({ folders }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  // Hovered mesh state (useRef for stable reference)
  const hoveredMeshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Remove any existing canvas before appending a new one
    const prevCanvas = containerRef.current.querySelector('canvas');
    if (prevCanvas) containerRef.current.removeChild(prevCanvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 900;
    camera.position.x = 600;
    camera.position.y = 600;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Lights (optional for texture shading)
    const color = new THREE.Color(0xffffff);
    const light = new THREE.AmbientLight(color, 10);
    light.position.set(1, 1, 1);
    scene.add(light);

    const loader = new THREE.TextureLoader();
    const planes: { mesh: THREE.Mesh, folder: string }[] = [];

    let scrollIndex = 0;
    const numFolders = folders.length;


    folders.forEach((folder, index) => {
      // Ensure only one slash between folder and thumbnail.jpg
      const folderPath = folder.replace(/\/?$/, '/');
      const imageUrl = `https://${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${folderPath}thumbnail.jpg`;

      loader.load(imageUrl, (texture) => {
        const geometry = new THREE.PlaneGeometry(1000, 700); // image size
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const plane = new THREE.Mesh(geometry, material);

        // Stack logic with isometric angle
        plane.position.x = index * 250;
        plane.position.y = index * 300;
        plane.position.z = -index * 200;

        plane.rotation.x = THREE.MathUtils.degToRad(4);
        plane.rotation.y = THREE.MathUtils.degToRad(-15);
        plane.rotation.z = THREE.MathUtils.degToRad(-1.5);

        scene.add(plane);
        planes.push({ mesh: plane, folder });
      });
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Tooltip state
    let tooltipVisible = false;
    let tooltipFolder = '';

   function onClick(event: MouseEvent) {
      if (!renderer.domElement) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planes.map(p => p.mesh));
      if (intersects.length > 0) {
        const clicked = planes.find(p => p.mesh === intersects[0].object);
        if (clicked) {
          router.push(`?prefix=${encodeURIComponent(clicked.folder)}`);
        }
      }
    }
    
    renderer.domElement.addEventListener('click', onClick);

    // Tooltip mousemove handler
    function onMouseMove(event: MouseEvent) {
      if (!renderer.domElement || !tooltipRef.current) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planes.map(p => p.mesh));
      if (intersects.length > 0) {
        const hovered = planes.find(p => p.mesh === intersects[0].object);
        if (hovered) {
          tooltipVisible = true;
          tooltipFolder = hovered.folder;
          tooltipRef.current.style.display = 'block';
          // Remove trailing slash and replace '-' with space for display
          tooltipRef.current.textContent = hovered.folder.replace(/\/$/, '').replace(/-/g, ' ');
          tooltipRef.current.style.left = event.clientX + 10 + 'px';
          tooltipRef.current.style.top = event.clientY + 10 + 'px';
          hoveredMeshRef.current = hovered.mesh;
        }
      } else {
        tooltipVisible = false;
        tooltipRef.current.style.display = 'none';
        hoveredMeshRef.current = null;
      }
    }
    renderer.domElement.addEventListener('mousemove', onMouseMove);

      // Handle scroll event
  function onWheel(event: WheelEvent) {
    if (!numFolders) return;
    if (event.deltaY > 0) {
      scrollIndex = (scrollIndex + 1) % numFolders;
    } else if (event.deltaY < 0) {
      scrollIndex = (scrollIndex - 1 + numFolders) % numFolders;
    }
    updatePlanePositions();
  }
  renderer.domElement.addEventListener('wheel', onWheel);
  

  // Update plane positions based on scrollIndex (looping)
  function updatePlanePositions() {
    for (let i = 0; i < planes.length; i++) {
      const displayIndex = (i - scrollIndex + numFolders) % numFolders;
      const mesh = planes[i].mesh;
      mesh.position.x = displayIndex * 250; // Adjust x position based on display index
      mesh.position.y = displayIndex * 300;
      mesh.position.z = -displayIndex * 200;
      mesh.rotation.x = THREE.MathUtils.degToRad(4);
      mesh.rotation.y = THREE.MathUtils.degToRad(-15);
      mesh.rotation.z = THREE.MathUtils.degToRad(-1.5);
      // Reset baseX after scroll so hover slide is always relative to new position
      mesh.userData.baseX = mesh.position.x;
    }
  }

  // Initial positions (wait for planes to load)
  setTimeout(updatePlanePositions, 300);

    // Render loop with stop flag
    let stop = false;
    const animate = () => {
      if (stop) return;
      requestAnimationFrame(animate);
      // Slide hovered mesh 3 inches (228 units) to the right
      for (let i = 0; i < planes.length; i++) {
        const mesh = planes[i].mesh;
        let targetOffset = 0;
        if (hoveredMeshRef.current && mesh === hoveredMeshRef.current) {
          targetOffset = 400; // 3 inches to the right
        }
        if (!mesh.userData.baseX) mesh.userData.baseX = mesh.position.x;
        const baseX = mesh.userData.baseX;
        const currentX = mesh.position.x;
        const desiredX = baseX + targetOffset;
        mesh.position.x += (desiredX - currentX) * 0.15;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      stop = true;
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.forceContextLoss();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      if (tooltipRef.current) {
        tooltipRef.current.style.display = 'none';
      }
    };
  }, [folders, router]);

  return (
    <div ref={containerRef} className="w-full relative">
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

export default FolderDisplay
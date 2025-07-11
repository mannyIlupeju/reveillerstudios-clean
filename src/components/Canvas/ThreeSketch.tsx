import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { useCanvas } from '../../Context/context/CanvasContext';
import * as motion from "motion/react-client"



const ThreeSketch = () => {
  const { backgroundCanvasRef } = useCanvas()
  const modelRef = useRef<THREE.Group | null>(null);


  const [box2Pos, setBox2Pos] = useState({ x: 0, y: 0 });


  
  useEffect(() => {

    if(!backgroundCanvasRef.current){
      console.warn("backgroundCanvasRef.current is not set")
      return;
    }

    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd3d3d3); // Dark gray  

    const aspect = {
      width: window.innerWidth,
      height: window.innerHeight,
    };


    const canvas = backgroundCanvasRef.current;
    if (!canvas) return;

    const camera = new THREE.PerspectiveCamera(75, aspect.width / aspect.height);
    scene.add(camera);
    camera.position.z = 5;


  
    
    const modelGroup = new THREE.Group()
    scene.add(modelGroup)

    

    const dracoLoader = new DRACOLoader();
        // Point to public/draco/ where the Draco decoder files are located
    dracoLoader.setDecoderPath("/draco/");
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    // Load the model (try .gltf first, then fallback to .glb)
    function loadModel(path: string) {
      if (!path.endsWith('.gltf')) {
        console.warn(`Expected a .gltf file but got: ${path}`);
        return;
      }
    
      gltfLoader.load(
        path,
        (gltf) => {
          modelRef.current = gltf.scene;
          updateModelScale();
          modelGroup.add(modelRef.current as THREE.Object3D);
        },
        undefined,
        (error) => {
          console.error(`❌ Failed to load .gltf at ${path}:`, error);
        }
      );
    }

    // Replace existing gltfLoader.load call with loadModel
    loadModel("/models/GLTF/10rvr3dlogoMetal.gltf");

    const controls = new OrbitControls(camera, canvas);
   
    controls.enableZoom = false;


    function updateModelScale() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const scaleFactor = Math.min(windowWidth / 50, windowHeight / 50);
      if (modelRef.current) {
        modelRef.current.scale.set(scaleFactor * 2, scaleFactor * 2, scaleFactor * 2);
      }
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);


    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));



    const handleResize = () => {
      aspect.width = window.innerWidth;
      aspect.height = window.innerHeight;
      camera.aspect = aspect.width / aspect.height;
      camera.updateProjectionMatrix();
      renderer.setSize(aspect.width, aspect.height);
      // renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      updateModelScale();
    };

    window.addEventListener("resize", handleResize);

    // Add Clock to calculate delta time for controls update
        const rotationSpeed = 0.001; // Control speed of the rotation


        // Animate the scene
        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate the model if it's loaded
            modelGroup.rotation.y += 0.01;
            controls.update()
            renderer.render(scene, camera);
        };
        
        animate();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
  }, [backgroundCanvasRef]);

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
          className="box box1 flex  justify-center items-center relative cursor-grab">
          <video autoPlay loop muted className="videoOverlay absolute inset-0 w-full h-full object-cover z-9">
            <source 
            src="https://res.cloudinary.com/dnlk9ni2i/video/upload/v1752161010/TANKREEL1_srw8nk.mov"
            />
          </video>
         
           {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 z-10"></div>

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
        >
          <video width="300" height="auto" autoPlay loop muted className="videoOverlay absolute inset-0 w-full h-full object-cover z-9">
            <source 
            src="https://res.cloudinary.com/dnlk9ni2i/video/upload/v1752160913/aboutvid1_nufcct.mp4"
            />
          </video>
           {/* Overlay */}
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Text */}
          <h1 className="z-20 text-white text-xl font-bold">About</h1>

        </motion.div>
        
       
       
    </>
  )
};

export default ThreeSketch;
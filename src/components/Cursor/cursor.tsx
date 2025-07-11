import React, { useRef, useEffect } from "react";
import { useCanvas } from "@/Context/context/CanvasContext";
import "./Cursor.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";


const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const { canvasPosition } = useCanvas();
  const margin = 50;


  useGSAP(()=> {
    gsap.set(".custom-cursor", { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(".custom-cursor", "x", { duration: 0.6, ease: "power3"});
    const yTo = gsap.quickTo(".custom-cursor", "y", {duration: 0.6, ease: "power3"})

    window.addEventListener("mousemove", e => {
      xTo(e.clientX);
      yTo(e.clientY);
    })
  })

    

  return <div className='custom-cursor' ref={cursorRef}></div>;
};

export default Cursor;
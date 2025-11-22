"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 640; // < 640px = mobile

export default function BackgroundVisual() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initial check
    const checkWidth = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      }
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);

    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const src = isMobile
    ? "https://res.cloudinary.com/doynaagx7/video/upload/v1763756906/mannybiz_d7x5qs.mp4"
    : "https://res.cloudinary.com/doynaagx7/video/upload/v1763752699/backgroundgif_yxsb5z.mp4";

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <video
        key={isMobile ? "mobile" : "desktop"} // 👈 forces remount when mode changes
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        controls={false}
        className="w-full h-full object-cover object-top"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
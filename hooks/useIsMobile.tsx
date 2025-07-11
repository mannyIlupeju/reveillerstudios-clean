import React, {useEffect, useState} from 'react'

export default function useIsMobile(breakpoint = 1000) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(()=> {
    const handleResize = () => {
        if (typeof window !== 'undefined') {
          setIsMobile(window.innerWidth < breakpoint);
        }
    };
  
    handleResize(); // initial check

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize)
  },[breakpoint])


  return isMobile;
}

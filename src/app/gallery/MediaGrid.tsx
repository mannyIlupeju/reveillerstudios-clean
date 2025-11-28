'use client';

import React, {useState, useEffect} from 'react';
import Image from 'next/image';

type Props = {
  files: string[];
};

const CLOUDFRONT_DOMAIN = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN;

export default function MediaGrid({ files }: Props) {

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 justify-center align-center justify-items-center">
      {files.map((file, idx) => {
        const url = `${file}`;
        console.log("File URL:", url);
        const ext = file?.split('.').pop()?.toLowerCase();
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext || '');
        const isVideo = ['mp4', 'mov', 'MOV', 'webm', 'avi', 'mkv', 'ogg'].includes(ext || '');

        // ⬇️ Skip if it's not an image or video
       if (!isImage && !isVideo) return null;
       
        return (
          <div key={url}>
            {isImage ? (
              <Image
              src={url} 
              alt={`Image ${idx + 1}`} 
              className="w-full h-auto rounded-lg" 
              width={800}
              height={800}
              />
            ) : isVideo ? (
              <video controls className="w-full rounded-lg">
                <source src={url} type={`video/${ext}`} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <a href={url} target="_blank" rel="noopener noreferrer">{file}</a>
            )}
          </div>
        );
      })}
       {showScrollTop && (
        <button
          onClick={handleScrollTop}
          aria-label="Back to top"
          className={`
            fixed bottom-18 right-0 bg-black text-white rounded-full p-4 shadow-lg
            hover:bg-gray-800 transition-all duration-300 ease-in z-50
            opacity-100 translate-y-0
            `} style={{ fontSize: 28, lineHeight: 1 }}
        >
          {/* Up arrow icon (SVG) */}
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>

    
  );
}
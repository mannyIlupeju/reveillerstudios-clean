'use client';

import React, { useRef } from 'react';
import MediaGrid from '../MediaGrid';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getArchiveData } from '@/utils/ArchiveDetail/archiveDetail';
import humanizeString from 'humanize-string';
import { useFolders } from '@/Context/context/FoldersContext';

// The interactive archive folder view. Split out from page.tsx so the
// route can keep a server-rendered page.tsx with real per-folder
// metadata (title/description/canonical) -- a 'use client' page can't
// export generateMetadata, but a client component can still take the
// already-decoded slug as a prop instead of reading it itself.
export default function MediaPageClient({ decodedPrefix }: { decodedPrefix: string }) {
  const { savedFolders } = useFolders();
  console.log('Saved folders:', savedFolders);

  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('Decoded prefix:', decodedPrefix);

  const router = useRouter();
  const gridRef = useRef<HTMLDivElement>(null);


  const archiveData = getArchiveData(decodedPrefix);

   // Scroll to next media item in the grid
  // Go to next folder
  // const handleNextFolder = () => {
  //   if (!savedFolders || savedFolders.length === 0) return;
  //   const currentIndex = savedFolders.indexOf(decodedPrefix);
  //   if (currentIndex === -1) return;
  //   const nextIndex = (currentIndex + 1) % savedFolders.length;
  //   const nextFolder = savedFolders[nextIndex];
  //   router.push(`/gallery/${encodeURIComponent(nextFolder)}`);
  // };


  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/s3/files?prefix=${encodeURIComponent(decodedPrefix)}`);
        const data = await res.json();
        console.log('Fetched files:', data.files);
        if (res.ok) {
          setFiles(data.files || []);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (err) {
        console.error('Failed to load files:', err);
        setFiles([]);
      } finally {
        setLoading(false);  
      }
    };
    fetchFiles();
  }, [decodedPrefix]);

  return (
    <div className="p-8">
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => router.push('/gallery')}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 font-medium"
        >
          ← Back to Archive
        </button>

        {/* <button
          onClick={handleNextFolder}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 font-medium"
        >
          Next
        </button> */}
      </div>
        {archiveData.map((item, idx) => {
          return (
            <div key={idx} className="2xl:mb-52 mb-4 ">
              <h2 className="text-xl font-semibold mb-2">
                {humanizeString(item.title)}
              </h2>
              <div
                dangerouslySetInnerHTML={{ __html: item.content }}
                className="prose text-gray-900 "
              />
            </div>
          );
        })}
      {loading ? <p>Loading...</p> : <MediaGrid files={files} />}
    </div>
  );
}

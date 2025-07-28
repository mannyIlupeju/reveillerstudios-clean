'use client';

import React, {useRef} from 'react';
import MediaGrid from '../MediaGrid';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getArchiveData } from '@/utils/ArchiveDetail/archiveDetail';
import humanizeString from 'humanize-string';

type MediaPageProps = {
  searchParams: { prefix?: string };
};

export default function MediaPage({ searchParams }: MediaPageProps) {
  const { prefix } = useParams();
  const decodedPrefix = decodeURIComponent(prefix as string);

  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('Decoded prefix:', decodedPrefix);

  const router = useRouter();
  const gridRef = useRef<HTMLDivElement>(null);


  const archiveData = getArchiveData(decodedPrefix);

   // Scroll to next media item in the grid
  const handleNext = () => {
    if (!gridRef.current) return;
    const mediaItems = gridRef.current.querySelectorAll('img, video, a');
    if (mediaItems.length === 0) return;
    // Find the first item below the current scroll position
    const scrollY = window.scrollY;
    for (let i = 0; i < mediaItems.length; i++) {
      const el = mediaItems[i] as HTMLElement;
      const rect = el.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      if (absoluteTop > scrollY + 10) {
        window.scrollTo({ top: absoluteTop - 40, behavior: 'smooth' });
        break;
      }
    }
  };

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
          ← Back to Gallery
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 font-medium"
        >
          Next
        </button>
      </div>
        {archiveData.map((item, idx) => {
          return (
            <div key={idx} className="2xl:mb-52 mb-4">
              <h2 className="text-xl font-semibold mb-2">
                {humanizeString(item.title)}
              </h2>
              <div
                dangerouslySetInnerHTML={{ __html: item.content }}
                className="prose text-gray-700"
              />
            </div>
          );
        })}
      {loading ? <p>Loading...</p> : <MediaGrid files={files} />}
    </div>
  );
}
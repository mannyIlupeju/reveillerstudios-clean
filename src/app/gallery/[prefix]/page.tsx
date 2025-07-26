'use client';

import React from 'react';
import MediaGrid from '../MediaGrid';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type MediaPageProps = {
  searchParams: { prefix?: string };
};

export default function MediaPage({ searchParams }: MediaPageProps) {
  const { prefix } = useParams();
  const decodedPrefix = decodeURIComponent(prefix as string);

  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('Decoded prefix:', decodedPrefix);

  console.log(files)

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
      <h1 className="text-2xl font-bold mb-6">
        Files in: {decodedPrefix}
      </h1>
      {loading ? <p>Loading...</p> : <MediaGrid files={files} />}
    </div>
  );
}
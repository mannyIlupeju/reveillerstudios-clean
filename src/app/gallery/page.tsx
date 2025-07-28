import { listS3Objects } from "@/lib/s3Client";
import FolderDisplay from './FolderDisplay';
import React from 'react';
import { useParams } from 'next/navigation';
import './gallery.css';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Explore our gallery of creative works and projects.',
};

type GalleryPageProps = {
  params: Record<string, string>;
  searchParams?: { prefix?: string };
};


export default async function GalleryPage({ searchParams }: { params: any; searchParams?: { prefix?: string } }) {
  const prefix = searchParams?.prefix || '';
  
  const { folders } = await listS3Objects(prefix);
  console.log(folders);

  return (
    <div>
     
      <FolderDisplay folders={folders.filter((folder): folder is string => typeof folder === 'string')}/>
    </div>
  );
}
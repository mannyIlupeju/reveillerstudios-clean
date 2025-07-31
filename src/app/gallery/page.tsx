import { listS3Objects } from "@/lib/s3Client";
import FolderDisplay from './FolderDisplay';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Explore our gallery of creative works and projects.',
};



export default async function GalleryPage({
  searchParams,
}: {
  searchParams?: { prefix?: string };
}) {
  const prefix = searchParams?.prefix || '';
  const { folders } = await listS3Objects(prefix);

  return (
    <div>
      <FolderDisplay
        folders={folders.filter((folder): folder is string => typeof folder === 'string')}
      />
    </div>
  );
}
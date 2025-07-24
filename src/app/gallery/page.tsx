import { listS3Objects } from "@/lib/s3Client";
import FolderDisplay from './FolderDisplay';
import MediaGrid from './MediaGrid';
import React from 'react';


export default async function GalleryPage({searchParams}: {searchParams: {prefix?: string}}) {
  const prefix = searchParams?.prefix || '';
  const { folders, files } = await listS3Objects(prefix);
  return (
    <div className="overflow-hidden">
      <FolderDisplay folders={folders} />
      <MediaGrid files={files} />
    </div>
  );
}
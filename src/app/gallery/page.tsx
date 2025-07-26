import { listS3Objects } from "@/lib/s3Client";
import FolderDisplay from './FolderDisplay';
import React from 'react';
import './gallery.css';


export default async function GalleryPage({searchParams}: {searchParams: {prefix?: string}}) {
  const prefix = searchParams?.prefix || '';
  
  const { folders } = await listS3Objects(prefix);
  console.log(folders);

  return (
    <div>
     
      <FolderDisplay folders={folders.filter((folder): folder is string => typeof folder === 'string')}/>
    </div>
  );
}
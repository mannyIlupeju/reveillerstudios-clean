import { listS3Objects } from "@/lib/s3Client";
import FolderDisplay from './FolderDisplay';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import React from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Explore our gallery of creative works and projects.',
};

export default async function Page() {
  // ✅ Get full request URL from headers
  const headersList = await headers();
  const url = new URL(headersList.get('x-url') || 'http://localhost'); // fallback for dev
  const rawPrefix = url.searchParams.get('prefix');

  const prefix = rawPrefix || '';

  const { folders } = await listS3Objects(prefix);

  return (
    <div>
      <FolderDisplay
        folders={folders.filter((folder): folder is string => typeof folder === 'string')}
      />
    </div>
  );
}
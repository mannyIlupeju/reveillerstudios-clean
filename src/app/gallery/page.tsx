import { listS3Objects } from "@/lib/s3Client";

import FolderDisplay from './FolderDisplay';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import React from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Explore our archive of creative works and projects.',
};

export default async function Page() {
  const headersList = await headers(); // ✅ Fixed here
  const host = headersList.get('host') || 'localhost:3000';
  const proto = headersList.get('x-forwarded-proto') || 'http';
  const pathname = headersList.get('x-next-url') || '/archive';
  const url = new URL(`${proto}://${host}${pathname}`);

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
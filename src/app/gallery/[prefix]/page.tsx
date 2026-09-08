import type { Metadata } from 'next';
import humanizeString from 'humanize-string';
import MediaPageClient from './MediaPageClient';

type PageProps = { params: Promise<{ prefix: string }> };

// This route used to be a single 'use client' component with no metadata
// export at all (a client component can't export one), so every archive
// folder shared the generic /gallery title and description in search
// results. Server-side metadata generation is split into this thin
// wrapper; the interactive folder view itself lives in MediaPageClient.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { prefix } = await params;
  const decodedPrefix = decodeURIComponent(prefix);
  const title = humanizeString(decodedPrefix);

  return {
    title,
    description: `${title} -- part of the Reveiller Studios archive of creative shoots, pop ups and never seen before footage.`,
    alternates: { canonical: `https://www.reveillerstudios.com/gallery/${prefix}` },
  };
}

export default async function MediaPage({ params }: PageProps) {
  const { prefix } = await params;
  const decodedPrefix = decodeURIComponent(prefix);

  return <MediaPageClient decodedPrefix={decodedPrefix} />;
}

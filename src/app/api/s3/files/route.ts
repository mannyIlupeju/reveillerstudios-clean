import { NextResponse } from 'next/server';
import { listS3Objects } from '../../../../lib/s3Client';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const prefix = url.searchParams.get('prefix') || '';

  try {
    const data = await listS3Objects(prefix);

    const CLOUDFRONT_DOMAIN = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN;
    const fileUrls = data.files.map(file => `https://${CLOUDFRONT_DOMAIN}/${file}`);        


    return NextResponse.json({
     folders: data.folders,
     files: fileUrls,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch S3 data' }, { status: 500 });
  }
}
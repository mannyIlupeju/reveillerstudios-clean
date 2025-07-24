import React from 'react';

type Props = {
  files: string[];
};

const CLOUDFRONT_DOMAIN = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN || 'dvztt66ngx2v3.cloudfront.net';

export default function MediaGrid({ files }: Props) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 ps-8">
      {files.map((file, idx) => {
        const url = `https://${CLOUDFRONT_DOMAIN}/${file}`;
        const ext = file?.split('.').pop()?.toLowerCase();
        const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext || '');
        const isVideo = ['mp4', 'mov', 'webm', 'avi', 'mkv', 'ogg'].includes(ext || '');
        return (
          <div key={url}>
            {isImage ? (
              <img src={url} alt={`Image ${idx + 1}`} className="w-full h-auto rounded-lg" />
            ) : isVideo ? (
              <video controls className="w-full rounded-lg">
                <source src={url} type={`video/${ext}`} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <a href={url} target="_blank" rel="noopener noreferrer">{file}</a>
            )}
          </div>
        );
      })}
    </div>
  );
}
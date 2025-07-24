import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();


const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function listS3Objects(prefix = '') {
  const command = new ListObjectsV2Command({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Delimiter: '/',
    Prefix: prefix, // Use the provided prefix to filter objects
  });

  const result = await s3.send(command);
  return {
    folders: result.CommonPrefixes?.map((item) => item.Prefix) ?? [],
    files: result.Contents?.map((item) => item.Key) ?? [],
  };
}
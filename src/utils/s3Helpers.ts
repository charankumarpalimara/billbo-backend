import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "../config/s3";
import { Readable } from "stream";

const getBucketName = () => process.env.AWS_BUCKET_NAME || "tv-ads-bucket";

/**
 * Extracts the S3 Key from a full S3 URL
 */
export const getS3KeyFromUrl = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("amazonaws.com")) {
      return decodeURIComponent(parsedUrl.pathname.substring(1));
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Deletes an object from S3 using its key or full URL
 */
export const deleteFileFromS3 = async (urlOrKey: string): Promise<void> => {
  const key = urlOrKey.startsWith("http") ? getS3KeyFromUrl(urlOrKey) : urlOrKey;
  if (!key) {
    throw new Error("Invalid S3 URL or Key");
  }

  const command = new DeleteObjectCommand({
    Bucket: getBucketName(),
    Key: key,
  });

  await s3.send(command);
};

/**
 * Downloads an object from S3 and returns it as a Buffer
 */
export const downloadFileFromS3 = async (urlOrKey: string): Promise<Buffer> => {
  const key = urlOrKey.startsWith("http") ? getS3KeyFromUrl(urlOrKey) : urlOrKey;
  if (!key) {
    throw new Error("Invalid S3 URL or Key");
  }

  const command = new GetObjectCommand({
    Bucket: getBucketName(),
    Key: key,
  });

  const response = await s3.send(command);
  const stream = response.Body as Readable;

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
};

/**
 * Generates a pre-signed URL for downloading an object from S3
 */
export const getPresignedDownloadUrl = async (urlOrKey: string, expiresIn: number = 3600): Promise<string> => {
  const key = urlOrKey.startsWith("http") ? getS3KeyFromUrl(urlOrKey) : urlOrKey;
  if (!key) {
    throw new Error("Invalid S3 URL or Key");
  }

  const command = new GetObjectCommand({
    Bucket: getBucketName(),
    Key: key,
  });

  return await getSignedUrl(s3, command, { expiresIn });
};

import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: process.env.AWS_REGION || "ap-south-1"
});

export async function listS3Objects() {
    const command = new ListObjectsV2Command({
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: "tv_ads/"
    });
    const data = await s3.send(command);
    return data.Contents;
}

export default s3;
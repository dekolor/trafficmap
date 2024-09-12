import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export const revalidate = 0;

export async function GET() {
  const folderPath = "screenshots/";

  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Prefix: folderPath,
    });

    const response = await s3.send(command);
    const files = response.Contents?.filter(Boolean) || [];

    const imageUrls = files.map((item) => ({
      key: item.Key!,
      url: `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${item.Key}`,
      createdAt: item.LastModified?.toISOString(),
    }));

    return NextResponse.json(imageUrls);
  } catch (error) {
    console.error("Error listing objects in S3:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

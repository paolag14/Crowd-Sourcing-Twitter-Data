import * as AWS from "@aws-sdk/client-s3";
import {
  PutObjectCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET_NAME = String(process.env.S3_URL);
const IAM_ACCESS_KEY = String(process.env.AWS_ACCESS_KEY_ID);
const IAM_SECRET_ACCESS_KEY = String(process.env.AWS_SECRET_ACCESS_KEY);

const s3 = new AWS.S3Client({
  endpoint: process.env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: IAM_ACCESS_KEY,
    secretAccessKey: IAM_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

export async function uploadToS3(
  category: string,
  fileName: string,
  expires: number
): Promise<PutObjectCommandOutput> {
  const params: S3Params = {
    Bucket: BUCKET_NAME,
    Key: category + "/" + fileName,
  };

  const objectUpload = new PutObjectCommand(params);
  return await getSignedUrl(s3, objectUpload, {
    expiresIn: expires,
  })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    });
}

export async function getObject(
  prefix: string,
  fileName: string
): Promise<GetObjectCommandOutput> {
  const params: S3Params = {
    Bucket: BUCKET_NAME,
    Key: prefix + "/" + fileName,
  };
  const getObject = new GetObjectCommand(params);
  return await s3
    .send(getObject)
    .then(() => {
      return prefix + fileName;
    })
    .catch((error) => {
      return error;
    });
}

interface S3Params {
  Bucket: string;
  Key: string;
}

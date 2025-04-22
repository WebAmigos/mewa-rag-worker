import path from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

import { v4 as uuidv4 } from 'uuid';

import {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getFileExtension } from '../utils/get-file-extension';

const streamPipeline = promisify(pipeline);

const getAwsClient = () => {
  return new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
};

const deleteFromS3 = async (fileName: string) => {
  await getAwsClient().send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_DOCUMENTS_BUCKET,
      Key: fileName,
    }),
  );
};

const getFileFromS3 = async (
  fileName: string,
): Promise<{
  filePath: string;
  fileExtension: string | undefined;
}> => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_DOCUMENTS_BUCKET,
    Key: fileName,
  });

  const response = await getAwsClient().send(command);

  if (!response.Body) {
    throw new Error(`No content found for file: ${fileName}`);
  }

  const projectDir = process.cwd();
  const fileExtension = getFileExtension(fileName);
  const fileTmpPath = path.join(projectDir, `tmp/${uuidv4()}.${fileExtension}`);
  const writeStream = createWriteStream(fileTmpPath);

  try {
    await streamPipeline(response.Body as NodeJS.ReadableStream, writeStream);
  } catch {
    throw new Error(`Cannot write file to tmp directory`);
  }

  return {
    filePath: fileTmpPath,
    fileExtension,
  };
};

export const aws = {
  deleteFromS3,
  getFileFromS3,
};

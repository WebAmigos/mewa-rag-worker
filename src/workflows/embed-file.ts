import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities';

type UploadFilePayload = {
  id: number;
  public_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  created_at: Date;
  updated_at: Date | null;
  is_uploaded: boolean;
  uploaded_at: Date | null;
  embedding_status: string;
  embedding_started_at: Date | null;
  embedding_completed_at: Date | null;
  embedding_failed_at: Date | null;
  is_binary_file: boolean;
  file_extension: string;
  file_mime_type: string | null;
};

export async function runFileEmbeddings(payload: UploadFilePayload) {
  const { getFileFromS3 } = proxyActivities<typeof activities>({
    retry: {
      initialInterval: '1 second',
      maximumInterval: '1 minute',
      maximumAttempts: 5,
    },
    startToCloseTimeout: '1 minute',
  });

  console.log({ payload });

  const downloadedFile = await getFileFromS3({
    publicFileId: payload.public_id,
    fileName: payload.file_name,
  });

  const filePath = downloadedFile.filePath;

  return `Success! ${payload.public_id}, ${filePath}`;
}

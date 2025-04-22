import { aws } from '../services/aws';
import { getFileExtension } from '../utils/get-file-extension';

export async function getFileFromS3({
  publicFileId,
  fileName,
}: {
  publicFileId: string;
  fileName: string;
}) {
  // logger.log()

  const fileExtension = getFileExtension(fileName);
  const s3FileName = `${publicFileId}.${fileExtension}`;

  return await aws.getFileFromS3(s3FileName);
}

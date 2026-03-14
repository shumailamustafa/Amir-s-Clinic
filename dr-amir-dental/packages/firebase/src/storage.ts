import { createLogger, formatError } from '@dental/utils';

export interface FirebaseResult<T> {
  data: T | null;
  error: string | null;
}

export async function uploadToCloudinary(
  file: File,
  folder: string = 'dental-clinic'
): Promise<FirebaseResult<string>> {
  const logger = createLogger('firebase:storage');
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    logger.error('Cloudinary cloud name not configured');
    return { data: null, error: 'Upload configuration missing' };
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'dental_unsigned');
    formData.append('folder', folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    return { data: data.secure_url as string, error: null };
  } catch (error: any) {
    logger.error({ error: formatError(error) }, 'Cloudinary upload failed');
    return { data: null, error: 'Failed to upload image. Please try again.' };
  }
}

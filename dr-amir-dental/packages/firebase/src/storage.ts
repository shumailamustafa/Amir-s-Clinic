export async function uploadToCloudinary(
  file: File,
  folder: string = 'dental-clinic'
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    throw new Error('Cloudinary cloud name not configured');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'dental_unsigned');
  formData.append('folder', folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  const data = await response.json();
  return data.secure_url as string;
}

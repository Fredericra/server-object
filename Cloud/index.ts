import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function fetchCloudinaryResources(maxResults = 10) {
  const result = await cloudinary.api.resources({
    type: 'upload',
    max_results: maxResults,
  });
  return result.resources;
}

export async function uploadCloudinaryUrl(imageUrl: string) {
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder: 'uploads',
  });

  return {
    originalUrl: imageUrl,
    url: result.secure_url || result.url,
    public_id: result.public_id,
    asset_id: result.asset_id,
  };
}

export async function uploadCloudinaryUrls(imageUrls: string[]) {
  const results = await Promise.all(
    imageUrls.map(async (imageUrl) => uploadCloudinaryUrl(imageUrl))
  );

  return results;
}

export default cloudinary;

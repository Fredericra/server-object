import cloudinary from "./Cloudinary";

const uploadeSigle = async (
  buffer: Buffer,
  folder: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {folder},
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url as string);
      },
    );
    stream.end(buffer);
  });
};

const uploadeMultiple = async (
  buffers: Buffer[],
  folder: string,
): Promise<string[]> => {
  const urls: string[] = [];
  for (const buffer of buffers) {
    const url = await uploadeSigle(buffer, folder);
    urls.push(url);
  }
  return urls;
};

const getPublicId = (url: string, folder: string): string => {
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  if (filename === undefined) return "";
  const publicId = filename.split(".")[0];
  return `${folder}/${publicId}`;
};

const uploader = { uploadeSigle, uploadeMultiple, getPublicId };

export default uploader;

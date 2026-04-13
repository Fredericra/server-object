import { Router } from 'express';
import { fetchSampleDocuments } from '../DB';
import { fetchCloudinaryResources, uploadCloudinaryUrl, uploadCloudinaryUrls } from '../Cloud';
import { signJwtToken, verifyJwt } from '../Middlewaire/jwt';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

router.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello API endpoint' });
});

router.get('/api/sanity', async (req, res) => {
  try {
    const docs = await fetchSampleDocuments();
    res.json({ success: true, data: docs });
  } catch (error) {
    console.error('Sanity fetch error:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch Sanity data' });
  }
});

router.get('/api/cloudinary/resources', async (req, res) => {
  try {
    const resources = await fetchCloudinaryResources();
    res.json({ success: true, data: resources });
  } catch (error) {
    console.error('Cloudinary fetch error:', error);
    res.status(500).json({ success: false, message: 'Unable to fetch Cloudinary resources' });
  }
});

router.get('/api/protected', verifyJwt, (req, res) => {
  res.json({ success: true, message: 'Protected route accessed', user: (req as any).user });
});

router.post('/api/auth/token', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ success: false, message: 'username is required' });
  }

  const token = signJwtToken({ username });
  res.json({ success: true, token });
});

router.post('/api/cloudinary/upload', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'imageUrl is required' });
    }

    const result = Array.isArray(imageUrl)
      ? await uploadCloudinaryUrls(imageUrl)
      : await uploadCloudinaryUrl(imageUrl);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ success: false, message: 'Unable to upload image to Cloudinary' });
  }
});

export default router;

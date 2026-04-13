import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello from Express + TypeScript on Vercel!' });
});

router.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello API endpoint' });
});

export default router;

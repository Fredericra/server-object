import express from 'express';
import dotenv from 'dotenv';
import router from '../src/route';

if (process.env.VERCEL !== '1') {
  dotenv.config();
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/', router);

// Export the Express app for Vercel serverless
export default app;

// Optional local startup when running with "npm start" or "npm run dev" outside Vercel
if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}`);
  });
}

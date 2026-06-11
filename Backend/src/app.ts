import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

// 1. Initialize the Express application instance
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

// 2. Create a basic test route (The "Health Check")
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Pune Intern Network MVP API! Server is running cleanly."
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is securely running on http://localhost:${PORT}`);
});
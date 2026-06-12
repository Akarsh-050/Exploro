import express, { Request, Response } from 'express';
import pool, { testDatabaseConnection } from './config/db';
import authRouter from './modules/auth/auth.routes';
import { errorMiddleware } from './middlewares/error.middleware'; 
import mapsRouter from './modules/maps/maps.routes';
import podsRouter from './modules/pods/pods.routes';
import ledgerRouter from './modules/ledger/ledger.routes';
import itineraryRouter from './modules/itinerary/itinerary.routes';

import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/maps', mapsRouter);
app.use('/api/v1/pods', podsRouter);
app.use('/api/v1/ledger', ledgerRouter);
// setup a basic route (Rule based for MVP)
app.use('/api/v1/itinerary', itineraryRouter);


// 2. Create a basic test route (The "Health Check")
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Pune Intern Network MVP API! Server is running cleanly."
  });
});

app.use(errorMiddleware);

const startServer = async () => {
    await testDatabaseConnection();
    
    app.listen(PORT, () => {
    console.log(`🚀 Server is securely running on http://localhost:${PORT}`);
    });
}

startServer();

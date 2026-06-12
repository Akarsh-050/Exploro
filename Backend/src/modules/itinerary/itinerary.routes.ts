import { Router } from 'express';
import { ItineraryController } from './itinerary.controller';

const itineraryRouter = Router();
const itineraryController = new ItineraryController();

itineraryRouter.post('/generate', itineraryController.generate);

export default itineraryRouter;
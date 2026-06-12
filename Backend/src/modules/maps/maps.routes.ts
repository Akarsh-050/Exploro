import { Router } from 'express';
import { MapsController } from './maps.controller';

const mapsRouter = Router();
const mapsController = new MapsController();


mapsRouter.post('/pins', mapsController.createPin);
mapsRouter.get('/pins', mapsController.getPinsInViewport);

export default mapsRouter;
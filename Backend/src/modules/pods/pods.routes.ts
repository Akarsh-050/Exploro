import { Router } from 'express';
import { PodsController } from './pods.controller';

const podsRouter = Router();
const podsController = new PodsController();

// Route Endpoints Configuration
podsRouter.post('/', podsController.create);
podsRouter.get('/', podsController.listOpenPods);
podsRouter.post('/:id/join', podsController.join); // Dynamic URL route matching parameters

export default podsRouter;
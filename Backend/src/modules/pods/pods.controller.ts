import { Request, Response, NextFunction } from 'express';
import { PodsService } from './pods.service';
import { CreatePodSchema, JoinPodSchema } from './pods.validation';

export class PodsController {
  private podsService = new PodsService();


  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
     const validatedInput = CreatePodSchema.parse({ body: req.body });
     const newPod = await this.podsService.hostNewTravelPod(validatedInput.body);

      res.status(201).json({
        success: true,
        message: 'Travel pod successfully created on the coordination board.',
        pod: newPod,
      });
    } catch (error) {
      next(error);
    }
  };


  listOpenPods = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const openPods = await this.podsService.getOpenTravelPods();  
      res.status(200).json({
        success: true,
        count: openPods.length,
        pods: openPods,
      });
    } catch (error) {
      next(error);
    }
  };


  join = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedInput = JoinPodSchema.parse({
        params: req.params,
        body: req.body,
      });
      //  Invoke our atomic row-locked transaction service wrapper
      const updatedPod = await this.podsService.joinExistingPod(
        validatedInput.params.id,
        validatedInput.body.userId
      );
      res.status(200).json({
        success: true,
        message: 'Seat successfully claimed inside this travel pod.',
        pod: updatedPod,
      });
    } catch (error) {
      next(error);
    }
  };

  
}
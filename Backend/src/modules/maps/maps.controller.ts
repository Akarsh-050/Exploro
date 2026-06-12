import { Request, Response, NextFunction } from 'express';
import { MapsService } from './maps.service';
import { CreatePinSchema, GetPinsViewportSchema } from './maps.validation';

export class MapsController {
  private mapsService = new MapsService();

// HTTP Handler for dropping a new location pin on the map.
  createPin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedInput = CreatePinSchema.parse({ body: req.body });
      const newPin = await this.mapsService.createNewLocationPin(validatedInput.body);
      res.status(201).json({
        success: true,
        message: 'Location pin successfully created and added to the network map.',
        pin: newPin,
      });
    } catch (error) {
      next(error);
    }
  };

//  HTTP Handler for fetching pins visible within a map screen's boundaries.
  getPinsInViewport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedQuery = GetPinsViewportSchema.parse({ query: req.query });
      const pins = await this.mapsService.getLocationsWithinViewport(validatedQuery.query);
      res.status(200).json({
        success: true,
        count: pins.length,
        pins: pins,
      });
    } catch (error) {
      next(error);
    }
  };
}
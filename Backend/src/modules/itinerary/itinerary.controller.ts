import { Request, Response, NextFunction } from 'express';
import { ItineraryService } from './itinerary.service';
import { GenerateItinerarySchema } from './itinerary.validation';

export class ItineraryController {
  private itineraryService = new ItineraryService();

  generate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedInput = GenerateItinerarySchema.parse({ body: req.body });
      const itinerary = await this.itineraryService.buildFallbackItinerary(validatedInput.body);

      res.status(200).json({
        success: true,
        itinerary: itinerary
      });
    } catch (error) {
      next(error);
    }
  };
}
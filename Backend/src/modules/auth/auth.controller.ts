import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { RegisterSchema } from './auth.validation';

export class AuthController {
  private authService = new AuthService();

// Handles the HTTP network logic for registering a new intern.
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedInput = RegisterSchema.parse({ body: req.body });
      const newUser = await this.authService.registerIntern(validatedInput.body);
    
      res.status(201).json({
        success: true,
        message: 'Successfully verified and registered into the tech park network.',
        user: newUser,
      });
    } catch (error) {
      next(error);
    }
  };
  

}
import { Request, Response, NextFunction } from 'express';
import { LedgerService } from './ledger.service';
import { CreateExpenseSchema, GetPodLedgerSchema } from './ledger.validation';

export class LedgerController {
  private ledgerService = new LedgerService();


  createExpense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
       const validatedInput = CreateExpenseSchema.parse({ body: req.body });
       const newExpense = await this.ledgerService.splitPodExpense(validatedInput.body);
      res.status(201).json({
        success: true,
        message: 'Expense successfully logged and distributed across pod members.',
        expense: newExpense,
      });
    } catch (error) {
      next(error);
    }
  };


  getPodBalances = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedInput = GetPodLedgerSchema.parse({ params: req.params });
      const balances = await this.ledgerService.getPodLedgerSheet(validatedInput.params.id);

      res.status(200).json({
        success: true,
        balances: balances,
      });
    } catch (error) {
      next(error);
    }
  };
}
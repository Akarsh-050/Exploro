import { Router } from 'express';
import { LedgerController } from './ledger.controller';

const ledgerRouter = Router();
const ledgerController = new LedgerController();

// Route Endpoints Configuration
ledgerRouter.post('/expenses', ledgerController.createExpense);
ledgerRouter.get('/pods/:id/balances', ledgerController.getPodBalances);

export default ledgerRouter;
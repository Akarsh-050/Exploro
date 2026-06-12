// 1. Matches the exact snake_case structure stored inside our PostgreSQL expenses table
export interface DBExpenseRow {
  id: string;
  pod_id: string;
  payer_id: string;
  amount: number;
  description: string;
  created_at: Date;
}

// 2. Matches the exact structure stored inside our expense_splits table
export interface DBExpenseSplitRow {
  id: string;
  expense_id: string;
  debtor_id: string;
  amount_owed: number;
  is_settled: boolean;
  created_at: Date;
}

// 3. Clean application layer data model (camelCase) for an Expense record
export interface Expense {
  id: string;
  podId: string;
  payerId: string;
  amount: number;
  description: string;
  createdAt: Date;
}

// 4. Data Transfer Object (DTO) capturing incoming data when submitting a bill
export interface CreateExpenseInputDTO {
  podId: string;
  payerId: string;
  amount: number;
  description: string;
}

// 5. Interface for outputting individual balances on a pod's ledger sheet
export interface MemberBalanceSummary {
  debtorId: string;
  debtorName: string;
  amountOwed: number;
  isSettled: boolean;
}
import pool from '../../config/db';
import { DBExpenseRow, CreateExpenseInputDTO, MemberBalanceSummary } from './ledger.types';

export class LedgerRepository {


  async getPodMembers(podId: string): Promise<string[]> {
    const queryText = `
      SELECT user_id FROM pod_members 
      WHERE pod_id = $1;
    `;
    const result = await pool.query<{ user_id: string }>(queryText, [podId]);
    return result.rows.map(row => row.user_id);
  }


  async createExpenseWithSplits(
    input: CreateExpenseInputDTO,
    memberIds: string[],
    amountPerMember: number
  ): Promise<DBExpenseRow> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const insertExpenseQuery = `
        INSERT INTO expenses (pod_id, payer_id, amount, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const expenseResult = await client.query<DBExpenseRow>(insertExpenseQuery, [
        input.podId,
        input.payerId,
        input.amount,
        input.description
      ]);
      const newExpense = expenseResult.rows[0];

      const insertSplitQuery = `
        INSERT INTO expense_splits (expense_id, debtor_id, amount_owed, is_settled)
        VALUES ($1, $2, $3, $4);
      `;

      for (const memberId of memberIds) {
        const isPayer = memberId === input.payerId;
        const owedAmount = isPayer ? 0 : amountPerMember;
        const settledState = isPayer; 

        await client.query(insertSplitQuery, [
          newExpense.id,
          memberId,
          owedAmount,
          settledState
        ]);
      }
      await client.query('COMMIT'); 
      return newExpense;
    } catch (error) {
      await client.query('ROLLBACK'); 
      throw error;
    } finally {
      client.release();
    }
  }

  async getPodBalancesSummary(podId: string): Promise<MemberBalanceSummary[]> {
    const queryText = `
      SELECT 
        es.debtor_id AS "debtorId",
        u.name AS "debtorName",
        SUM(es.amount_owed) AS "amountOwed",
        BOOL_AND(es.is_settled) AS "isSettled"
      FROM expense_splits es
      JOIN expenses e ON es.expense_id = e.id
      JOIN users u ON es.debtor_id = u.id
      WHERE e.pod_id = $1
      GROUP BY es.debtor_id, u.name
      ORDER BY u.name ASC;
    `;
    const result = await pool.query<MemberBalanceSummary>(queryText, [podId]);
    return result.rows;
  }
}
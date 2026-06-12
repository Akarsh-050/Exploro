import { LedgerRepository } from './ledger.repository';
import { CreateExpenseInputDTO, Expense, MemberBalanceSummary } from './ledger.types';
import { DBExpenseRow } from './ledger.types';

export class LedgerService {
  private ledgerRepository = new LedgerRepository();


  async splitPodExpense(input: CreateExpenseInputDTO): Promise<Expense> {
      const memberIds = await this.ledgerRepository.getPodMembers(input.podId);  
    if (memberIds.length === 0) {
      throw new Error('Data Integrity Error: Cannot split expenses for an empty or missing travel pod.');
    }
    const isPayerInPod = memberIds.includes(input.payerId);
    if (!isPayerInPod) {
      throw new Error('Access Denied: The paying user must be a confirmed member of this travel pod.');
    }
    const memberCount = memberIds.length;
    const rawSplitAmount = input.amount / memberCount;
    
    const amountPerMember = Math.round(rawSplitAmount * 100) / 100;
    const rawExpenseRow = await this.ledgerRepository.createExpenseWithSplits(
      input,
      memberIds,
      amountPerMember
    );

    return this.mapToExpenseModel(rawExpenseRow);
  }

   async getPodLedgerSheet(podId: string): Promise<MemberBalanceSummary[]> {
    const summary = await this.ledgerRepository.getPodBalancesSummary(podId);
    return summary.map(row => ({
      debtorId: row.debtorId,
      debtorName: row.debtorName,
      amountOwed: Number(row.amountOwed),
      isSettled: Boolean(row.isSettled)
    }));
  }


  private mapToExpenseModel(row: DBExpenseRow): Expense {
    return {
      id: row.id,
      podId: row.pod_id,
      payerId: row.payer_id,
      amount: Number(row.amount),
      description: row.description,
      createdAt: row.created_at
    };
  }
}
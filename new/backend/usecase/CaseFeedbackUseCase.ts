import type {
  CreateCaseFeedbackInput,
  SQLiteRepository
} from "../repositories/SQLiteRepository.js";

export class CaseFeedbackUseCase {
  constructor(private readonly sqliteRepository: SQLiteRepository) {}

  async createFeedback(caseId: string, input: CreateCaseFeedbackInput) {
    return this.sqliteRepository.createCaseFeedback(caseId, input);
  }

  async getSavingsSummary() {
    return this.sqliteRepository.getFeedbackSavingsSummary();
  }
}

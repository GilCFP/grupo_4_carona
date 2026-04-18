import type { SQLiteRepository } from "../repositories/SQLiteRepository.js";

export class DashboardUseCase {
  constructor(private readonly sqliteRepository: SQLiteRepository) {}

  async getAnalytics() {
    const [summary, adherence, effectiveness, feedbackSavings] = await Promise.all([
      this.sqliteRepository.getDashboardSummary(),
      this.sqliteRepository.getDashboardAdherence(),
      this.sqliteRepository.getDashboardEffectiveness(),
      this.sqliteRepository.getFeedbackSavingsSummary()
    ]);

    return {
      summary,
      adherence,
      effectiveness,
      feedbackSavings
    };
  }
}

import type {
  SaveCaseEffectivenessInput,
  SQLiteRepository
} from "../repositories/SQLiteRepository.js";

export class CaseEffectivenessUseCase {
  constructor(private readonly sqliteRepository: SQLiteRepository) {}

  async getEffectiveness(caseId: string) {
    return this.sqliteRepository.getCaseEffectiveness(caseId);
  }

  async saveEffectiveness(caseId: string, input: SaveCaseEffectivenessInput) {
    return this.sqliteRepository.saveCaseEffectiveness(caseId, input);
  }
}

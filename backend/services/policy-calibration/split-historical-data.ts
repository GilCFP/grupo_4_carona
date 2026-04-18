import type {
  DatasetSplitSummary,
  HistoricalCaseRow
} from "@grupo4/shared";

import { splitHistoricalRows } from "../../domain/policy-calibration/logic.js";

export function splitHistoricalData(historicalRows: HistoricalCaseRow[]): {
  trainingRows: HistoricalCaseRow[];
  evaluationRows: HistoricalCaseRow[];
  datasetSplit: DatasetSplitSummary;
} {
  return splitHistoricalRows(historicalRows);
}

import type { ComplianceItem, DataSet } from "./types";
import { endOfMonth, daysBetween } from "./utils";

export type RAGStatus = "red" | "amber" | "green";

export interface ComplianceStatus extends ComplianceItem {
  status: RAGStatus;
  daysRemaining: number;
}

export function computeCompliance(
  data: DataSet,
  blockId: string,
  selectedMonth: string
): ComplianceStatus[] {
  const asAt = endOfMonth(selectedMonth);

  return data.compliance
    .filter((c) => c.blockId === blockId)
    .map((c) => {
      const daysRemaining = daysBetween(asAt, c.nextDue);
      let status: RAGStatus;
      if (daysRemaining < 0) status = "red";
      else if (daysRemaining <= 30) status = "amber";
      else status = "green";

      return { ...c, status, daysRemaining };
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining);
}

export function complianceCounts(
  data: DataSet,
  blockId: string,
  selectedMonth: string
): { red: number; amber: number; green: number } {
  const items = computeCompliance(data, blockId, selectedMonth);
  return {
    red: items.filter((i) => i.status === "red").length,
    amber: items.filter((i) => i.status === "amber").length,
    green: items.filter((i) => i.status === "green").length,
  };
}

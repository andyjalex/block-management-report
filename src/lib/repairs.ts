import type { DataSet, Repair } from "./types";
import { getMonthsUpTo } from "./utils";

export function openRepairs(
  data: DataSet,
  blockId: string,
  selectedMonth: string
): Repair[] {
  const asAt = `${selectedMonth}-31`;
  return data.repairs.filter(
    (r) =>
      r.blockId === blockId &&
      r.status === "open" &&
      r.reportedDate <= asAt
  );
}

export function openRepairCount(
  data: DataSet,
  blockId: string,
  selectedMonth: string
): number {
  return openRepairs(data, blockId, selectedMonth).length;
}

export interface MonthlyRepairCounts {
  month: string;
  raised: number;
  completed: number;
}

export function repairsByMonth(
  data: DataSet,
  blockId: string,
  selectedMonth: string
): MonthlyRepairCounts[] {
  const periodStart = data.meta.reportPeriod.start;
  const monthsYTD = getMonthsUpTo(periodStart, selectedMonth);
  const blockRepairs = data.repairs.filter((r) => r.blockId === blockId);

  return monthsYTD.map((month) => ({
    month,
    raised: blockRepairs.filter((r) => r.reportedDate.startsWith(month)).length,
    completed: blockRepairs.filter(
      (r) => r.completedDate && r.completedDate.startsWith(month)
    ).length,
  }));
}

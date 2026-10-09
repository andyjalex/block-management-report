import type { DataSet } from "./types";
import { arrearsOver60Days, collectionRate } from "./arrears";
import { computeBudgetVsActual } from "./budget";
import { computeCompliance } from "./compliance";
import { openRepairCount } from "./repairs";
import { currentReserveBalance } from "./reserve";
import {
  formatCurrency,
  formatPercent,
  categoryLabel,
} from "./utils";

export function generateSummary(
  data: DataSet,
  blockId: string,
  selectedMonth: string
): string[] {
  const bullets: string[] = [];

  const arrears60 = arrearsOver60Days(data, blockId, selectedMonth);
  if (arrears60 > 0) {
    bullets.push(
      `${arrears60} flat${arrears60 > 1 ? "s" : ""} in arrears over 60 days.`
    );
  }

  const collection = collectionRate(data, blockId, selectedMonth);
  if (collection.percent < 95) {
    bullets.push(
      `Service charge collection at ${formatPercent(collection.percent)} — ${formatCurrency(collection.demanded - collection.collected)} outstanding.`
    );
  }

  const budgetItems = computeBudgetVsActual(data, blockId, selectedMonth);
  const overBudget = budgetItems.filter((b) => b.variancePercent > 10);
  for (const item of overBudget) {
    bullets.push(
      `${categoryLabel(item.category)} ${Math.round(item.variancePercent)}% over budget year to date.`
    );
  }

  const comp = computeCompliance(data, blockId, selectedMonth);
  const overdue = comp.filter((c) => c.status === "red");
  for (const item of overdue) {
    bullets.push(
      `${item.item} overdue — was due ${new Date(item.nextDue).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.`
    );
  }

  const amber = comp.filter((c) => c.status === "amber");
  if (amber.length > 0) {
    bullets.push(
      `${amber.length} compliance item${amber.length > 1 ? "s" : ""} due within 30 days.`
    );
  }

  const openJobs = openRepairCount(data, blockId, selectedMonth);
  if (openJobs > 0) {
    bullets.push(`${openJobs} open repair job${openJobs > 1 ? "s" : ""}.`);
  }

  const reserve = currentReserveBalance(data, blockId, selectedMonth);
  bullets.push(`Reserve fund balance: ${formatCurrency(reserve)}.`);

  const majorWorks = data.majorWorks.filter(
    (mw) =>
      mw.blockId === blockId &&
      mw.stages.some((s) => s.status === "in-progress")
  );
  for (const mw of majorWorks) {
    const current = mw.stages.find((s) => s.status === "in-progress");
    if (current) {
      bullets.push(`${mw.title}: ${current.name.toLowerCase()}.`);
    }
  }

  return bullets.slice(0, 5);
}

import type { DataSet, BudgetCategory } from "./types";
import { getMonthsUpTo } from "./utils";

export interface BudgetVsActual {
  category: BudgetCategory;
  budgetYTD: number;
  actualYTD: number;
  variance: number;
  variancePercent: number;
}

export function computeBudgetVsActual(
  data: DataSet,
  blockId: string,
  selectedMonth: string
): BudgetVsActual[] {
  const block = data.blocks.find((b) => b.id === blockId)!;
  const periodStart = data.meta.reportPeriod.start;
  const monthsYTD = getMonthsUpTo(periodStart, selectedMonth);
  const monthCount = monthsYTD.length;

  const expenditures = data.expenditure.filter(
    (e) => e.blockId === blockId && monthsYTD.includes(e.month)
  );

  const categories = Object.keys(block.annualBudget) as BudgetCategory[];

  return categories.map((cat) => {
    const annualBudget = block.annualBudget[cat];
    const budgetYTD = Math.round((annualBudget / 12) * monthCount * 100) / 100;
    const actualYTD = expenditures
      .filter((e) => e.category === cat)
      .reduce((s, e) => s + e.amount, 0);
    const variance = actualYTD - budgetYTD;
    const variancePercent = budgetYTD > 0 ? (variance / budgetYTD) * 100 : 0;

    return { category: cat, budgetYTD, actualYTD, variance, variancePercent };
  });
}

export function totalBudgetYTD(
  data: DataSet,
  blockId: string,
  selectedMonth: string
): { budget: number; actual: number } {
  const items = computeBudgetVsActual(data, blockId, selectedMonth);
  return {
    budget: items.reduce((s, i) => s + i.budgetYTD, 0),
    actual: items.reduce((s, i) => s + i.actualYTD, 0),
  };
}

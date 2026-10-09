import type { DataSet, ReserveFundRecord } from "./types";
import { getMonthsUpTo } from "./utils";

export function getReserveFundSeries(
  data: DataSet,
  blockId: string,
  selectedMonth: string
): ReserveFundRecord[] {
  const periodStart = data.meta.reportPeriod.start;
  const monthsYTD = getMonthsUpTo(periodStart, selectedMonth);
  return data.reserveFund.filter(
    (r) => r.blockId === blockId && monthsYTD.includes(r.month)
  );
}

export function currentReserveBalance(
  data: DataSet,
  blockId: string,
  selectedMonth: string
): number {
  const series = getReserveFundSeries(data, blockId, selectedMonth);
  if (series.length === 0) return 0;
  return series[series.length - 1].closingBalance;
}

import type { DataSet, Flat } from "./types";
import { endOfMonth } from "./utils";

export interface FlatArrears {
  flat: Flat;
  totalOwed: number;
  age0to30: number;
  age31to60: number;
  age61to90: number;
  age90plus: number;
}

export function computeArrears(
  data: DataSet,
  blockId: string,
  selectedMonth: string
): FlatArrears[] {
  const asAt = endOfMonth(selectedMonth);
  const asAtDate = new Date(asAt);

  const blockFlats = data.flats.filter((f) => f.blockId === blockId);
  const blockDemands = data.serviceChargeDemands.filter(
    (d) => d.blockId === blockId
  );
  const blockPayments = data.serviceChargePayments.filter(
    (p) => p.blockId === blockId
  );

  const results: FlatArrears[] = [];

  for (const flat of blockFlats) {
    const demands = blockDemands.filter(
      (d) => d.flatId === flat.id && d.dueDate <= asAt
    );
    const payments = blockPayments.filter(
      (p) => p.flatId === flat.id && p.date <= asAt
    );

    const paidDemandIds = new Set(payments.map((p) => p.demandId));
    const unpaid = demands.filter((d) => !paidDemandIds.has(d.id));

    if (unpaid.length === 0) continue;

    const buckets = { age0to30: 0, age31to60: 0, age61to90: 0, age90plus: 0 };

    for (const d of unpaid) {
      const dueDate = new Date(d.dueDate);
      const daysOld = Math.round(
        (asAtDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysOld > 90) buckets.age90plus += d.amount;
      else if (daysOld > 60) buckets.age61to90 += d.amount;
      else if (daysOld > 30) buckets.age31to60 += d.amount;
      else buckets.age0to30 += d.amount;
    }

    const totalOwed = unpaid.reduce((s, d) => s + d.amount, 0);
    results.push({ flat, totalOwed, ...buckets });
  }

  return results.sort((a, b) => b.totalOwed - a.totalOwed);
}

export function totalArrears(
  data: DataSet,
  blockId: string,
  selectedMonth: string
): number {
  return computeArrears(data, blockId, selectedMonth).reduce(
    (s, a) => s + a.totalOwed,
    0
  );
}

export function arrearsOver60Days(
  data: DataSet,
  blockId: string,
  selectedMonth: string
): number {
  const arr = computeArrears(data, blockId, selectedMonth);
  return arr.filter((a) => a.age61to90 > 0 || a.age90plus > 0).length;
}

export function collectionRate(
  data: DataSet,
  blockId: string,
  selectedMonth: string
): { demanded: number; collected: number; percent: number } {
  const asAt = endOfMonth(selectedMonth);
  const demands = data.serviceChargeDemands.filter(
    (d) => d.blockId === blockId && d.dueDate <= asAt
  );
  const payments = data.serviceChargePayments.filter(
    (p) => p.blockId === blockId && p.date <= asAt
  );

  const demanded = demands.reduce((s, d) => s + d.amount, 0);
  const collected = payments.reduce((s, p) => s + p.amount, 0);

  return {
    demanded,
    collected,
    percent: demanded > 0 ? (collected / demanded) * 100 : 100,
  };
}

export interface Meta {
  managingAgent: string;
  reportPeriod: { start: string; end: string };
  generatedDate: string;
}

export interface BudgetCategories {
  insurance: number;
  gardening: number;
  cleaning: number;
  electricity: number;
  repairsAndMaintenance: number;
  managementFee: number;
  accountancy: number;
  healthAndSafety: number;
  reserveFundContribution: number;
}

export type BudgetCategory = keyof BudgetCategories;

export interface Block {
  id: string;
  name: string;
  address: string;
  totalFlats: number;
  annualBudget: BudgetCategories;
}

export interface Flat {
  id: string;
  blockId: string;
  number: string;
  owner: string;
  sharePercent: number;
}

export interface ServiceChargeDemand {
  id: string;
  blockId: string;
  flatId: string;
  month: string;
  dueDate: string;
  amount: number;
}

export interface ServiceChargePayment {
  id: string;
  demandId: string;
  blockId: string;
  flatId: string;
  date: string;
  amount: number;
}

export interface Expenditure {
  blockId: string;
  month: string;
  category: string;
  amount: number;
}

export interface Repair {
  id: string;
  blockId: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  reportedDate: string;
  completedDate: string | null;
  cost: number | null;
  contractor: string;
}

export interface ReserveFundRecord {
  blockId: string;
  month: string;
  openingBalance: number;
  contribution: number;
  withdrawal: number;
  withdrawalNote: string | null;
  closingBalance: number;
}

export interface ComplianceItem {
  id: string;
  blockId: string;
  item: string;
  frequency: string;
  lastCompleted: string;
  nextDue: string;
}

export interface MajorWorkStage {
  name: string;
  status: "completed" | "in-progress" | "pending";
  date: string | null;
  notes: string | null;
}

export interface MajorWork {
  id: string;
  blockId: string;
  title: string;
  description: string;
  estimatedCost: number;
  stages: MajorWorkStage[];
}

export interface DataSet {
  meta: Meta;
  blocks: Block[];
  flats: Flat[];
  serviceChargeDemands: ServiceChargeDemand[];
  serviceChargePayments: ServiceChargePayment[];
  expenditure: Expenditure[];
  repairs: Repair[];
  reserveFund: ReserveFundRecord[];
  compliance: ComplianceItem[];
  majorWorks: MajorWork[];
}

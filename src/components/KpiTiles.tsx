import type { DataSet } from "../lib/types";
import { collectionRate, totalArrears } from "../lib/arrears";
import { totalBudgetYTD } from "../lib/budget";
import { currentReserveBalance } from "../lib/reserve";
import { openRepairCount } from "../lib/repairs";
import { complianceCounts } from "../lib/compliance";
import { formatCurrency, formatPercent } from "../lib/utils";

interface Props {
  data: DataSet;
  blockId: string;
  selectedMonth: string;
}

export default function KpiTiles({ data, blockId, selectedMonth }: Props) {
  const collection = collectionRate(data, blockId, selectedMonth);
  const arrears = totalArrears(data, blockId, selectedMonth);
  const reserve = currentReserveBalance(data, blockId, selectedMonth);
  const budget = totalBudgetYTD(data, blockId, selectedMonth);
  const openJobs = openRepairCount(data, blockId, selectedMonth);
  const compliance = complianceCounts(data, blockId, selectedMonth);

  const budgetVariance = budget.actual - budget.budget;
  const budgetClass = budgetVariance > 0 ? "kpi-tile--red" : "kpi-tile--green";

  return (
    <section className="section">
      <h2 className="section-title">Key Performance Indicators</h2>
      <div className="kpi-grid">
        <div
          className={`kpi-tile ${collection.percent >= 95 ? "kpi-tile--green" : "kpi-tile--red"}`}
        >
          <div className="kpi-tile__label">Collection Rate</div>
          <div className="kpi-tile__value">
            {formatPercent(collection.percent)}
          </div>
          <div className="kpi-tile__sub">
            {formatCurrency(collection.collected)} of{" "}
            {formatCurrency(collection.demanded)}
          </div>
        </div>

        <div
          className={`kpi-tile ${arrears > 0 ? "kpi-tile--red" : "kpi-tile--green"}`}
        >
          <div className="kpi-tile__label">Total Arrears</div>
          <div className="kpi-tile__value">{formatCurrency(arrears)}</div>
        </div>

        <div className="kpi-tile kpi-tile--accent">
          <div className="kpi-tile__label">Reserve Fund</div>
          <div className="kpi-tile__value">{formatCurrency(reserve)}</div>
        </div>

        <div className={`kpi-tile ${budgetClass}`}>
          <div className="kpi-tile__label">YTD Spend vs Budget</div>
          <div className="kpi-tile__value">{formatCurrency(budget.actual)}</div>
          <div className="kpi-tile__sub">
            Budget: {formatCurrency(budget.budget)} (
            {budgetVariance >= 0 ? "+" : ""}
            {formatCurrency(budgetVariance)})
          </div>
        </div>

        <div className="kpi-tile">
          <div className="kpi-tile__label">Open Repairs</div>
          <div className="kpi-tile__value">{openJobs}</div>
        </div>

        <div className="kpi-tile">
          <div className="kpi-tile__label">Compliance</div>
          <div className="kpi-tile__value" style={{ fontSize: "1rem" }}>
            <span style={{ color: "var(--color-red)", fontWeight: 700 }}>
              {compliance.red} red
            </span>
            {" / "}
            <span style={{ color: "var(--color-amber)", fontWeight: 700 }}>
              {compliance.amber} amber
            </span>
            {" / "}
            <span style={{ color: "var(--color-green)", fontWeight: 700 }}>
              {compliance.green} green
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

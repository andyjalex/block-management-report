import type { DataSet } from "../lib/types";
import { computeCompliance, type RAGStatus } from "../lib/compliance";
import { formatDate } from "../lib/utils";

interface Props {
  data: DataSet;
  blockId: string;
  selectedMonth: string;
}

function statusLabel(status: RAGStatus, days: number): string {
  if (status === "red") return `Overdue (${Math.abs(days)} days)`;
  if (status === "amber") return `Due in ${days} days`;
  return `${days} days remaining`;
}

export default function ComplianceGrid({
  data,
  blockId,
  selectedMonth,
}: Props) {
  const items = computeCompliance(data, blockId, selectedMonth);

  return (
    <section className="section">
      <h2 className="section-title">Compliance</h2>
      <div className="compliance-grid">
        {items.map((c) => (
          <div key={c.id} className="compliance-card">
            <div className={`compliance-dot compliance-dot--${c.status}`} />
            <div>
              <div className="compliance-card__title">{c.item}</div>
              <div className="compliance-card__detail">
                {c.frequency} — next due {formatDate(c.nextDue)}
              </div>
              <div
                className={`compliance-card__status compliance-card__status--${c.status}`}
              >
                {statusLabel(c.status, c.daysRemaining)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

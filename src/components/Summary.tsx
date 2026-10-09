import type { DataSet } from "../lib/types";
import { generateSummary } from "../lib/summary";

interface Props {
  data: DataSet;
  blockId: string;
  selectedMonth: string;
}

export default function Summary({ data, blockId, selectedMonth }: Props) {
  const bullets = generateSummary(data, blockId, selectedMonth);

  return (
    <section className="section">
      <h2 className="section-title">Executive Summary</h2>
      <ul className="summary-list">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </section>
  );
}

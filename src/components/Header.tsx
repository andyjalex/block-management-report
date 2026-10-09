import type { Block } from "../lib/types";

interface Props {
  blocks: Block[];
  blockId: string;
  onBlockChange: (id: string) => void;
  months: string[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  formatMonth: (month: string) => string;
}

export default function Header({
  blocks,
  blockId,
  onBlockChange,
  months,
  selectedMonth,
  onMonthChange,
  formatMonth,
}: Props) {
  return (
    <div className="app-header">
      <div>
        <label htmlFor="block-select">Block</label>
        <select
          id="block-select"
          value={blockId}
          onChange={(e) => onBlockChange(e.target.value)}
        >
          {blocks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="month-select">Month</label>
        <select
          id="month-select"
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {formatMonth(m)}
            </option>
          ))}
        </select>
      </div>

      <button className="print-btn" onClick={() => window.print()}>
        Print / Save as PDF
      </button>
    </div>
  );
}

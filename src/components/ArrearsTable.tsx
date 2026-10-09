import type { DataSet } from "../lib/types";
import { computeArrears } from "../lib/arrears";
import { formatCurrencyExact, formatMonth } from "../lib/utils";

interface Props {
  data: DataSet;
  blockId: string;
  selectedMonth: string;
}

export default function ArrearsTable({ data, blockId, selectedMonth }: Props) {
  const arrears = computeArrears(data, blockId, selectedMonth);

  if (arrears.length === 0) {
    return (
      <section className="section">
        <h2 className="section-title">Service Charge Arrears</h2>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
          No arrears as at end of {formatMonth(selectedMonth)}.
        </p>
      </section>
    );
  }

  const totals = arrears.reduce(
    (acc, a) => ({
      totalOwed: acc.totalOwed + a.totalOwed,
      age0to30: acc.age0to30 + a.age0to30,
      age31to60: acc.age31to60 + a.age31to60,
      age61to90: acc.age61to90 + a.age61to90,
      age90plus: acc.age90plus + a.age90plus,
    }),
    { totalOwed: 0, age0to30: 0, age31to60: 0, age61to90: 0, age90plus: 0 }
  );

  return (
    <section className="section">
      <h2 className="section-title">
        Service Charge Arrears — as at end of {formatMonth(selectedMonth)}
      </h2>
      <div className="card" style={{ padding: 0, overflow: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Flat</th>
              <th>Owner</th>
              <th className="text-right">0–30 days</th>
              <th className="text-right">31–60 days</th>
              <th className="text-right">61–90 days</th>
              <th className="text-right">90+ days</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {arrears.map((a) => (
              <tr key={a.flat.id}>
                <td>{a.flat.number}</td>
                <td>{a.flat.owner}</td>
                <td className="text-right">
                  {a.age0to30 > 0 ? formatCurrencyExact(a.age0to30) : "—"}
                </td>
                <td className="text-right">
                  {a.age31to60 > 0 ? formatCurrencyExact(a.age31to60) : "—"}
                </td>
                <td className="text-right">
                  {a.age61to90 > 0 ? formatCurrencyExact(a.age61to90) : "—"}
                </td>
                <td className="text-right">
                  {a.age90plus > 0 ? formatCurrencyExact(a.age90plus) : "—"}
                </td>
                <td className="text-right" style={{ fontWeight: 700 }}>
                  {formatCurrencyExact(a.totalOwed)}
                </td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan={2}>Total</td>
              <td className="text-right">
                {formatCurrencyExact(totals.age0to30)}
              </td>
              <td className="text-right">
                {formatCurrencyExact(totals.age31to60)}
              </td>
              <td className="text-right">
                {formatCurrencyExact(totals.age61to90)}
              </td>
              <td className="text-right">
                {formatCurrencyExact(totals.age90plus)}
              </td>
              <td className="text-right">
                {formatCurrencyExact(totals.totalOwed)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

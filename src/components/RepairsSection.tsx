import { useMemo } from "react";
import * as d3 from "d3";
import type { DataSet } from "../lib/types";
import { openRepairs, repairsByMonth } from "../lib/repairs";
import { formatDate, formatMonthShort } from "../lib/utils";

interface Props {
  data: DataSet;
  blockId: string;
  selectedMonth: string;
}

const MARGIN = { top: 24, right: 24, bottom: 40, left: 40 };
const WIDTH = 900;
const HEIGHT = 240;

export default function RepairsSection({
  data,
  blockId,
  selectedMonth,
}: Props) {
  const monthlyCounts = useMemo(
    () => repairsByMonth(data, blockId, selectedMonth),
    [data, blockId, selectedMonth]
  );
  const openJobs = useMemo(
    () => openRepairs(data, blockId, selectedMonth),
    [data, blockId, selectedMonth]
  );

  const innerW = WIDTH - MARGIN.left - MARGIN.right;
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;

  const x = d3
    .scaleBand<string>()
    .domain(monthlyCounts.map((d) => d.month))
    .range([0, innerW])
    .padding(0.3);

  const maxCount =
    d3.max(monthlyCounts, (d) => Math.max(d.raised, d.completed)) ?? 1;
  const y = d3
    .scaleLinear()
    .domain([0, maxCount + 1])
    .range([innerH, 0]);

  const barW = Math.min(x.bandwidth() / 2 - 2, 20);

  return (
    <section className="section">
      <h2 className="section-title">Repairs</h2>

      <div className="chart-container" style={{ marginBottom: 20 }}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Repairs raised and completed per month">
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {/* Grid */}
            {y.ticks(maxCount + 1).map((t) => (
              <line
                key={t}
                x1={0}
                x2={innerW}
                y1={y(t)}
                y2={y(t)}
                stroke="#e2e4e9"
                strokeDasharray="2,3"
              />
            ))}

            {monthlyCounts.map((d) => {
              const cx = x(d.month)! + x.bandwidth() / 2;
              return (
                <g key={d.month}>
                  <rect
                    x={cx - barW - 1}
                    y={y(d.raised)}
                    width={barW}
                    height={innerH - y(d.raised)}
                    rx={2}
                    fill="#f59e0b"
                    opacity={0.85}
                  />
                  <rect
                    x={cx + 1}
                    y={y(d.completed)}
                    width={barW}
                    height={innerH - y(d.completed)}
                    rx={2}
                    fill="#22c55e"
                    opacity={0.85}
                  />
                </g>
              );
            })}

            {/* X axis labels */}
            {monthlyCounts.map((d) => (
              <text
                key={d.month}
                x={x(d.month)! + x.bandwidth() / 2}
                y={innerH + 18}
                textAnchor="middle"
                fontSize={10}
                fill="#5a5a7a"
              >
                {formatMonthShort(d.month)}
              </text>
            ))}

            {/* Y axis labels */}
            {y.ticks(maxCount + 1).map((t) => (
              <text
                key={t}
                x={-8}
                y={y(t)}
                textAnchor="end"
                dominantBaseline="central"
                fontSize={10}
                fill="#5a5a7a"
              >
                {t}
              </text>
            ))}

            {/* Legend */}
            <g transform={`translate(${innerW - 200}, -12)`}>
              <rect width={10} height={10} fill="#f59e0b" rx={2} />
              <text x={14} y={9} fontSize={10} fill="#5a5a7a">
                Raised
              </text>
              <rect x={60} width={10} height={10} fill="#22c55e" rx={2} />
              <text x={74} y={9} fontSize={10} fill="#5a5a7a">
                Completed
              </text>
            </g>
          </g>
        </svg>
      </div>

      {openJobs.length > 0 && (
        <>
          <h3
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              marginBottom: 10,
              color: "var(--color-text-secondary)",
            }}
          >
            Open Jobs
          </h3>
          <div className="card" style={{ padding: 0, overflow: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Reported</th>
                  <th>Contractor</th>
                </tr>
              </thead>
              <tbody>
                {openJobs.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <strong>{r.title}</strong>
                      <br />
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {r.description}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          textTransform: "capitalize",
                          fontWeight: r.priority === "high" ? 600 : 400,
                          color:
                            r.priority === "high"
                              ? "var(--color-red)"
                              : r.priority === "emergency"
                                ? "var(--color-red)"
                                : "inherit",
                        }}
                      >
                        {r.priority}
                      </span>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {formatDate(r.reportedDate)}
                    </td>
                    <td>{r.contractor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

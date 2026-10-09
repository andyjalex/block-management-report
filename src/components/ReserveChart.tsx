import { useMemo } from "react";
import * as d3 from "d3";
import type { DataSet } from "../lib/types";
import { getReserveFundSeries } from "../lib/reserve";
import { formatCurrency, formatMonthShort } from "../lib/utils";

interface Props {
  data: DataSet;
  blockId: string;
  selectedMonth: string;
}

const MARGIN = { top: 24, right: 24, bottom: 40, left: 70 };
const WIDTH = 900;
const HEIGHT = 300;

export default function ReserveChart({ data, blockId, selectedMonth }: Props) {
  const series = useMemo(
    () => getReserveFundSeries(data, blockId, selectedMonth),
    [data, blockId, selectedMonth]
  );

  const innerW = WIDTH - MARGIN.left - MARGIN.right;
  const innerH = HEIGHT - MARGIN.top - MARGIN.bottom;

  const x = d3
    .scalePoint<string>()
    .domain(series.map((d) => d.month))
    .range([0, innerW])
    .padding(0.5);

  const yMin = d3.min(series, (d) => d.closingBalance) ?? 0;
  const yMax = d3.max(series, (d) => d.closingBalance) ?? 1;
  const y = d3
    .scaleLinear()
    .domain([Math.floor(yMin * 0.9), Math.ceil(yMax * 1.05)])
    .range([innerH, 0])
    .nice();

  const line = d3
    .line<(typeof series)[0]>()
    .x((d) => x(d.month)!)
    .y((d) => y(d.closingBalance));

  const area = d3
    .area<(typeof series)[0]>()
    .x((d) => x(d.month)!)
    .y0(innerH)
    .y1((d) => y(d.closingBalance));

  const withdrawals = series.filter((d) => d.withdrawal > 0);

  const yTicks = y.ticks(5);
  const xTicks = series.map((d) => d.month);

  return (
    <section className="section">
      <h2 className="section-title">Reserve Fund</h2>
      <div className="chart-container">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Reserve fund line chart">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {/* Grid lines */}
            {yTicks.map((t) => (
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

            {/* Area */}
            <path d={area(series)!} fill="url(#areaGrad)" />

            {/* Line */}
            <path
              d={line(series)!}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={2.5}
              strokeLinejoin="round"
            />

            {/* Data points */}
            {series.map((d) => (
              <circle
                key={d.month}
                cx={x(d.month)!}
                cy={y(d.closingBalance)}
                r={3.5}
                fill="#fff"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            ))}

            {/* Withdrawal annotations */}
            {withdrawals.map((d) => (
              <g key={`w-${d.month}`}>
                <line
                  x1={x(d.month)!}
                  x2={x(d.month)!}
                  y1={y(d.closingBalance) + 6}
                  y2={y(d.closingBalance) + 30}
                  stroke="#dc2626"
                  strokeWidth={1}
                  strokeDasharray="3,2"
                />
                <text
                  x={x(d.month)!}
                  y={y(d.closingBalance) + 42}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#dc2626"
                  fontWeight={600}
                >
                  -{formatCurrency(d.withdrawal)}
                </text>
                {d.withdrawalNote && (
                  <text
                    x={x(d.month)!}
                    y={y(d.closingBalance) + 54}
                    textAnchor="middle"
                    fontSize={8}
                    fill="#5a5a7a"
                  >
                    {d.withdrawalNote.length > 35
                      ? d.withdrawalNote.slice(0, 35) + "…"
                      : d.withdrawalNote}
                  </text>
                )}
              </g>
            ))}

            {/* Y axis */}
            {yTicks.map((t) => (
              <text
                key={t}
                x={-10}
                y={y(t)}
                textAnchor="end"
                dominantBaseline="central"
                fontSize={10}
                fill="#5a5a7a"
              >
                {formatCurrency(t)}
              </text>
            ))}

            {/* X axis */}
            {xTicks.map((m) => (
              <text
                key={m}
                x={x(m)!}
                y={innerH + 20}
                textAnchor="middle"
                fontSize={10}
                fill="#5a5a7a"
              >
                {formatMonthShort(m)}
              </text>
            ))}
          </g>
        </svg>
      </div>
    </section>
  );
}

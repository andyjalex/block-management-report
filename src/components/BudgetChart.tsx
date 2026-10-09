import { useMemo } from "react";
import * as d3 from "d3";
import type { DataSet } from "../lib/types";
import { computeBudgetVsActual } from "../lib/budget";
import { categoryLabel, formatCurrency } from "../lib/utils";

interface Props {
  data: DataSet;
  blockId: string;
  selectedMonth: string;
}

const MARGIN = { top: 20, right: 120, bottom: 20, left: 180 };
const BAR_HEIGHT = 28;
const BAR_GAP = 8;

export default function BudgetChart({ data, blockId, selectedMonth }: Props) {
  const items = useMemo(
    () => computeBudgetVsActual(data, blockId, selectedMonth),
    [data, blockId, selectedMonth]
  );

  const height =
    MARGIN.top + items.length * (BAR_HEIGHT + BAR_GAP) + MARGIN.bottom;
  const width = 900;
  const innerW = width - MARGIN.left - MARGIN.right;

  const maxVal = d3.max(items, (d) => Math.max(d.budgetYTD, d.actualYTD)) ?? 1;

  const x = d3.scaleLinear().domain([0, maxVal * 1.1]).range([0, innerW]);

  const y = d3
    .scaleBand<string>()
    .domain(items.map((d) => d.category))
    .range([0, items.length * (BAR_HEIGHT + BAR_GAP)])
    .padding(0.15);

  return (
    <section className="section">
      <h2 className="section-title">Budget vs Actual — Year to Date</h2>
      <div className="chart-container">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Budget vs actual bar chart">
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {items.map((d) => {
              const barY = y(d.category)!;
              const overBudget = d.actualYTD > d.budgetYTD;

              return (
                <g key={d.category}>
                  {/* Actual bar */}
                  <rect
                    x={0}
                    y={barY}
                    width={x(d.actualYTD)}
                    height={y.bandwidth()}
                    rx={3}
                    fill={overBudget ? "#ef4444" : "#3b82f6"}
                    opacity={0.85}
                  />
                  {/* Budget marker */}
                  <line
                    x1={x(d.budgetYTD)}
                    x2={x(d.budgetYTD)}
                    y1={barY - 3}
                    y2={barY + y.bandwidth() + 3}
                    stroke="#1a1a2e"
                    strokeWidth={2}
                    strokeDasharray="4,2"
                  />
                  {/* Category label */}
                  <text
                    x={-8}
                    y={barY + y.bandwidth() / 2}
                    textAnchor="end"
                    dominantBaseline="central"
                    fontSize={12}
                    fill="#1a1a2e"
                  >
                    {categoryLabel(d.category)}
                  </text>
                  {/* Value label */}
                  <text
                    x={x(d.actualYTD) + 6}
                    y={barY + y.bandwidth() / 2}
                    dominantBaseline="central"
                    fontSize={11}
                    fill={overBudget ? "#dc2626" : "#5a5a7a"}
                    fontWeight={overBudget ? 600 : 400}
                  >
                    {formatCurrency(d.actualYTD)}
                    {overBudget
                      ? ` (+${Math.round(d.variancePercent)}%)`
                      : ""}
                  </text>
                </g>
              );
            })}

            {/* Legend */}
            <g transform={`translate(0, -10)`}>
              <rect width={10} height={10} fill="#3b82f6" rx={2} />
              <text x={14} y={9} fontSize={10} fill="#5a5a7a">
                At/under budget
              </text>
              <rect x={110} width={10} height={10} fill="#ef4444" rx={2} />
              <text x={124} y={9} fontSize={10} fill="#5a5a7a">
                Over budget
              </text>
              <line
                x1={200}
                x2={214}
                y1={5}
                y2={5}
                stroke="#1a1a2e"
                strokeWidth={2}
                strokeDasharray="4,2"
              />
              <text x={218} y={9} fontSize={10} fill="#5a5a7a">
                Budget YTD
              </text>
            </g>
          </g>
        </svg>
      </div>
    </section>
  );
}

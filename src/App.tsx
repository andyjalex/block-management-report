import { useState, useMemo } from "react";
import rawData from "../block_management_data.json";
import type { DataSet } from "./lib/types";
import { getMonthsInRange, formatMonth } from "./lib/utils";
import Header from "./components/Header";
import Summary from "./components/Summary";
import KpiTiles from "./components/KpiTiles";
import ArrearsTable from "./components/ArrearsTable";
import BudgetChart from "./components/BudgetChart";
import ReserveChart from "./components/ReserveChart";
import ComplianceGrid from "./components/ComplianceGrid";
import RepairsSection from "./components/RepairsSection";
import MajorWorks from "./components/MajorWorks";

const data = rawData as unknown as DataSet;

export default function App() {
  const [blockId, setBlockId] = useState(data.blocks[0].id);
  const [selectedMonth, setSelectedMonth] = useState("2026-09");

  const months = useMemo(
    () =>
      getMonthsInRange(
        data.meta.reportPeriod.start.slice(0, 7),
        data.meta.reportPeriod.end.slice(0, 7)
      ),
    []
  );

  const block = data.blocks.find((b) => b.id === blockId)!;

  return (
    <div className="report">
      <Header
        blocks={data.blocks}
        blockId={blockId}
        onBlockChange={setBlockId}
        months={months}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        formatMonth={formatMonth}
      />

      <div className="report-header">
        <h1>{block.name}</h1>
        <p className="report-subtitle">
          Monthly Management Report — {formatMonth(selectedMonth)}
        </p>
        <p className="report-address">{block.address}</p>
        <p className="report-agent">{data.meta.managingAgent}</p>
      </div>

      <Summary data={data} blockId={blockId} selectedMonth={selectedMonth} />
      <KpiTiles data={data} blockId={blockId} selectedMonth={selectedMonth} />
      <ArrearsTable
        data={data}
        blockId={blockId}
        selectedMonth={selectedMonth}
      />
      <BudgetChart
        data={data}
        blockId={blockId}
        selectedMonth={selectedMonth}
      />
      <ReserveChart
        data={data}
        blockId={blockId}
        selectedMonth={selectedMonth}
      />
      <ComplianceGrid
        data={data}
        blockId={blockId}
        selectedMonth={selectedMonth}
      />
      <RepairsSection
        data={data}
        blockId={blockId}
        selectedMonth={selectedMonth}
      />
      <MajorWorks data={data} blockId={blockId} />
    </div>
  );
}

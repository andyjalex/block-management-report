import type { DataSet } from "../lib/types";
import { formatCurrency, formatDate } from "../lib/utils";

interface Props {
  data: DataSet;
  blockId: string;
}

export default function MajorWorks({ data, blockId }: Props) {
  const works = data.majorWorks.filter((mw) => mw.blockId === blockId);

  if (works.length === 0) {
    return (
      <section className="section">
        <h2 className="section-title">Major Works (Section 20)</h2>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
          No major works in progress.
        </p>
      </section>
    );
  }

  return (
    <section className="section">
      <h2 className="section-title">Major Works (Section 20)</h2>
      {works.map((mw) => (
        <div key={mw.id} className="major-work">
          <div className="major-work__title">{mw.title}</div>
          <div className="major-work__meta">
            {mw.description}
            <br />
            Estimated cost: {formatCurrency(mw.estimatedCost)}
          </div>
          <div className="stepper">
            {mw.stages.map((stage, i) => (
              <div
                key={i}
                className={`stepper__step stepper__step--${stage.status}`}
              >
                <div className="stepper__dot" />
                <div className="stepper__step-name">{stage.name}</div>
                {(stage.date || stage.notes) && (
                  <div className="stepper__step-detail">
                    {stage.date && formatDate(stage.date)}
                    {stage.date && stage.notes && " — "}
                    {stage.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

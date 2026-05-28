import { SummaryResponse } from "@/app/types/employee";

type Props = {
  summaryProject: string;
  projectOptions: string[];
  summary: SummaryResponse | null;
  onSummaryProjectChange: (value: string) => void;
  onSubmit: (
    event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => void;
};

export function ProjectSummarySection({
  summaryProject,
  projectOptions,
  summary,
  onSummaryProjectChange,
  onSubmit,
}: Props) {
  return (
    <section className="space-y-3 rounded border p-4">
      <h2 className="text-lg font-medium">Project Summary</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 md:flex-row">
        <select
          className="rounded border p-2"
          value={summaryProject}
          onChange={(e) => onSummaryProjectChange(e.target.value)}
        >
          <option value="">Select project</option>
          {projectOptions.map((project) => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </select>
        <button className="rounded bg-black px-4 py-2 text-white" type="submit">
          Calculate
        </button>
      </form>

      {summary ? (
        <div className="rounded border bg-gray-50 p-3">
          <p>
            <strong>Project:</strong> {summary.project}
          </p>
          <p>
            <strong>Employee count:</strong> {summary.employeeCount}
          </p>
          <p>
            <strong>Total cost:</strong> {summary.totalCost}
          </p>
        </div>
      ) : null}
    </section>
  );
}

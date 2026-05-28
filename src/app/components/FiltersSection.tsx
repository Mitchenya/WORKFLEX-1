import { statusOptions } from "@/app/types/employee";

type Props = {
  projectFilter: string;
  statusFilter: string;
  projectOptions: string[];
  onProjectFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onRefresh: () => void;
};

export function FiltersSection({
  projectFilter,
  statusFilter,
  projectOptions,
  onProjectFilterChange,
  onStatusFilterChange,
  onRefresh,
}: Props) {
  return (
    <section className="space-y-3 rounded border p-4">
      <h2 className="text-lg font-medium">Filters</h2>
      <div className="flex flex-col gap-3 md:flex-row">
        <select
          className="rounded border p-2"
          value={projectFilter}
          onChange={(e) => onProjectFilterChange(e.target.value)}
        >
          <option value="">All projects</option>
          {projectOptions.map((project) => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </select>

        <select
          className="rounded border p-2"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          <option value="">All statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <button type="button" className="rounded border px-4 py-2" onClick={onRefresh}>
          Refresh
        </button>
      </div>
    </section>
  );
}

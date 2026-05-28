import { EmployeeForm, statusOptions } from "@/app/types/employee";

type Props = {
  editSectionRef: React.RefObject<HTMLElement | null>;
  editingId: number | null;
  form: EmployeeForm;
  onInputChange: <K extends keyof EmployeeForm>(key: K, value: EmployeeForm[K]) => void;
  onCancelEdit: () => void;
  onSubmit: (
    event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => void;
};

export function EmployeeFormSection({
  editSectionRef,
  editingId,
  form,
  onInputChange,
  onCancelEdit,
  onSubmit,
}: Props) {
  return (
    <section ref={editSectionRef} className="space-y-3 rounded border p-4">
      <h2 className="text-lg font-medium">
        {editingId ? "Edit Employee" : "Add Employee"}
      </h2>

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <input
          className="rounded border p-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => onInputChange("name", e.target.value)}
        />
        <input
          className="rounded border p-2"
          placeholder="Surname"
          value={form.surname}
          onChange={(e) => onInputChange("surname", e.target.value)}
        />
        <input
          className="rounded border p-2"
          placeholder="Position"
          value={form.position}
          onChange={(e) => onInputChange("position", e.target.value)}
        />
        <input
          className="rounded border p-2"
          placeholder="Project"
          value={form.project}
          onChange={(e) => onInputChange("project", e.target.value)}
        />
        <input
          className="rounded border p-2"
          placeholder="Hourly Rate"
          type="number"
          step="0.01"
          value={form.hourlyRate}
          onChange={(e) => onInputChange("hourlyRate", e.target.value)}
        />
        <input
          className="rounded border p-2"
          placeholder="Hours Worked"
          type="number"
          step="0.01"
          value={form.hoursWorked}
          onChange={(e) => onInputChange("hoursWorked", e.target.value)}
        />

        <select
          className="rounded border p-2"
          value={form.status}
          onChange={(e) => onInputChange("status", e.target.value as EmployeeForm["status"])}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <div className="flex gap-2 md:col-span-2">
          <button className="rounded bg-black px-4 py-2 text-white" type="submit">
            {editingId ? "Update Employee" : "Create Employee"}
          </button>
          {editingId ? (
            <button type="button" className="rounded border px-4 py-2" onClick={onCancelEdit}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

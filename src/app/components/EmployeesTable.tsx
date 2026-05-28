import { Employee } from "@/app/types/employee";

type Props = {
  employees: Employee[];
  isLoading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
};

export function EmployeesTable({ employees, isLoading, onEdit, onDelete }: Props) {
  return (
    <section className="rounded border p-4">
      <h2 className="mb-3 text-lg font-medium">Employees</h2>

      {isLoading ? <p>Loading...</p> : null}

      <div className="overflow-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Surname</th>
              <th className="border p-2">Position</th>
              <th className="border p-2">Project</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">Hours</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="border p-2">{employee.id}</td>
                <td className="border p-2">{employee.name}</td>
                <td className="border p-2">{employee.surname}</td>
                <td className="border p-2">{employee.position}</td>
                <td className="border p-2">{employee.project}</td>
                <td className="border p-2">{employee.hourlyRate}</td>
                <td className="border p-2">{employee.hoursWorked}</td>
                <td className="border p-2">{employee.status}</td>
                <td className="border p-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded border px-2 py-1"
                      onClick={() => onEdit(employee)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded border border-red-300 px-2 py-1 text-red-700"
                      onClick={() => onDelete(employee.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!isLoading && employees.length === 0 ? (
              <tr>
                <td className="border p-2 text-center" colSpan={9}>
                  No employees found
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

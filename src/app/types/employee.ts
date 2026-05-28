export type EmployeeStatus = "active" | "inactive" | "on_leave";

export type Employee = {
  id: number;
  name: string;
  surname: string;
  position: string;
  project: string;
  hourlyRate: number;
  hoursWorked: number;
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeForm = {
  name: string;
  surname: string;
  position: string;
  project: string;
  hourlyRate: string;
  hoursWorked: string;
  status: EmployeeStatus;
};

export type SummaryResponse = {
  project: string;
  totalCost: number;
  employeeCount: number;
};

export type EmployeePayload = {
  name: string;
  surname: string;
  position: string;
  project: string;
  hourlyRate: number;
  hoursWorked: number;
  status: EmployeeStatus;
};

export const emptyForm: EmployeeForm = {
  name: "",
  surname: "",
  position: "",
  project: "",
  hourlyRate: "",
  hoursWorked: "",
  status: "active",
};

export const statusOptions: EmployeeStatus[] = ["active", "inactive", "on_leave"];

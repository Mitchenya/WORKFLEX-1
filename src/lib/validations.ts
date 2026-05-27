import { z } from "zod";

export const employeeStatuses = ["active", "inactive", "on_leave"] as const;

export const employeeSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  surname: z.string().trim().min(1, "Surname is required"),
  position: z.string().trim().min(1, "Position is required"),
  project: z.string().trim().min(1, "Project is required"),
  hourlyRate: z.coerce.number().positive("Hourly rate must be greater than 0"),
  hoursWorked: z.coerce.number().min(0, "Hours worked cannot be negative"),
  status: z.enum(employeeStatuses),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
export type EmployeeStatus = (typeof employeeStatuses)[number];

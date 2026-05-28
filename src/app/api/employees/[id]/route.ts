import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type EmployeeRouteContext = {
  params: Promise<{ id: string }>;
};

function parseEmployeeId(id: string) {
  const employeeId = Number(id);
  if (!Number.isInteger(employeeId) || employeeId <= 0) {
    return null;
  }
  return employeeId;
}

export async function GET(_request: NextRequest, context: EmployeeRouteContext) {
  const { id } = await context.params;
  const employeeId = parseEmployeeId(id);

  if (!employeeId) {
    return NextResponse.json({ error: "Invalid employee ID" }, { status: 400 });
  }

  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json(employee);
}           
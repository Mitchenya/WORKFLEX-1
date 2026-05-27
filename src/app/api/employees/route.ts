import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { employeeStatuses, type EmployeeStatus } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const project = searchParams.get("project")?.trim() || undefined;
  const statusParam = searchParams.get("status")?.trim() || undefined;

  let status: EmployeeStatus | undefined;
  if (statusParam) {
    if (!employeeStatuses.includes(statusParam as EmployeeStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    status = statusParam as EmployeeStatus;
  }

  const where: Prisma.EmployeeWhereInput = {};
  if (project) where.project = project;
  if (status) where.status = status;

  const employees = await prisma.employee.findMany({
    where,
    orderBy: [{ surname: "asc" }, { name: "asc" }],
  });

  return NextResponse.json(employees);
}
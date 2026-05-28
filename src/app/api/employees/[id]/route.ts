import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { employeeSchema } from "@/lib/validations";

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

  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
  });
  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  return NextResponse.json(employee);
}

export async function PUT(request: NextRequest, context: EmployeeRouteContext) {
  const { id } = await context.params;
  const employeeId = parseEmployeeId(id);

  if (!employeeId) {
    return NextResponse.json({ error: "Invalid employee ID" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = employeeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: parsed.data,
    });
    return NextResponse.json(updatedEmployee);
  } catch {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }
}

export async function DELETE(_request: NextRequest, context: EmployeeRouteContext) {
  const { id } = await context.params;
  const employeeId = parseEmployeeId(id);

  if (!employeeId) {
    return NextResponse.json({ error: "Invalid employee ID" }, { status: 400 });
  }

  try {
    await prisma.employee.delete({ where: { id: employeeId } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }
}
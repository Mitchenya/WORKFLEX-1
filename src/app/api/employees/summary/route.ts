import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const project = searchParams.get("project")?.trim() || undefined;

  if (!project) {
    return NextResponse.json(
      { error: "Missing required query parameter: project" },
      { status: 400 },
    );
  }

  const employees = await prisma.employee.findMany({
    where: { project },
    select: {
      hourlyRate: true,
      hoursWorked: true,
    },
  });

  const totalCost = employees.reduce(
    (sum, employee) => sum + employee.hourlyRate * employee.hoursWorked,
    0,
  );

  return NextResponse.json({
    project,
    totalCost,
    employeeCount: employees.length,
  });
}
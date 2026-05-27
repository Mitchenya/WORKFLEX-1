import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

function parseEmployeeId(id: string) {
    const employeeId = Number(id);
    if (!Number.isInteger(employeeId) || employeeId <= 0) {
        return null;
    }
    return employeeId;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
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
import { makeRequest } from "@/test/request-helpers";
import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMocks = vi.hoisted(() => ({
  findMany: vi.fn(),
  create: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    employee: prismaMocks,
  },
}));

import { GET, POST } from "@/app/api/employees/route";

describe("employees route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for invalid status filter", async () => {
    const response = await GET(makeRequest("http://localhost:3000/api/employees?status=bad") as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Invalid status" });
    expect(prismaMocks.findMany).not.toHaveBeenCalled();
  });

  it("returns filtered employees list", async () => {
    prismaMocks.findMany.mockResolvedValueOnce([{ id: 1, name: "Anna" }]);

    const response = await GET(
      makeRequest("http://localhost:3000/api/employees?project=Acme&status=active") as never,
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual([{ id: 1, name: "Anna" }]);
    expect(prismaMocks.findMany).toHaveBeenCalledWith({
      where: { project: "Acme", status: "active" },
      orderBy: [{ surname: "asc" }, { name: "asc" }],
    });
  });

  it("returns 400 for invalid JSON payload", async () => {
    const response = await POST(
      makeRequest("http://localhost:3000/api/employees", {
        method: "POST",
        body: "{bad",
      }) as never,
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Invalid JSON body" });
  });

  it("returns 201 for valid payload", async () => {
    const created = {
      id: 10,
      name: "Anna",
      surname: "Kowalska",
      position: "Developer",
      project: "Acme",
      hourlyRate: 90,
      hoursWorked: 100,
      status: "active",
    };
    prismaMocks.create.mockResolvedValueOnce(created);

    const response = await POST(
      makeRequest("http://localhost:3000/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(created),
      }) as never,
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual(created);
    expect(prismaMocks.create).toHaveBeenCalledWith({
      data: {
        name: "Anna",
        surname: "Kowalska",
        position: "Developer",
        project: "Acme",
        hourlyRate: 90,
        hoursWorked: 100,
        status: "active",
      },
    });
  });
});

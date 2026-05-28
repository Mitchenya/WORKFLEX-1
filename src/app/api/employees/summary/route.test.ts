import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMocks = vi.hoisted(() => ({
  findMany: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    employee: prismaMocks,
  },
}));

import { GET } from "./route";

function makeRequest(url: string, init?: RequestInit) {
  return new Request(url, init);
}

describe("employees summary route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when project query is missing", async () => {
    const response = await GET(makeRequest("http://localhost:3000/api/employees/summary") as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Missing required query parameter: project" });
    expect(prismaMocks.findMany).not.toHaveBeenCalled();
  });

  it("returns project summary totals", async () => {
    prismaMocks.findMany.mockResolvedValueOnce([
      { hourlyRate: 100, hoursWorked: 2 },
      { hourlyRate: 80, hoursWorked: 3 },
    ]);

    const response = await GET(
      makeRequest("http://localhost:3000/api/employees/summary?project=Acme") as never,
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      project: "Acme",
      totalCost: 440,
      employeeCount: 2,
    });
    expect(prismaMocks.findMany).toHaveBeenCalledWith({
      where: { project: "Acme" },
      select: {
        hourlyRate: true,
        hoursWorked: true,
      },
    });
  });
});

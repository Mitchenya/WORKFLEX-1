import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    employee: prismaMocks,
  },
}));

import { DELETE, GET, PUT } from "./route";

function makeContext(id: string) {
  return { params: Promise.resolve({ id }) };
}

function makeRequest(url: string, init?: RequestInit) {
  return new Request(url, init);
}

describe("employee by id route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 for invalid id on GET", async () => {
    const response = await GET(makeRequest("http://localhost:3000/api/employees/x") as never, makeContext("x"));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Invalid employee ID" });
  });

  it("returns 404 when GET employee does not exist", async () => {
    prismaMocks.findUnique.mockResolvedValueOnce(null);

    const response = await GET(makeRequest("http://localhost:3000/api/employees/1") as never, makeContext("1"));
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: "Employee not found" });
  });

  it("returns 200 when employee exists", async () => {
    const employee = { id: 2, name: "Ewa" };
    prismaMocks.findUnique.mockResolvedValueOnce(employee);

    const response = await GET(makeRequest("http://localhost:3000/api/employees/2") as never, makeContext("2"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(employee);
  });

  it("returns 400 for invalid PUT body", async () => {
    const response = await PUT(
      makeRequest("http://localhost:3000/api/employees/1", { method: "PUT", body: "{bad" }) as never,
      makeContext("1"),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Invalid JSON body" });
  });

  it("returns 404 when PUT target is missing", async () => {
    prismaMocks.update.mockRejectedValueOnce(new Error("not found"));

    const response = await PUT(
      makeRequest("http://localhost:3000/api/employees/10", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Jan",
          surname: "Nowak",
          position: "QA",
          project: "Acme",
          hourlyRate: 80,
          hoursWorked: 90,
          status: "active",
        }),
      }) as never,
      makeContext("10"),
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: "Employee not found" });
  });

  it("returns 204 for successful DELETE", async () => {
    prismaMocks.delete.mockResolvedValueOnce({ id: 1 });

    const response = await DELETE(
      makeRequest("http://localhost:3000/api/employees/1", { method: "DELETE" }) as never,
      makeContext("1"),
    );

    expect(response.status).toBe(204);
  });
});

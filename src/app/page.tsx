"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { EmployeeFormSection } from "@/app/components/EmployeeFormSection";
import { EmployeesTable } from "@/app/components/EmployeesTable";
import { FiltersSection } from "@/app/components/FiltersSection";
import { ProjectSummarySection } from "@/app/components/ProjectSummarySection";
import {
  Employee,
  EmployeeForm,
  EmployeePayload,
  SummaryResponse,
  emptyForm,
} from "@/app/types/employee";

export default function HomePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [allProjects, setAllProjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [projectFilter, setProjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [form, setForm] = useState<EmployeeForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [summaryProject, setSummaryProject] = useState("");
  const [summary, setSummary] = useState<SummaryResponse | null>(null);

  const editSectionRef = useRef<HTMLElement | null>(null);

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (projectFilter) params.set("project", projectFilter);
      if (statusFilter) params.set("status", statusFilter);

      const url = params.toString()
        ? `/api/employees?${params.toString()}`
        : "/api/employees";

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to load employees");
      }

      setEmployees(data as Employee[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load employees");
    } finally {
      setIsLoading(false);
    }
  }, [projectFilter, statusFilter]);

  const loadAllProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to load projects");
      }

      const projects = Array.from(
        new Set((data as Employee[]).map((employee) => employee.project)),
      ).sort();

      setAllProjects(projects);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    void loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    void loadAllProjects();
  }, [loadAllProjects]);

  function handleInputChange<K extends keyof EmployeeForm>(
    key: K,
    value: EmployeeForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(employee: Employee) {
    setEditingId(employee.id);
    setForm({
      name: employee.name,
      surname: employee.surname,
      position: employee.position,
      project: employee.project,
      hourlyRate: String(employee.hourlyRate),
      hoursWorked: String(employee.hoursWorked),
      status: employee.status,
    });

    requestAnimationFrame(() => {
      editSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function submitForm(
    event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) {
    event.preventDefault();
    setError("");

    const payload: EmployeePayload = {
      name: form.name,
      surname: form.surname,
      position: form.position,
      project: form.project,
      hourlyRate: Number(form.hourlyRate),
      hoursWorked: Number(form.hoursWorked),
      status: form.status,
    };

    const isEditing = editingId !== null;
    const url = isEditing ? `/api/employees/${editingId}` : "/api/employees";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error ?? (isEditing ? "Failed to update" : "Failed to create"),
        );
      }

      setForm(emptyForm);
      setEditingId(null);
      await Promise.all([loadEmployees(), loadAllProjects()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    }
  }

  async function deleteEmployee(id: number) {
    setError("");

    try {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Failed to delete employee");
      }

      if (editingId === id) {
        cancelEdit();
      }

      await Promise.all([loadEmployees(), loadAllProjects()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function loadSummary(
    event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) {
    event.preventDefault();
    setError("");
    setSummary(null);

    if (!summaryProject.trim()) {
      setError("Please choose a project for summary");
      return;
    }

    try {
      const res = await fetch(
        `/api/employees/summary?project=${encodeURIComponent(summaryProject)}`,
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to load summary");
      }

      setSummary(data as SummaryResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Summary failed");
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">WORKFLEX Employee Management</h1>
        <p className="text-gray-600">Basic CRUD + filters + project summary</p>
      </header>

      {error ? (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </p>
      ) : null}

      <EmployeeFormSection
        editSectionRef={editSectionRef}
        editingId={editingId}
        form={form}
        onInputChange={handleInputChange}
        onCancelEdit={cancelEdit}
        onSubmit={submitForm}
      />

      <FiltersSection
        projectFilter={projectFilter}
        statusFilter={statusFilter}
        projectOptions={allProjects}
        onProjectFilterChange={setProjectFilter}
        onStatusFilterChange={setStatusFilter}
        onRefresh={() => void loadEmployees()}
      />

      <ProjectSummarySection
        summaryProject={summaryProject}
        projectOptions={allProjects}
        summary={summary}
        onSummaryProjectChange={setSummaryProject}
        onSubmit={loadSummary}
      />

      <EmployeesTable
        employees={employees}
        isLoading={isLoading}
        onEdit={startEdit}
        onDelete={(id: number) => void deleteEmployee(id)}
      />
    </main>
  );
}

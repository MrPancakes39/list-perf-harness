import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_BENCHMARK_SEED,
  generateEmployees,
} from "../src/generate-data.ts";

test("generates a unique key for every benchmark employee", () => {
  const employees = generateEmployees(25_000, {
    seed: DEFAULT_BENCHMARK_SEED,
  });
  const employeeIds = new Set(employees.map((employee) => employee.EmployeeID));

  assert.equal(employeeIds.size, employees.length);
});

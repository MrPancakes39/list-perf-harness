/**
 * Based on: https://ej2.syncfusion.com/react/demos/#/bootstrap5/grid/overview
 */
import { faker } from "@faker-js/faker";

const designations = [
  "Designer",
  "Developer",
  "Manager",
  "Analyst",
  "Engineer",
] as const;
const statuses = ["Active", "Inactive", "On Leave"] as const;
const trustworthiness = ["Sufficient", "High", "Low"] as const;
const genders = ["Man", "Woman", "Non-Binary"] as const;

type Designation = (typeof designations)[number];
type Status = (typeof statuses)[number];
type Trustworthiness = (typeof trustworthiness)[number];
type Gender = (typeof genders)[number];

export interface Employee {
  Check: boolean;
  EmployeeID: number;
  Employees: string;
  Designation: Designation;
  Location: string;
  Status: Status;
  Trustworthiness: Trustworthiness;
  Rating: number;
  Software: number;
  Gender: Gender;
  CurrentSalary: number;
  Address: string;
  Mail: string;
}

export const DEFAULT_BENCHMARK_SEED = 20260220;

interface GenerationOptions {
  seed?: number;
}

export function resetGeneratorSeed(seed = DEFAULT_BENCHMARK_SEED) {
  faker.seed(seed);
}

export function generateEmployee(): Employee {
  const gender = faker.helpers.arrayElement(genders);
  const sex =
    gender === "Man" ? "male" : gender === "Woman" ? "female" : "generic";
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName(sex);
  const name = `${firstName} ${lastName}`;

  return {
    Check: faker.datatype.boolean(),
    EmployeeID: faker.number.int({ min: 100000, max: 999999 }),
    Employees: name,
    Designation: faker.helpers.arrayElement(designations),
    Location: faker.location.country(),
    Status: faker.helpers.arrayElement(statuses),
    Trustworthiness: faker.helpers.arrayElement(trustworthiness),
    Rating: faker.number.int({ min: 1, max: 5 }),
    Software: faker.number.int({ min: 0, max: 100 }),
    Gender: gender,
    CurrentSalary: faker.number.int({ min: 40000, max: 150000 }),
    Address: faker.location.streetAddress(),
    Mail: faker.internet.email({ firstName, lastName }).toLowerCase(),
  };
}

export function generateEmployees(
  count: number,
  options?: GenerationOptions
): Employee[] {
  if (typeof options?.seed === "number") {
    faker.seed(options.seed);
  }

  return Array.from({ length: count }, () => generateEmployee());
}

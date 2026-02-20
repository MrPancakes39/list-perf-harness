import { EmployeeItem } from "./EmployeeItem";
import { generateEmployee } from "./generate-data";

const employee = generateEmployee();

function App() {
  return (
    <div>
      <EmployeeItem employee={employee} />
    </div>
  );
}

export default App;

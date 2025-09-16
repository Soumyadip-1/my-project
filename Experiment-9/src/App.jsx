import React from "react";
import { Student, Teacher } from "./components/Person";

function App() {
  // Create instances
  const student1 = new Student("Alice", 20, "Computer Science");
  const student2 = new Student("Rahul", 22, "Mechanical Engineering");

  const teacher1 = new Teacher("Mr. Sharma", 45, "Mathematics");
  const teacher2 = new Teacher("Ms. Verma", 38, "Physics");

  return (
    <div className="container">
      <h1>Person Class Hierarchy</h1>

      <div className="card">
        <h2>Students</h2>
        <p>{student1.getInfo()}</p>
        <p>{student2.getInfo()}</p>
      </div>

      <div className="card">
        <h2>Teachers</h2>
        <p>{teacher1.getInfo()}</p>
        <p>{teacher2.getInfo()}</p>
      </div>
    </div>
  );
}

export default App;

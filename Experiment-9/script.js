// Base class
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  displayInfo() {
    return `Name: ${this.name}, Age: ${this.age}`;
  }
}

// Student subclass
class Student extends Person {
  constructor(name, age, grade) {
    super(name, age); // Call parent constructor
    this.grade = grade;
  }

  // Method overriding
  displayInfo() {
    return `${super.displayInfo()}, Grade: ${this.grade}`;
  }
}

// Teacher subclass
class Teacher extends Person {
  constructor(name, age, subject) {
    super(name, age);
    this.subject = subject;
  }

  // Method overriding
  displayInfo() {
    return `${super.displayInfo()}, Subject: ${this.subject}`;
  }
}

// Creating instances
const student1 = new Student("Alice", 20, "10th Grade");
const student2 = new Student("Bob", 22, "Computer Science");

const teacher1 = new Teacher("Mr. Smith", 40, "Mathematics");
const teacher2 = new Teacher("Mrs. Johnson", 35, "History");

// Display output
const outputDiv = document.getElementById("output");

const people = [student1, student2, teacher1, teacher2];
people.forEach(person => {
  const p = document.createElement("p");
  p.textContent = person.displayInfo();
  outputDiv.appendChild(p);
});

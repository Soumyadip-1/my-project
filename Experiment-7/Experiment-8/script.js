const searchInput = document.getElementById("search");
const titleInput = document.getElementById("bookTitle");
const authorInput = document.getElementById("bookAuthor");
const addBookBtn = document.getElementById("addBook");
const bookList = document.getElementById("bookList");

// Initial books
let books = [
  { title: "1984", author: "George Orwell" },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  { title: "To Kill a Mockingbird", author: "Harper Lee" }
];

// Render function
function renderBooks(filter = "") {
  bookList.innerHTML = "";
  books
    .filter(
      (b) =>
        b.title.toLowerCase().includes(filter.toLowerCase()) ||
        b.author.toLowerCase().includes(filter.toLowerCase())
    )
    .forEach((book, index) => {
      const div = document.createElement("div");
      div.className = "book-item";
      div.innerHTML = `<div><strong>${book.title}</strong> by ${book.author}</div>
                       <button onclick="removeBook(${index})">Remove</button>`;
      bookList.appendChild(div);
    });
}

// Add book
addBookBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  if (title && author) {
    books.push({ title, author });
    titleInput.value = "";
    authorInput.value = "";
    renderBooks(searchInput.value);
  }
});

// Remove book
function removeBook(index) {
  books.splice(index, 1);
  renderBooks(searchInput.value);
}

// Search books
searchInput.addEventListener("input", (e) => {
  renderBooks(e.target.value);
});

// Initial render
renderBooks();

import React from "react";

function BookList({ books, removeBook }) {
  return (
    <div>
      {books.map((book, index) => (
        <div key={index} className="book-item">
          <p>
            <b>{book.title}</b> by {book.author}
          </p>
          <button onClick={() => removeBook(index)}>Remove</button>
        </div>
      ))}
    </div>
  );
}

export default BookList;

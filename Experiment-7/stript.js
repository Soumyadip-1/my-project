// script.js

// Product data with categories
const products = [
  { name: "T-Shirt", category: "clothing" },
  { name: "Jeans", category: "clothing" },
  { name: "Headphones", category: "electronics" },
  { name: "Smartphone", category: "electronics" },
  { name: "Novel", category: "books" },
  { name: "Cookbook", category: "books" },
];

// DOM Elements
const categoryDropdown = document.getElementById("categoryDropdown");
const productList = document.getElementById("productList");

// Function to render product items based on current filter selection
function renderProducts(filterCategory) {
  // Clear current products
  productList.innerHTML = "";

  // Filter products based on category. If "all", use full list
  const filteredProducts =
    filterCategory === "all"
      ? products
      : products.filter((product) => product.category === filterCategory);

  // Create list items for filtered products
  filteredProducts.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = product.name;
    productList.appendChild(li);
  });

  // If no products to show, show message
  if (filteredProducts.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No products available in this category.";
    li.style.fontStyle = "italic";
    li.style.color = "#888";
    productList.appendChild(li);
  }
}

// Initial render with all products
renderProducts("all");

// Set event listener for dropdown change to filter product list dynamically
categoryDropdown.addEventListener("change", (event) => {
  renderProducts(event.target.value);
});
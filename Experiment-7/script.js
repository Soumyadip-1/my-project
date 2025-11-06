const products = [
  { name: "Wireless Mouse", price: 25.99, status: "In Stock" },
  { name: "Keyboard", price: 45.5, status: "Out of Stock" },
  { name: "Monitor", price: 199.99, status: "In Stock" }
];

const container = document.getElementById("products");

products.forEach(product => {
  const card = document.createElement("div");
  card.classList.add("product-card");

  card.innerHTML = `
    <h3>${product.name}</h3>
    <p><strong>Price:</strong> $${product.price}</p>
    <p><strong>Status:</strong> ${product.status}</p>
  `;

  container.appendChild(card);
});

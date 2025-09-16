import React from "react";
import ProductCard from "./ProductCard";

function App() {
  // Array of product objects
  const products = [
    { name: "Laptop", price: "$800", stock: "In Stock" },
    { name: "Smartphone", price: "$500", stock: "Out of Stock" },
    { name: "Headphones", price: "$120", stock: "In Stock" },
    { name: "Tablet", price: "$300", stock: "In Stock" }
  ];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "20px" }}>
      {/* Use map to loop through products */}
      {products.map((item, index) => (
        <ProductCard 
          key={index} 
          name={item.name} 
          price={item.price} 
          stock={item.stock} 
        />
      ))}
    </div>
  );
}

export default App;

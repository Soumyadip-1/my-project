document.addEventListener('DOMContentLoaded', () => {

    const products = [
        { name: 'T-Shirt', category: 't-shirt' },
        { name: 'Jeans', category: 'jeans' },
        { name: 'Headphones', category: 'electronics' },
        { name: 'Smartphone', category: 'electronics' },
        { name: 'Novel', category: 'books' },
        { name: 'Cookbook', category: 'books' }
    ];

   
    const productList = document.getElementById('product-list');
    const categoryFilter = document.getElementById('category-filter');

    // --- Functions ---
    /**
     * Renders the product list based on the selected category.
     * @param {string} filter - The category to filter by ('all' shows all products).
     */
    function renderProducts(filter = 'all') {
        
        productList.innerHTML = '';

        
        const filteredProducts = products.filter(product => {
            if (filter === 'all') {
                return true; // Show all products
            }
            return product.category === filter;
        });

        
        if (filteredProducts.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No products found in this category.';
            productList.appendChild(li);
            return;
        }

       
        filteredProducts.forEach(product => {
            const li = document.createElement('li');
            li.textContent = product.name;
            productList.appendChild(li);
        });
    }

    
    categoryFilter.addEventListener('change', (event) => {
        renderProducts(event.target.value);
    });

   
    renderProducts();
});
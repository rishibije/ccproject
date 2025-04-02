// API Gateway URL (Replace with your Azure API Management endpoint)
const API_URL = "https://inventory-dashboard.azurestaticapps.net";

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loadProducts').addEventListener('click', loadProducts);
    document.getElementById('addProduct').addEventListener('click', addProduct);
    loadProducts();
});

async function loadProducts() {
    const loading = document.getElementById('loading');
    const tableBody = document.querySelector('#productsTable tbody');
    
    loading.style.display = 'block';
    tableBody.innerHTML = '';

    try {
        const response = await fetch(`${API_URL}/products`, {
            headers: {
                'Ocp-Apim-Subscription-Key': 'your-subscription-key' // Add if using APIM
            }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const products = await response.json();
        
        if (products.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4">No products found</td></tr>';
        } else {
            tableBody.innerHTML = products.map(product => `
                <tr>
                    <td>${product.ProductID}</td>
                    <td>${product.Name}</td>
                    <td>$${product.Price.toFixed(2)}</td>
                    <td>${product.StockQuantity}</td>
                </tr>
            `).join('');
        }
    } catch (error) {
        tableBody.innerHTML = `<tr><td colspan="4">Error: ${error.message}</td></tr>`;
        console.error('Fetch error:', error);
    } finally {
        loading.style.display = 'none';
    }
}

async function addProduct() {
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);

    if (!name || isNaN(price)) {
        alert("Please enter valid product details!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': 'your-subscription-key'
            },
            body: JSON.stringify({ 
                Name: name, 
                Price: price 
            })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        alert("Product added successfully!");
        document.getElementById('productName').value = "";
        document.getElementById('productPrice').value = "";
        loadProducts();
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error('Add product error:', error);
    }
}
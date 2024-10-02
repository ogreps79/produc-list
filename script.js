let products = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let inFavoritesView = false;

window.onload = () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts(products);
        });
};

function displayProducts(productList) {
    const productListView = document.getElementById('product-list');
    const productCountValue = document.getElementById('product-count-value');
    productListView.innerHTML = '';
    
    productList.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';

        let imagesHTML = '<div class="image-slider">';
        product.images.forEach(image => {
            imagesHTML += `<img src="${image}" alt="${product.title}">`;
        });
        imagesHTML += '</div>';

        productDiv.innerHTML = `
            ${imagesHTML}
            <h2 onclick="toggleFavorites(false)">${product.title}</h2>
            <p>${product.description}</p>
            <div class="price">${product.price}</div>
            <button onclick="openFavoriteModal(${product.id})">Favorisieren</button>
        `;

        productListView.appendChild(productDiv);
    });

    productCountValue.textContent = productList.length;
}

function openFavoriteModal(productId) {
    // Modal öffnen und Variante/Größe auswählen
}

function closeModal() {
    document.getElementById('variant-size-modal').style.display = 'none';
}

function confirmSelection() {
    // Auswahl bestätigen und in Favoriten speichern
}

function toggleFavorites(view) {
    inFavoritesView = view;
    if (inFavoritesView) {
        displayProducts(favorites);
    } else {
        displayProducts(products);
    }
}

function searchProducts() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    displayProducts(filteredProducts);
}

let products = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let selectedProduct = null;  // Für Auswahl von Varianten und Größen
let selectedVariant = '';
let selectedSize = '';
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

        // Favoritenansicht ändert das Layout
        if (inFavoritesView) {
            productDiv.innerHTML = `
                ${imagesHTML}
                <h2>${product.title}</h2>
                <div class="price">${product.price}</div>
                <p>Variante: ${product.selectedVariant}</p>
                <p>Größe: ${product.selectedSize}</p>
            `;
        } else {
            productDiv.innerHTML = `
                ${imagesHTML}
                <h2>${product.title}</h2>
                <p>${product.description}</p>
                <div class="price">${product.price}</div>
                <button onclick="openFavoriteModal(${product.id})">Favorisieren</button>
            `;
        }

        productListView.appendChild(productDiv);
    });

    productCountValue.textContent = productList.length;
}

function openFavoriteModal(productId) {
    selectedProduct = products.find(product => product.id === productId);
    
    const variantSelection = document.getElementById('variant-selection');
    const sizeSelection = document.getElementById('size-selection');
    
    variantSelection.innerHTML = '<h3>Variante wählen:</h3>';
    sizeSelection.innerHTML = '<h3>Größe wählen:</h3>';

    selectedProduct.variants.forEach(variant => {
        variantSelection.innerHTML += `
            <label>
                <input type="radio" name="variant" value="${variant}" onclick="selectVariant('${variant}')">
                ${variant}
            </label>
        `;
    });

    selectedProduct.sizes.forEach(size => {
        sizeSelection.innerHTML += `
            <label>
                <input type="radio" name="size" value="${size}" onclick="selectSize('${size}')">
                ${size}
            </label>
        `;
    });

    document.getElementById('variant-size-modal').style.display = 'block';
}

function selectVariant(variant) {
    selectedVariant = variant;
}

function selectSize(size) {
    selectedSize = size;
}

function confirmSelection() {
    if (selectedVariant && selectedSize) {
        // Favorit hinzufügen
        selectedProduct.selectedVariant = selectedVariant;
        selectedProduct.selectedSize = selectedSize;
        favorites.push(selectedProduct);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        closeModal();
    } else {
        alert('Bitte Variante und Größe auswählen!');
    }
}

function closeModal() {
    document.getElementById('variant-size-modal').style.display = 'none';
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

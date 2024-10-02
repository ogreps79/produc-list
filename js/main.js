document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const favoritesList = document.getElementById('favorites-list');
    const productCount = document.getElementById('product-count');
    const searchBar = document.getElementById('search-bar');
    const favoritesTab = document.getElementById('favorites-tab');
    const variantModal = document.getElementById('variant-modal');
    const closeBtn = document.getElementById('close-modal');
    let products = [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Fetch product data
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts(products);
        });

    // Display products
    function displayProducts(productArray) {
        productList.innerHTML = '';
        productArray.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            
            card.innerHTML = `
                <div class="product-images">
                    ${product.images.map(img => `<img src="${img}" alt="Product Image">`).join('')}
                </div>
                <h2>${product.title}</h2>
                <p>${product.description}</p>
                <p>Preis: ${product.price}€</p>
                <button class="favorite-btn" data-id="${product.id}">Favorisieren</button>
            `;
            productList.appendChild(card);
        });
        productCount.innerText = `${productArray.length} Produkte angezeigt`;
    }

    // Search function
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product => product.title.toLowerCase().includes(searchTerm));
        displayProducts(filteredProducts);
    });

    // Show favorites
    favoritesTab.addEventListener('click', () => {
        productList.classList.toggle('hidden');
        favoritesList.classList.toggle('hidden');
        displayFavorites();
    });

    // Display favorites
    function displayFavorites() {
        favoritesList.innerHTML = '';
        favorites.forEach(favorite => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            
            card.innerHTML = `
                <div class="product-images">
                    ${favorite.images.map(img => `<img src="${img}" alt="Product Image">`).join('')}
                </div>
                <h2>${favorite.title}</h2>
                <p>Preis: ${favorite.price}€</p>
                <p>Ausgewählte Größe: ${favorite.size}</p>
                <p>Ausgewählte Variante: ${favorite.variant}</p>
            `;
            favoritesList.appendChild(card);
        });
        productCount.innerText = `${favorites.length} Favoriten angezeigt`;
    }

    // Open modal for variants
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('favorite-btn')) {
            const productId = e.target.dataset.id;
            const product = products.find(p => p.id == productId);
            openVariantModal(product);
        }
    });

    // Open variant modal
    function openVariantModal(product) {
        variantModal.classList.remove('hidden');
        const variantOptions = document.getElementById('variant-options');
        const sizeOptions = document.getElementById('size-options');

        variantOptions.innerHTML = `
            <h3>Varianten</h3>
            ${product.variants.map(variant => `<button>${variant}</button>`).join('')}
        `;

        sizeOptions.innerHTML = `
            <h3>Größen</h3>
            ${product.sizes.map(size => `<button>${size}</button>`).join('')}
        `;
    }

    // Close modal
    closeBtn.addEventListener('click', () => {
        variantModal.classList.add('hidden');
    });

    // Save favorite
    document.getElementById('save-favorite').addEventListener('click', () => {
        const selectedVariant = document.querySelector('#variant-options button.active').innerText;
        const selectedSize = document.querySelector('#size-options button.active').innerText;

        // Add to favorites
        const favoriteProduct = {
            ...currentProduct, // Product data
            variant: selectedVariant,
            size: selectedSize
        };

        favorites.push(favoriteProduct);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        variantModal.classList.add('hidden');
    });
});

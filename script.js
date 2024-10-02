document.addEventListener('DOMContentLoaded', () => {
    let products = [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search');
    const modal = document.getElementById('favorite-modal');
    const closeModal = document.getElementById('close-modal');
    const saveFavoriteBtn = document.getElementById('save-favorite');
    let currentProduct = null;

    // Produkte laden
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts(products);
        });

    // Produkte anzeigen
    function displayProducts(productArray) {
        productList.innerHTML = '';
        productArray.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <img src="${product.images[0]}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
                <button class="favorite-btn" data-id="${product.id}">Favorize</button>
            `;
            productList.appendChild(productElement);
        });

        // Favorisieren Buttons
        document.querySelectorAll('.favorite-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                currentProduct = products.find(p => p.id == e.target.dataset.id);
                showModal();
            });
        });
    }

    // Suche
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
        displayProducts(filteredProducts);
    });

    // Modal anzeigen
    function showModal() {
        document.getElementById('variants').innerHTML = currentProduct.variants.map(v => `<option>${v}</option>`).join('');
        document.getElementById('sizes').innerHTML = currentProduct.sizes.map(s => `<option>${s}</option>`).join('');
        modal.style.display = 'flex';
    }

    // Modal schließen
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Favorit speichern
    saveFavoriteBtn.addEventListener('click', () => {
        const selectedVariant = document.getElementById('variants').value;
        const selectedSize = document.getElementById('sizes').value;
        const favorite = { ...currentProduct, selectedVariant, selectedSize };
        favorites.push(favorite);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        modal.style.display = 'none';
    });

    // Favoriten anzeigen
    document.getElementById('favorites-btn').addEventListener('click', () => {
        displayProducts(favorites);
    });
});

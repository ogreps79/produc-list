document.addEventListener('DOMContentLoaded', () => {
    let productList = document.getElementById('product-list');
    let favoritesList = document.getElementById('favorites-list');
    let favoritesModal = document.getElementById('favorites-modal');
    let closeModal = document.getElementById('close-modal');

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Lade Produkte aus der JSON-Datei
    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
            document.getElementById('search').addEventListener('input', (event) => {
                let query = event.target.value.toLowerCase();
                let filteredProducts = products.filter(product => product.title.toLowerCase().includes(query));
                displayProducts(filteredProducts);
            });
        });

    function displayProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            let productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <img src="${product.images[0]}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p>Preis: ${product.price} €</p>
                <button class="favorite-btn" data-id="${product.id}">Favorisieren</button>
            `;
            productList.appendChild(productItem);
        });

        document.querySelectorAll('.favorite-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                let productId = event.target.getAttribute('data-id');
                let product = products.find(p => p.id == productId);
                openFavoriteModal(product);
            });
        });
    }

    function openFavoriteModal(product) {
        let modalContent = `
            <h3>${product.title}</h3>
            <p>Wähle Variante und Größe:</p>
            <select id="variant-select">
                ${product.variants.map(variant => `<option value="${variant}">${variant}</option>`).join('')}
            </select>
            <select id="size-select">
                ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
            </select>
            <button id="save-favorite">Speichern</button>
        `;
        favoritesList.innerHTML = modalContent;
        favoritesModal.classList.add('active');

        document.getElementById('save-favorite').addEventListener('click', () => {
            let selectedVariant = document.getElementById('variant-select').value;
            let selectedSize = document.getElementById('size-select').value;

            favorites.push({
                id: product.id,
                title: product.title,
                variant: selectedVariant,
                size: selectedSize
            });

            localStorage.setItem('favorites', JSON.stringify(favorites));
            favoritesModal.classList.remove('active');
        });
    }

    closeModal.addEventListener('click', () => {
        favoritesModal.classList.remove('active');
    });

    document.getElementById('showFavorites').addEventListener('click', () => {
        favoritesList.innerHTML = favorites.map(fav => `
            <div>
                <h3>${fav.title}</h3>
                <p>Variante: ${fav.variant}, Größe: ${fav.size}</p>
            </div>
        `).join('');
        favoritesModal.classList.add('active');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    let products = [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let inFavoritesView = false;  // Überprüfen, ob wir in der Favoritenansicht sind

    const productList = document.getElementById('product-list');
    const searchInput = document.getElementById('search');
    const productCount = document.getElementById('product-count');
    const modal = document.getElementById('favorite-modal');
    const closeModal = document.getElementById('close-modal');
    const saveFavoriteBtn = document.getElementById('save-favorite');
    const favoritesBtn = document.getElementById('favorites-btn');
    let currentProduct = null;

    // Produkte laden
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts(products);
        });

    // Produkte anzeigen und aktualisierte Anzahl anzeigen
    function displayProducts(productArray) {
        productList.innerHTML = '';
        productCount.textContent = `Showing ${productArray.length} products`;

        productArray.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');

            // Swipe Bilder
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');

            product.images.forEach((image, index) => {
                const imgElement = document.createElement('img');
                imgElement.src = image;
                if (index === 0) imgElement.classList.add('active');
                imageContainer.appendChild(imgElement);
            });

            let currentImageIndex = 0;
            imageContainer.addEventListener('click', () => {
                const images = imageContainer.querySelectorAll('img');
                images[currentImageIndex].classList.remove('active');
                currentImageIndex = (currentImageIndex + 1) % images.length;
                images[currentImageIndex].classList.add('active');
            });

            // Produktdetails
            productElement.innerHTML = `
                <h3>${product.title}</h3>
                <p class="price">Price: $${product.price}</p>
            `;

            // In der Favoritenansicht nicht den Favorisieren-Button und Beschreibung zeigen
            if (!inFavoritesView) {
                const description = document.createElement('p');
                description.textContent = product.description;
                productElement.appendChild(description);

                const favoriteBtn = document.createElement('button');
                favoriteBtn.classList.add('favorite-btn');
                favoriteBtn.textContent = 'Favorize';
                favoriteBtn.dataset.id = product.id;
                productElement.appendChild(favoriteBtn);
            } else {
                const selectedVariant = favorites.find(fav => fav.id === product.id).selectedVariant;
                const selectedSize = favorites.find(fav => fav.id === product.id).selectedSize;

                const favoriteInfo = document.createElement('div');
                favoriteInfo.classList.add('product-favorite');
                favoriteInfo.innerHTML = `
                    <p>Variant: ${selectedVariant}</p>
                    <p>Size: ${selectedSize}</p>
                `;
                productElement.appendChild(favoriteInfo);
            }

            productElement.insertBefore(imageContainer, productElement.firstChild);
            productList.appendChild(productElement);

            // Titel-Klick: Zurück zur Produktliste aus Favoritenansicht
            productElement.querySelector('h3').addEventListener('click', () => {
                if (inFavoritesView) {
                    inFavoritesView = false;
                    displayProducts(products);
                    productCount.textContent = `Showing ${products.length} products`;
                }
            });
        });

        // Favorisieren Buttons hinzufügen
        if (!inFavoritesView) {
            document.querySelectorAll('.favorite-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    currentProduct = products.find(p => p.id == e.target.dataset.id);
                    showModal();
                });
            });
        }
    }

    // Suche
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
        displayProducts(filteredProducts);
        productCount.textContent = `Showing ${filteredProducts.length} products`;
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
    favoritesBtn.addEventListener('click', () => {
        inFavoritesView = true;
        displayProducts(favorites);
        productCount.textContent = `Showing ${favorites.length} favorites`;
    });
});

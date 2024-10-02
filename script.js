document.addEventListener("DOMContentLoaded", function () {
  let products = [];
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let filteredProducts = [];

  // Load products from JSON
  fetch('produkte.json')
    .then(response => response.json())
    .then(data => {
      products = data;
      filteredProducts = products;
      renderProducts(filteredProducts);
    });

  // Search functionality
  document.getElementById('search').addEventListener('input', function (e) {
    const query = e.target.value.toLowerCase();
    filteredProducts = products.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
    renderProducts(filteredProducts);
  });

  // Render product list
  function renderProducts(products) {
    const productList = document.getElementById('product-list');
    const productCount = document.getElementById('product-count');
    productList.innerHTML = '';
    productCount.textContent = `${products.length} Produkte gefunden`;

    products.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');

      let productImages = '<div class="product-images">';
      product.images.forEach(image => {
        productImages += `<img src="${image}" alt="${product.title}">`;
      });
      productImages += '</div>';

      productDiv.innerHTML = `
        ${productImages}
        <h3>${product.title}</h3>
        <p class="price">€${product.price}</p>
        <p>${product.description}</p>
        <button class="favorite-button" data-id="${product.id}">Favorisieren</button>
      `;

      productList.appendChild(productDiv);
    });

    attachFavoriteListeners();
  }

  // Attach favorite buttons
  function attachFavoriteListeners() {
    const favoriteButtons = document.querySelectorAll('.favorite-button');
    favoriteButtons.forEach(button => {
      button.addEventListener('click', function (e) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        const selectedProduct = products.find(p => p.id === productId);
        showVariantSizeModal(selectedProduct);
      });
    });
  }

  // Show variant and size selection
  function showVariantSizeModal(product) {
    const modal = document.getElementById('variant-size-modal');
    const variantSelection = document.getElementById('variant-selection');
    const sizeSelection = document.getElementById('size-selection');

    variantSelection.innerHTML = '';
    sizeSelection.innerHTML = '';

    product.variants.forEach(variant => {
      variantSelection.innerHTML += `<label><input type="radio" name="variant" value="${variant}"> ${variant}</label>`;
    });

    product.sizes.forEach(size => {
      sizeSelection.innerHTML += `<label><input type="radio" name="size" value="${size}"> ${size}</label>`;
    });

    modal.style.display = 'flex';

    document.getElementById('save-favorite').onclick = function () {
      const selectedVariant = document.querySelector('input[name="variant"]:checked').value;
      const selectedSize = document.querySelector('input[name="size"]:checked').value;

      const favoriteItem = { ...product, selectedVariant, selectedSize };
      favorites.push(favoriteItem);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      modal.style.display = 'none';
    };

    document.querySelector('.close').onclick = function () {
      modal.style.display = 'none';
    };
  }

  // Switch between products and favorites view
  document.getElementById('view-products').onclick = function () {
    filteredProducts = products;
    renderProducts(filteredProducts);
  };

  document.getElementById('view-favorites').onclick = function () {
    renderFavorites();
  };

  function renderFavorites() {
    const productList = document.getElementById('product-list');
    const productCount = document.getElementById('product-count');
    productList.innerHTML = '';
    productCount.textContent = `${favorites.length} Favoriten`;

    favorites.forEach(favorite => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');

      let productImages = '<div class="product-images">';
      favorite.images.forEach(image => {
        productImages += `<img src="${image}" alt="${favorite.title}">`;
      });
      productImages += '</div>';

      productDiv.innerHTML = `
        ${productImages}
        <h3>${favorite.title}</h3>
        <p class="price">€${favorite.price}</p>
        <p>Variante: ${favorite.selectedVariant}</p>
        <p>Größe: ${favorite.selectedSize}</p>
      `;

      productList.appendChild(productDiv);
    });
  }
});

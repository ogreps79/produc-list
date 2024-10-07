// script.js
let products = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let selectedProduct = null;
let selectedVariant = null;
let selectedSize = null;

// Fetch products from JSON file
fetch('productsV2.json')
    .then(response => response.json())
    .then(data => {
        products = data.articles;
        displayProducts(products);
        displayFavorites(favorites);
    });
const productList = document.getElementById('product-list');
const favoriteList = document.getElementById('favorite-list');
const searchInput = document.getElementById('search');
const articleCount = document.getElementById('article-count');

// Modal elements
const modal = document.getElementById('variant-size-modal');
const onesizeInfo = document.getElementById('onesize-info');
const variantSelection = document.getElementById('variant-selection');
const sizeSelection = document.getElementById('size-selection');
const variantImages = document.getElementById('variant-images');
const sizeSelect = document.getElementById('sizeSelect');
const saveButton = document.getElementById('save-button');

// Display products
// Display products
function displayProducts(productArray) {
  productList.innerHTML = '';
  productArray.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('product');

      // Wrap each image inside an .aspect-ratio-box
      let images = product.images.map(img => `
          <div class="aspect-ratio-box">
              <img src="${img.src}" alt="${product.title}" class="swipe-image">
          </div>`).join('');
      
      productElement.innerHTML = `
          <div class="swiper">
              <div class="swipe-container">
                  ${images}
              </div>
          </div>
          <h3>${product.title}</h3>
          <p class="price-text">${product.price}€</p>
          ${product.description ? `<p>${product.description}</p>` : ''}
          <button class="button" onclick="openFavoriteModal(${products.indexOf(product)})">Speichern</button>
      `;
      
      productList.appendChild(productElement);

      // Initialize swipe functionality
      initSwipe(productElement.querySelector('.swipe-container'));
  });
}

// Swipe functionality remains the same
function initSwipe(swipeContainer) {
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let currentIndex = 0;
  
  const images = swipeContainer.querySelectorAll('.aspect-ratio-box');
  const totalImages = images.length;

  // Calculate the width of the first image (including margin/gap)
  const imageWidth = images[0].offsetWidth;
  const imageMarginRight = parseFloat(getComputedStyle(images[0]).marginRight); // Get the margin-right value

  // Update the swipeContainer transform position
  function setSliderPosition() {
      swipeContainer.style.transform = `translateX(${currentTranslate}px)`;
  }

  // Move to the next slide based on direction
  function moveToNextSlide(direction) {
      if (direction === 'left' && currentIndex < totalImages - 1) {
          currentIndex++;
      } else if (direction === 'right' && currentIndex > 0) {
          currentIndex--;
      }

      // Adjust the movement based on image width and margin
      currentTranslate = -(currentIndex * (imageWidth + imageMarginRight));
      setSliderPosition();
  }

  // Handle swipe end and determine direction
  function handleEnd(endX) {
      const movedBy = endX - startX;

      if (movedBy < -50) {
          moveToNextSlide('left');
      } else if (movedBy > 50) {
          moveToNextSlide('right');
      } else {
          currentTranslate = prevTranslate;  // Snap back if not enough movement
          setSliderPosition();
      }
      isDragging = false;
  }

  // Touch Events for Mobile
  swipeContainer.addEventListener('touchstart', (event) => {
      isDragging = true;
      startX = event.touches[0].clientX;
      prevTranslate = currentTranslate;
  });

  swipeContainer.addEventListener('touchmove', (event) => {
      if (!isDragging) return;
      const currentX = event.touches[0].clientX;
      const deltaX = currentX - startX;
      currentTranslate = prevTranslate + deltaX;
      setSliderPosition();
  });

  swipeContainer.addEventListener('touchend', (event) => {
      handleEnd(event.changedTouches[0].clientX);
  });

  swipeContainer.addEventListener('touchleave', (event) => {
      if (isDragging) {
          handleEnd(event.changedTouches[0].clientX);
      }
  });

  // Mouse Events for Desktop
  swipeContainer.addEventListener('mousedown', (event) => {
      isDragging = true;
      startX = event.clientX;
      prevTranslate = currentTranslate;
      event.preventDefault();  // Prevent text selection while dragging
  });

  swipeContainer.addEventListener('mousemove', (event) => {
      if (!isDragging) return;
      const currentX = event.clientX;
      const deltaX = currentX - startX;
      currentTranslate = prevTranslate + deltaX;
      setSliderPosition();
  });

  swipeContainer.addEventListener('mouseup', (event) => {
      handleEnd(event.clientX);
  });

  swipeContainer.addEventListener('mouseleave', (event) => {
      if (isDragging) {
          handleEnd(event.clientX);
      }
  });

  // Prevent images from being dragged
  images.forEach(img => img.addEventListener('dragstart', (e) => e.preventDefault()));
}



// Update article count
function updateArticleCount(count) {
    articleCount.innerText = `Anzahl der angezeigten Artikel: ${count}`;
}

// Open modal to select variant and size
function openFavoriteModal(index) {
    selectedProduct = products[index];
    selectedVariant = null;
    selectedSize = null;
    variantSelection.style.display = 'none';
    sizeSelection.style.display = 'none';
    saveButton.style.display = 'none';
    onesizeInfo.innerHTML = '';

    if (selectedProduct.variants.length > 0) {
        // Display variant selection
        variantImages.innerHTML = selectedProduct.variants.map((variant, i) => `
            <img src="${variant.src}" alt="${variant.value}" onclick="selectVariant(${i})">
        `).join('');
        variantSelection.style.display = 'block';
    } else {
        onesizeInfo.innerHTML = `<img class="onesize-image" src="${products[index].images[0].src}">`
        // Proceed to size selection if no variants
        openSizeSelection();
    }

    modal.style.display = 'block';
}

// Select variant
function selectVariant(variantIndex) {
    selectedVariant = selectedProduct.variants[variantIndex];
    document.querySelectorAll('#variant-images img').forEach(img => img.classList.remove('selected'));
    document.querySelectorAll('#variant-images img')[variantIndex].classList.add('selected');

    // Proceed to size selection after variant is selected
    openSizeSelection();
}

// Open size selection after variant is selected
function openSizeSelection() {
    sizeSelect.innerHTML = '';
    if (selectedProduct.sizes.length > 0) {
        sizeSelect.innerHTML = selectedProduct.sizes.map(size => `
            <option value="${size.value}">${size.value}</option>
        `).join('');
        sizeSelection.style.display = 'block';
    }
    else {
      onesizeInfo.innerHTML += `<option value="onesize">onesize</option>`
    }
    saveButton.style.display = 'block';
}

// Save favorite with selected variant and size
function saveFavorite() {
    selectedSize = sizeSelect.value ? { value: sizeSelect.value } : null;
    const favoriteProduct = {
        ...selectedProduct,
        selectedVariant: selectedVariant,
        selectedSize: selectedSize
    };

    favorites.push(favoriteProduct);
    saveFavorites();
    closeModal();
}

// Save favorites to localStorage
function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites(favorites);
}

function displayFavorites(favoritesArray) {
  favoriteList.innerHTML = '';
  favoritesArray.forEach((fav, index) => {
      const favoriteElement = document.createElement('div');
      favoriteElement.classList.add('favorite-product');

      const orderCode = `${fav.title} - Ausführung: ${fav.selectedVariant ? fav.selectedVariant.value : 'normal'} - Größe: ${fav.selectedSize ? fav.selectedSize.value : 'onesize'}`;

      favoriteElement.innerHTML = `
        <img src="${fav.selectedVariant ? fav.selectedVariant.src : fav.images[0].src}" alt="${fav.title}">
        <div class="favorite-info">
            <h3>${fav.title}</h3>
            <p class="price-text">${fav.price}€</p>
            <p>Größe: ${fav.selectedSize ? fav.selectedSize.value : 'onesize'}</p>
            <span class="copied-text">></span>
            <button class="button copy-button" data-clipboard-text="${orderCode}">order code kopieren</button>
            <span class="copied-text"><</span>
            <button class="remove-favorite" data-index="${index}">&times;</button> <!-- Close Button -->
        </div>
      `;

      favoriteList.appendChild(favoriteElement);
  });

  // Initialize clipboard buttons
  const clipboardButtons = document.querySelectorAll('button.copy-button');
  clipboardButtons.forEach(button => {
      const copiedTextLeft = button.previousElementSibling;
      const copiedTextRight = button.nextElementSibling;
      copiedTextLeft.style.display = 'none';
      copiedTextRight.style.display = 'none';

      button.addEventListener('click', () => {
          navigator.clipboard.writeText(button.getAttribute('data-clipboard-text'));
          copiedTextLeft.style.display = 'inline';
          copiedTextRight.style.display = 'inline';
          setTimeout(() => {
              copiedTextLeft.style.display = 'none';
              copiedTextRight.style.display = 'none';
          }, 300);
      });
  });

  // Handle remove favorite functionality
  const removeButtons = document.querySelectorAll('button.remove-favorite');
  removeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
          const index = e.target.getAttribute('data-index');
          removeFavorite(index);
      });
  });

  // Create a container for the copy all button
  const copyAllContainer = document.createElement('div');
  copyAllContainer.classList.add('copy-all-container'); // Add a class for styling
  favoriteList.appendChild(copyAllContainer);

  // Create a button to copy all order codes
  const copyAllButton = document.createElement('button');
  copyAllButton.classList.add('button', 'copy-all-button');
  copyAllButton.textContent = 'Alle Codes kopieren';

  // Create indicators for the copy all button
  const copiedTextLeft = document.createElement('span');
  copiedTextLeft.classList.add('copied-text');
  copiedTextLeft.textContent = '>';
  copiedTextLeft.style.display = 'none';

  const copiedTextRight = document.createElement('span');
  copiedTextRight.classList.add('copied-text');
  copiedTextRight.textContent = '<';
  copiedTextRight.style.display = 'none';

  // Append the button and indicators to the container
  copyAllContainer.appendChild(copiedTextLeft);
  copyAllContainer.appendChild(copyAllButton);
  copyAllContainer.appendChild(copiedTextRight);

  // Add event listener to the copy all button
  copyAllButton.addEventListener('click', () => {
      const allOrderCodes = favoritesArray.map(fav => {
          const selectedVariant = fav.selectedVariant ? fav.selectedVariant.value : 'normal';
          const selectedSize = fav.selectedSize ? fav.selectedSize.value : 'onesize';
          return `${fav.title} - Ausführung: ${selectedVariant} - Größe: ${selectedSize}`;
      }).join('\n'); // Join all codes with a newline for better readability

      navigator.clipboard.writeText(allOrderCodes).then(() => {
          copiedTextLeft.style.display = 'inline';
          copiedTextRight.style.display = 'inline';
          setTimeout(() => {
              copiedTextLeft.style.display = 'none';
              copiedTextRight.style.display = 'none';
          }, 300);
      }).catch(err => {
          console.error('Failed to copy: ', err);
      });
  });
}

// Remove favorite from the list
function removeFavorite(index) {
  favorites.splice(index, 1);  // Remove the favorite at the given index
  saveFavorites();             // Update the localStorage
}


// Close modal
function closeModal() {
    modal.style.display = 'none';
    variantImages.innerHTML = '';
    sizeSelect.innerHTML = '';
}

// Filter products by search
let searchTimeout;

searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product => product.title.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm));
    const filteredFavorites = favorites.filter(favorite => favorite.title.toLowerCase().includes(searchTerm) || favorite.description.toLowerCase().includes(searchTerm));

    // Fade out products
    productList.style.opacity = 0;
    setTimeout(() => {
      displayProducts(filteredProducts);
      // Fade in new products
      productList.style.opacity = 1;
    }, 200);

    // Fade out favorites
    favoriteList.style.opacity = 0;
    setTimeout(() => {
      displayFavorites(filteredFavorites);
      // Fade in new favorites
      favoriteList.style.opacity = 1;
    }, 200);
  }, 300); // Adjust the delay as needed
});

// Toggle views
document.getElementById('show-products').addEventListener('click', () => {
    productList.style.display = 'flex';
    favoriteList.style.display = 'none';
});

document.getElementById('show-favorites').addEventListener('click', () => {
    productList.style.display = 'none';
    favoriteList.style.display = 'flex';
});

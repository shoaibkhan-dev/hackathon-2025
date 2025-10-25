let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const productsContainer = document.getElementById('products');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const categoryFilter = document.getElementById('categoryFilter');
const loadingSpinner = document.getElementById('loadingSpinner');
const cartCount = document.getElementById('cartCount');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const toastNotification = document.getElementById('toastNotification');
const toastTitle = document.getElementById('toastTitle');
const toastMessage = document.getElementById('toastMessage');
const categoryFilterLinks = document.querySelectorAll('.category-filter');
const dealsLink = document.getElementById('dealsLink');
const newArrivalsLink = document.getElementById('newArrivalsLink');

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}
function showToast(title, message, type = 'success') {
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    const toastIcon = toastNotification.querySelector('.toast-icon');
    toastIcon.className = 'toast-icon';
    
    if (type === 'success') {
        toastIcon.classList.add('toast-success');
        toastIcon.innerHTML = '<i class="bi bi-check-lg"></i>';
    } else if (type === 'error') {
        toastIcon.classList.add('toast-error');
        toastIcon.innerHTML = '<i class="bi bi-exclamation-lg"></i>';
    }
    
    toastNotification.classList.add('show');
    
    setTimeout(() => {
        toastNotification.classList.remove('show');
    }, 3000);
}

// Fetch products from API
async function fetchProducts() {
    try {
        loadingSpinner.style.display = 'block';
        const response = await fetch('https://fakestoreapi.com/products');
        allProducts = await response.json();
        displayProducts(allProducts);
        loadingSpinner.style.display = 'none';
    } catch (error) {
        console.error('Error fetching products:', error);
        loadingSpinner.style.display = 'none';
        productsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-exclamation-triangle-fill text-warning display-1"></i>
                <h3 class="mt-3">Failed to load products</h3>
                <p class="text-muted">Please check your internet connection and try again.</p>
            </div>
        `;
    }
}

function displayProducts(products) {
    productsContainer.innerHTML = '';
    
    if (products.length === 0) {
        productsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search display-1 text-muted"></i>
                <h3 class="mt-3">No products found</h3>
                <p class="text-muted">Try adjusting your filters to see more products.</p>
            </div>
        `;
        return;
    }
    
    products.forEach(product => {
        const ratingStars = generateStarRating(product.rating.rate);
        
        const productCard = document.createElement('div');
        productCard.className = 'col-md-6 col-lg-4 col-xl-3';
        productCard.innerHTML = `
            <div class="card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.title}">
                <div class="card-body d-flex flex-column">
                    <span class="product-category mb-2">${product.category}</span>
                    <h5 class="card-title">${product.title.length > 50 ? product.title.substring(0, 50) + '...' : product.title}</h5>
                    <div class="rating mb-2">
                        ${ratingStars}
                        <span class="ms-1 text-muted">(${product.rating.count})</span>
                    </div>
                    <div class="mt-auto">
                        <p class="price-tag mb-3">$${product.price}</p>
                        <div class="d-flex gap-2">
                            <button class="btn btn-primary flex-grow-1 add-to-cart" data-id="${product.id}">
                                Add to Cart
                            </button>
                            <button class="btn btn-outline-primary view-details" data-id="${product.id}">
                                <i class="bi bi-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
    
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            showProductDetails(productId);
        });
    });
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="bi bi-star-fill"></i>';
    }
    
    if (halfStar) {
        starsHTML += '<i class="bi bi-star-half"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="bi bi-star"></i>';
    }
    
    return starsHTML;
}

function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    showToast('Product Added', `${product.title.substring(0, 30)}... has been added to your cart`);
    
    const button = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="bi bi-check-lg"></i> Added';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 1500);
}

function showProductDetails(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('modalProductTitle').textContent = product.title;
    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductName').textContent = product.title;
    document.getElementById('modalProductCategory').textContent = product.category;
    document.getElementById('modalProductPrice').textContent = `$${product.price}`;
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalProductRating').innerHTML = 
        generateStarRating(product.rating.rate) + 
        `<span class="ms-1 text-muted">(${product.rating.count} reviews)</span>`;
    
    const modalAddToCart = document.getElementById('modalAddToCart');
    modalAddToCart.setAttribute('data-id', product.id);
    modalAddToCart.onclick = function() {
        addToCart(product.id);
        const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
        modal.hide();
    };
    
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    productModal.show();
}
function filterProducts() {
    const maxPrice = parseInt(priceRange.value);
    const selectedCategory = categoryFilter.value;
    
    priceValue.textContent = `$0 - $${maxPrice}`;
    
    const filteredProducts = allProducts.filter(product => {
        const priceMatch = product.price <= maxPrice;
        const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
        return priceMatch && categoryMatch;
    });
    
    displayProducts(filteredProducts);
}

function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filterProducts();
        return;
    }
    
    const filteredProducts = allProducts.filter(product => {
        return product.title.toLowerCase().includes(searchTerm) || 
               product.description.toLowerCase().includes(searchTerm) ||
               product.category.toLowerCase().includes(searchTerm);
    });
    
    displayProducts(filteredProducts);
}

function filterByCategory(category) {
    categoryFilter.value = category;
    filterProducts();
}

function showDeals() {
    const deals = allProducts.filter(product => product.price < 50);
    displayProducts(deals);
    showToast('Deals', 'Showing products under $50');
}

function showNewArrivals() {
    const newArrivals = [...allProducts].slice(-6);
    displayProducts(newArrivals);
    showToast('New Arrivals', 'Showing our latest products');
}

function init() {
    updateCartCount();
    fetchProducts();
    
    priceRange.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    
    searchButton.addEventListener('click', searchProducts);
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchProducts();
        }
    });
    
    categoryFilterLinks.forEach(link => {
        link.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterByCategory(category);
        });
    });
    
    dealsLink.addEventListener('click', function(e) {
        e.preventDefault();
        showDeals();
    });
    
    newArrivalsLink.addEventListener('click', function(e) {
        e.preventDefault();
        showNewArrivals();
    });
}

document.addEventListener('DOMContentLoaded', init);
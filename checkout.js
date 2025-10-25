const cartCount = document.getElementById('cartCount');
const checkoutItems = document.getElementById('checkoutItems');
const checkoutSubtotal = document.getElementById('checkoutSubtotal');
const checkoutShipping = document.getElementById('checkoutShipping');
const checkoutTax = document.getElementById('checkoutTax');
const checkoutTotal = document.getElementById('checkoutTotal');
const checkoutForm = document.getElementById('checkoutForm');
const successMessage = document.getElementById('successMessage');
const creditCardForm = document.getElementById('creditCardForm');
const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function displayCheckoutItems() {
    checkoutItems.innerHTML = '';
    
    if (cart.length === 0) {
        checkoutItems.innerHTML = `
            <div class="text-center py-3">
                <p class="text-muted">Your cart is empty</p>
                <a href="index.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        return;
    }
    
    cart.forEach(item => {
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'd-flex justify-content-between mb-3';
        checkoutItem.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${item.image}" class="img-thumbnail me-3" style="width: 60px; height: 60px; object-fit: contain;" alt="${item.title}">
                <div>
                    <h6 class="mb-0">${item.title.length > 30 ? item.title.substring(0, 30) + '...' : item.title}</h6>
                    <small class="text-muted">Qty: ${item.quantity}</small>
                </div>
            </div>
            <div class="text-end">
                <p class="mb-0 fw-bold">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        `;
        checkoutItems.appendChild(checkoutItem);
    });
    
    updateCheckoutSummary();
}

// Update checkout summary
function updateCheckoutSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 5.00 : 0;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    checkoutShipping.textContent = `$${shipping.toFixed(2)}`;
    checkoutTax.textContent = `$${tax.toFixed(2)}`;
    checkoutTotal.textContent = `$${total.toFixed(2)}`;
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zipCode = document.getElementById('zipCode').value;
    
    if (!firstName || !lastName || !email || !address || !city || !state || !zipCode) {
        alert('Please fill in all required fields.');
        return;
    }
    
    checkoutForm.style.display = 'none';
    successMessage.style.display = 'block';
    
    localStorage.removeItem('cart');
    cart = [];
    updateCartCount();
}

function handlePaymentMethodChange() {
    paymentMethods.forEach(method => {
        if (method.checked) {
            if (method.value === 'credit' || method.value === 'debit') {
                creditCardForm.style.display = 'block';
            } else {
                creditCardForm.style.display = 'none';
            }
        }
    });
}

function init() {
    updateCartCount();
    displayCheckoutItems();
    
    // Event listeners
    checkoutForm.addEventListener('submit', handleFormSubmit);
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', handlePaymentMethodChange);
    });
    
    handlePaymentMethodChange();
}
document.addEventListener('DOMContentLoaded', init);
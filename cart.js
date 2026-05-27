let cart = JSON.parse(localStorage.getItem('egarden_cart')) || [];

// Clean up any corrupt items that were saved during the previous bug
cart = cart.filter(item => typeof item.image === 'string' && item.image.length > 5);
localStorage.setItem('egarden_cart', JSON.stringify(cart));

function saveCart() {
    localStorage.setItem('egarden_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(el => el.innerText = count);
}

// Rename this so it doesn't conflict with inline onclick="addToCart()" present in old HTML
function addItemToStorage(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    saveCart();
    updateCartCount();
}

// Dummy function to swallow old inline onclick="addToCart(...)" calls from HTML
window.addToCart = function() {
    // Intentionally left blank to prevent double-adding
};

// Listen for clicks on "Add to Cart" or "Add to card" buttons
document.addEventListener('click', function(e) {
    const targetText = (e.target.innerText || '').toLowerCase().trim();
    
    // Check if the clicked element is an add to cart button
    if (e.target.classList.contains('add-cart') || targetText === 'add to card' || targetText === 'add to cart') {
        e.preventDefault();
        
        let name, priceText, img;
        const card = e.target.closest('.card');
        const product = e.target.closest('.product'); // Detail page
        const box = e.target.closest('.box'); // e.g. fruits.html, seeds.html
        
        if (card && card.querySelector('.title')) {
            name = card.querySelector('.title').innerText.trim();
            const priceEl = card.querySelector('.price');
            priceText = priceEl ? (priceEl.innerText.split('₹')[1] || priceEl.innerText) : '';
            img = card.querySelector('img') ? card.querySelector('img').src : '';
        } else if (product && product.querySelector('h1')) {
            name = product.querySelector('h1').innerText.trim();
            const priceEl = product.querySelector('.price');
            priceText = priceEl ? (priceEl.innerText.split('₹')[1] || priceEl.innerText) : '';
            img = product.querySelector('.images img') ? product.querySelector('.images img').src : '';
        } else if (box && box.querySelector('p')) {
            name = box.querySelector('p').innerText.trim();
            const priceEl = box.querySelector('h4');
            priceText = priceEl ? (priceEl.innerText.split('₹')[1] || priceEl.innerText) : '';
            img = box.querySelector('img') ? box.querySelector('img').src : '';
        }
        
        if (name && priceText && img) {
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));
            addItemToStorage(name, name, price, img); // Using name as unique ID for simplicity
        } else {
            console.error("Could not find product details", {name, priceText, img, boxFound: !!box, cardFound: !!card, productFound: !!product});
        }
    }
});

// Initialize cart count on page load and handle icon visibility
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Hide cart icon on non-shopping pages (pages without add to cart buttons)
    const hasAddButton = Array.from(document.querySelectorAll('button, a, .btn, .add-cart')).some(el => {
        const text = (el.innerText || '').toLowerCase().trim();
        return el.classList.contains('add-cart') || text === 'add to card' || text === 'add to cart';
    });
    const isCartPage = window.location.pathname.includes('cart.html');
    const cartLinks = document.querySelectorAll('.cart-link');
    
    if (!hasAddButton && !isCartPage) {
        cartLinks.forEach(link => link.style.display = 'none');
    }
});

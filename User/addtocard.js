// Shopping Cart System with Product Details
let cartItems = [];
let cartCount = 0;

// Add to cart with product details
function addToCart(productName, productPrice, productImage, productQuantity = 1) {
    const product = {
        id: Date.now(),
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: productQuantity || 1,
        totalPrice: (productPrice * (productQuantity || 1))
    };

    // Check if product already exists in cart
    const existingProduct = cartItems.find(item => item.name === productName);
    
    if (existingProduct) {
        existingProduct.quantity += product.quantity;
        existingProduct.totalPrice = existingProduct.price * existingProduct.quantity;
    } else {
        cartItems.push(product);
    }

    cartCount++;
    updateCartUI();
    showCartMessage(productName);
    console.log("Product added:", product);
}

// Show confirmation message
function showCartMessage(productName) {
    const messageDiv = document.getElementById("message");
    if (messageDiv) {
        messageDiv.innerText = `✅ "${productName}" added to cart! Total items: ${cartCount}`;
        setTimeout(() => {
            messageDiv.innerText = "";
        }, 3000);
    }
}

// Update Cart UI
function updateCartUI() {
    const cartCounter = document.getElementById("cart-count");
    if (cartCounter) {
        cartCounter.innerText = cartCount;
    }
    
    displayCartItems();
}

// Display Cart Items with Details
function displayCartItems() {
    const cartList = document.getElementById("cart-list");
    
    if (!cartList) return;

    if (cartItems.length === 0) {
        cartList.innerHTML = "<p style='text-align: center; color: #666;'>Your cart is empty</p>";
        return;
    }

    let cartHTML = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: #2e7d32; color: white;">
                    <th style="padding: 10px; text-align: left;">Product</th>
                    <th style="padding: 10px; text-align: center;">Price</th>
                    <th style="padding: 10px; text-align: center;">Qty</th>
                    <th style="padding: 10px; text-align: center;">Total</th>
                    <th style="padding: 10px; text-align: center;">Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    let grandTotal = 0;

    cartItems.forEach((item, index) => {
        grandTotal += item.totalPrice;
        cartHTML += `
            <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px;">
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <img src="${item.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" alt="${item.name}">
                        <span>${item.name}</span>
                    </div>
                </td>
                <td style="padding: 10px; text-align: center;">₹${item.price}</td>
                <td style="padding: 10px; text-align: center;">
                    <button onclick="updateQuantity(${index}, -1)" style="width: 25px; cursor: pointer;">-</button>
                    <span style="margin: 0 8px;">${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)" style="width: 25px; cursor: pointer;">+</button>
                </td>
                <td style="padding: 10px; text-align: center; font-weight: bold;">₹${item.totalPrice}</td>
                <td style="padding: 10px; text-align: center;">
                    <button onclick="removeFromCart(${index})" style="background: #d32f2f; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Remove</button>
                </td>
            </tr>
        `;
    });

    cartHTML += `
            </tbody>
        </table>
        <div style="text-align: right; margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px;">
            <h3 style="color: #2e7d32;">Grand Total: ₹${grandTotal}</h3>
            <button onclick="checkout()" style="background: #2e7d32; color: white; padding: 12px 30px; font-size: 16px; border: none; border-radius: 6px; cursor: pointer; margin-top: 10px;">Checkout</button>
            <button onclick="clearCart()" style="background: #ff6f00; color: white; padding: 12px 30px; font-size: 16px; border: none; border-radius: 6px; cursor: pointer; margin-top: 10px; margin-left: 10px;">Clear Cart</button>
        </div>
    `;

    cartList.innerHTML = cartHTML;
}

// Update Product Quantity
function updateQuantity(index, change) {
    if (cartItems[index]) {
        cartItems[index].quantity += change;
        
        if (cartItems[index].quantity <= 0) {
            removeFromCart(index);
        } else {
            cartItems[index].totalPrice = cartItems[index].price * cartItems[index].quantity;
            updateCartUI();
        }
    }
}

// Remove Item from Cart
function removeFromCart(index) {
    if (cartItems[index]) {
        const removedItem = cartItems[index];
        cartItems.splice(index, 1);
        cartCount--;
        updateCartUI();
        
        const messageDiv = document.getElementById("message");
        if (messageDiv) {
            messageDiv.innerText = `"${removedItem.name}" removed from cart`;
            setTimeout(() => {
                messageDiv.innerText = "";
            }, 2000);
        }
    }
}

// Clear Cart
function clearCart() {
    if (confirm("Are you sure you want to clear the entire cart?")) {
        cartItems = [];
        cartCount = 0;
        updateCartUI();
        
        const messageDiv = document.getElementById("message");
        if (messageDiv) {
            messageDiv.innerText = "Cart cleared!";
        }
    }
}

// Checkout
function checkout() {
    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const cartData = JSON.stringify(cartItems);
    localStorage.setItem("cartData", cartData);
    
    alert(`Order confirmed! ${cartCount} items added to your cart.\nProceeding to checkout...`);
    // Redirect to checkout page
    // window.location.href = "./checkout.html";
}

// Load cart from localStorage on page load
function loadCart() {
    const savedCart = localStorage.getItem("cartData");
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        updateCartUI();
    }
}

// Initialize cart on page load
window.addEventListener("load", function() {
    loadCart();
});

// Export cart data (for API calls)
function getCartData() {
    return {
        items: cartItems,
        totalItems: cartCount,
        grandTotal: cartItems.reduce((sum, item) => sum + item.totalPrice, 0)
    };
}
// Sample products
const products = [
    { id: 1, name: "Apple", price: 2 },
    { id: 2, name: "Banana", price: 1 },
    { id: 3, name: "Orange", price: 3 }
];

// Render products
const productsContainer = document.getElementById("products");

products.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
        <h3>${product.name}</h3>
        <p>Price: $${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productsContainer.appendChild(div);
});

let cart = [];

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
}

// Decrease quantity by 1
function decreaseQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity -= 1;
        if (cartItem.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
    }
    updateCart();
}

// Remove product from cart completely
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update cart UI and totals
function updateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = "";

    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        const li = document.createElement("li");
        li.innerHTML = `
            ${item.name} - $${item.price} x ${item.quantity}
            <button onclick="decreaseQuantity(${item.id})">-</button>
            <button onclick="addToCart(${item.id})">+</button>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsContainer.appendChild(li);
    });

    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("tax").textContent = tax.toFixed(2);
    document.getElementById("total").textContent = total.toFixed(2);

    saveCartToLocalStorage();
}

// Clear cart button
document.getElementById("clear-cart").addEventListener("click", () => {
    cart = [];
    updateCart();
});

// Save cart
function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Load cart
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Load cart on page load
window.onload = loadCartFromLocalStorage;
// Sample product data stored in JavaScript array (No Database Required)
const products = [
    {
        id: 1,
        name: "Premium Oil Filter",
        brand: "Bosch",
        category: "engine",
        price: 12.99,
        compatibility: "Universal",
        description: "High-quality oil filter for optimal engine protection.",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Ceramic Brake Pads",
        brand: "Akebono",
        category: "brakes",
        price: 89.99,
        compatibility: "Sedan",
        description: "Ceramic brake pads for superior stopping power.",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1600706432523-988185b0e012?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "LED Headlight Bulbs Pair",
        brand: "Philips",
        category: "lighting",
        price: 45.50,
        compatibility: "SUV",
        description: "Bright white LED headlight conversion kit.",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "All-Weather Floor Mats",
        brand: "WeatherTech",
        category: "accessories",
        price: 65.00,
        compatibility: "Truck",
        description: "Heavy-duty rubber floor mats for all-season protection.",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "Iridium Spark Plugs (Pack of 4)",
        brand: "NGK",
        category: "engine",
        price: 34.99,
        compatibility: "Sedan",
        description: "Long-lasting spark plugs for smooth engine starts.",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        name: "Car Battery 12V 60Ah",
        brand: "Exide",
        category: "lighting",
        price: 110.00,
        compatibility: "Universal",
        description: "Reliable battery power with high cold cranking amps.",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1597778602022-f2d97b8c1493?auto=format&fit=crop&w=500&q=80"
    }
];

// Data storage in localStorage
let cart = JSON.parse(localStorage.getItem('autozone_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('autozone_wishlist')) || [];
let orders = JSON.parse(localStorage.getItem('autozone_orders')) || [];

document.addEventListener("DOMContentLoaded", () => {
    renderProducts(products, "featured-products-grid");
    renderProducts(products, "all-products-grid");
    updateCounts();
});

function showSection(sectionId) {
    document.querySelectorAll(".page-section").forEach(sec => sec.classList.add("hidden"));
    document.querySelectorAll(".nav-links a").forEach(btn => btn.classList.remove("active"));
    
    document.getElementById(`${sectionId}-section`).classList.remove("hidden");
    const activeBtn = document.getElementById(`btn-${sectionId}`);
    if (activeBtn) activeBtn.classList.add("active");

    if (sectionId === 'cart') renderCart();
    if (sectionId === 'wishlist') renderWishlist();
    if (sectionId === 'account') renderAccount();
}

function renderProducts(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = items.map(p => `
        <div class="product-card">
            <img src="${p.image}" alt="${p.name}" class="product-img">
            <h3 class="product-title">${p.name}</h3>
            <p><small>Brand: ${p.brand} | Vehicle: ${p.compatibility}</small></p>
            <p class="product-price">$${p.price.toFixed(2)}</p>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="addToCart(${p.id})"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
                <button class="btn" style="background:#eee;" onclick="addToWishlist(${p.id})"><i class="fa-solid fa-heart"></i></button>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const item = cart.find(c => c.id === productId);
    if (item) {
        item.quantity++;
    } else {
        const prod = products.find(p => p.id === productId);
        cart.push({...prod, quantity: 1});
    }
    saveCart();
    alert("Product added to cart!");
}

function saveCart() {
    localStorage.setItem('autozone_cart', JSON.stringify(cart));
    updateCounts();
}

function addToWishlist(productId) {
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('autozone_wishlist', JSON.stringify(wishlist));
        updateCounts();
        alert("Product added to wishlist!");
    } else {
        alert("Product is already in wishlist!");
    }
}

function updateCounts() {
    document.getElementById("cart-count").innerText = cart.reduce((tot, item) => tot + item.quantity, 0);
    document.getElementById("wishlist-count").innerText = wishlist.length;
}

function renderCart() {
    const container = document.getElementById("cart-items-container");
    const summaryContainer = document.getElementById("cart-summary");

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        summaryContainer.innerHTML = "";
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="product-card" style="margin-bottom:10px; flex-direction:row; align-items:center; justify-content:space-between;">
            <div>
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div>
                <button class="btn" onclick="adjustQty(${item.id}, 1)">+</button>
                <button class="btn" onclick="adjustQty(${item.id}, -1)">-</button>
                <button class="btn" style="background:var(--accent-color); color:white;" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    summaryContainer.innerHTML = `
        <h3>Total Price: $${total.toFixed(2)}</h3>
        <button class="btn btn-primary" style="width:100%; margin-top:10px;" onclick="showSection('checkout')">Proceed to Checkout</button>
    `;
}

function adjustQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) cart = cart.filter(c => c.id !== id);
        saveCart();
        renderCart();
    }
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    saveCart();
    renderCart();
}

function renderWishlist() {
    const wishlistProducts = products.filter(p => wishlist.includes(p.id));
    renderProducts(wishlistProducts, "wishlist-grid");
}

function handleCheckout(e) {
    e.preventDefault();
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    orders.push({
        id: Date.now(),
        items: [...cart],
        date: new Date().toLocaleDateString()
    });
    localStorage.setItem('autozone_orders', JSON.stringify(orders));
    cart = [];
    saveCart();
    alert("Order placed successfully!");
    showSection('account');
}

function renderAccount() {
    const history = document.getElementById("order-history");
    if (orders.length === 0) {
        history.innerHTML = "<p>No past orders recorded yet.</p>";
        return;
    }
    history.innerHTML = orders.map(o => `
        <div style="background:white; padding:15px; margin-top:10px; border-radius:5px;">
            <p><strong>Order ID:</strong> #${o.id}</p>
            <p><strong>Date:</strong> ${o.date}</p>
            <p><strong>Items:</strong> ${o.items.map(i => `${i.name} (${i.quantity})`).join(', ')}</p>
        </div>
    `).join('');
}

function applyFilters() {
    const cat = document.getElementById("categoryFilter").value;
    const veh = document.getElementById("vehicleFilter").value;

    let filtered = products.filter(p => {
        const matchesCat = (cat === 'all' || p.category === cat);
        const matchesVeh = (veh === 'all' || p.compatibility === veh || p.compatibility === 'Universal');
        return matchesCat && matchesVeh;
    });

    renderProducts(filtered, "all-products-grid");
}

function filterByCategory(catName) {
    showSection('products');
    document.getElementById("categoryFilter").value = catName;
    applyFilters();
}

function handleSearch() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    showSection('products');
    const filtered = products.filter(p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    renderProducts(filtered, "all-products-grid");
}
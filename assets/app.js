// ============================================
// MEDICINE APP - MAIN APPLICATION LOGIC
// ============================================

let medicinesData = [];

// ============================================
// STORAGE MANAGEMENT
// ============================================

const appStore = {
    // Load medicines from JSON
    async loadMedicines() {
        try {
            const response = await fetch('data/medicines.json');
            medicinesData = await response.json();
            console.log(`✅ Loaded ${medicinesData.length} medicines`);
        } catch (error) {
            console.error('❌ Failed to load medicines:', error);
            medicinesData = [];
        }
    },

    // Get cart from localStorage
    getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    },

    // Save cart to localStorage
    saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    },

    // Add item to cart
    addToCart(medicineId, qty = 1) {
        const medicine = medicinesData.find(m => m.id === medicineId);
        if (!medicine) return;

        let cart = this.getCart();
        const existingItem = cart.find(item => item.id === medicineId);

        if (existingItem) {
            existingItem.qty += qty;
        } else {
            cart.push({
                id: medicine.id,
                name: medicine.name,
                dosage: medicine.dosage,
                price: medicine.price,
                qty: qty
            });
        }

        this.saveCart(cart);
        appUI.updateCartCount();
        console.log(`✅ Added ${qty}x ${medicine.name} to cart`);
    },

    // Remove from cart
    removeFromCart(medicineId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== medicineId);
        this.saveCart(cart);
        appUI.updateCartCount();
        appUI.renderCart();
    },

    // Update cart item quantity
    updateCartQty(medicineId, qty) {
        let cart = this.getCart();
        const item = cart.find(i => i.id === medicineId);
        if (item) {
            item.qty = qty;
            if (item.qty <= 0) {
                this.removeFromCart(medicineId);
            } else {
                this.saveCart(cart);
            }
        }
        appUI.updateCartCount();
        appUI.renderCart();
    },

    // Get all orders
    getOrders() {
        const orders = localStorage.getItem('orders');
        return orders ? JSON.parse(orders) : [];
    },

    // Save orders
    saveOrders(orders) {
        localStorage.setItem('orders', JSON.stringify(orders));
    },

    // Place order (from checkout)
    placeOrder(event) {
        event.preventDefault();

        const cart = this.getCart();
        if (cart.length === 0) {
            alert('❌ Cart is empty!');
            return;
        }

        // Get form data
        const guestUser = {
            name: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            street: document.getElementById('street').value,
            city: document.getElementById('city').value,
            pincode: document.getElementById('pincode').value
        };

        // Validate fields
        if (!guestUser.name || !guestUser.email || !guestUser.phone || !guestUser.street || !guestUser.city || !guestUser.pincode) {
            alert('❌ Please fill all fields');
            return;
        }

        // Save guest user
        localStorage.setItem('guestUser', JSON.stringify(guestUser));

        // Calculate total
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const tax = Math.round(subtotal * 0.05);
        const total = subtotal + tax;

        // Create order
        const orderId = `ORD-${new Date().toISOString().split('T')[0]}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const order = {
            id: orderId,
            date: new Date().toISOString(),
            items: cart,
            subtotal: subtotal,
            tax: tax,
            total: total,
            status: 'pending',
            address: guestUser,
            deliveryEta: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
        };

        // Save order
        let orders = this.getOrders();
        orders.unshift(order);
        this.saveOrders(orders);

        // Clear cart
        localStorage.removeItem('cart');
        appUI.updateCartCount();

        // Show confirmation
        appUI.showConfirmation(order);
        appRouter.goToConfirmation();
    },

    // Get guest user info
    getGuestUser() {
        const user = localStorage.getItem('guestUser');
        return user ? JSON.parse(user) : null;
    }
};

// ============================================
// UI MANAGEMENT
// ============================================

const appUI = {
    // Update cart count in navbar
    updateCartCount() {
        const cart = appStore.getCart();
        document.querySelector('.cart-count').textContent = cart.length;
    },

    // Update recent orders display
    updateRecentOrders() {
        const orders = appStore.getOrders();
        const recentOrdersDiv = document.getElementById('recentOrders');
        
        if (orders.length === 0) {
            recentOrdersDiv.innerHTML = '<p class="placeholder-text">No recent orders</p>';
            return;
        }

        const recentOrder = orders[0];
        recentOrdersDiv.innerHTML = `
            <div style="padding: 8px; background: white; border-radius: 8px; border: 1px solid #D9E7E2;">
                <p style="font-size: 0.8em; color: #5E6E69;">Order ID: ${recentOrder.id}</p>
                <p style="margin: 4px 0; font-weight: 600;">${recentOrder.items.length} items</p>
                <p style="font-size: 0.9em; color: #0F766E;">₹${recentOrder.total}</p>
            </div>
        `;
    },

    // Show a transient toast message
    showToast(message = 'Added to cart') {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast hidden';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.remove('hidden');
        toast.style.opacity = '1';
        setTimeout(() => {
            toast.classList.add('hidden');
            toast.style.opacity = '';
        }, 1800);
    },

    // Handle add-to-cart from grid buttons with button feedback
    handleAddToCart(button, medicineId) {
        try {
            if (button) {
                const orig = button.textContent;
                button.disabled = true;
                button.textContent = 'Added';
                setTimeout(() => { button.disabled = false; button.textContent = orig; }, 1200);
            }
        } catch (e) { /* ignore */ }
        appStore.addToCart(medicineId, 1);
        this.showToast('Added to cart');
    },

    // Handle add-to-cart from detail page (uses qty input)
    handleDetailAdd(button, medicineId) {
        const qtyInput = document.getElementById('medicineQty');
        const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
        if (button) {
            const orig = button.textContent;
            button.disabled = true;
            button.textContent = 'Added';
            setTimeout(() => { button.disabled = false; button.textContent = orig; }, 1200);
        }
        appStore.addToCart(medicineId, qty);
        this.showToast('Added to cart');
    },

    // Populate category filter
    populateCategoryFilter() {
        const categories = [...new Set(medicinesData.map(m => m.category))];
        const categoryFilter = document.getElementById('categoryFilter');
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categoryFilter.appendChild(option);
        });
    },

    // Render medicines grid
    renderMedicines(medicines = medicinesData) {
        const grid = document.getElementById('medicinesGrid');
        grid.innerHTML = '';

        medicines.forEach(medicine => {
            const card = document.createElement('div');
            card.className = 'medicine-card';
            card.onclick = () => appRouter.goToMedicineDetail(medicine.id);

            const stockBadge = medicine.stock > 10 
                ? `<span class="medicine-stock">${medicine.stock} in stock</span>`
                : `<span class="medicine-stock low">Low stock</span>`;

            card.innerHTML = `
                <div class="medicine-image">💊</div>
                <h3 class="medicine-name">${medicine.name}</h3>
                <p class="medicine-dosage">${medicine.dosage}</p>
                <p class="medicine-price">₹${medicine.price}</p>
                ${stockBadge}
                <button class="btn-add-cart" onclick="event.stopPropagation(); appUI.handleAddToCart(this, ${medicine.id})">Add to Cart</button>
            `;
            grid.appendChild(card);
        });
    },

    // Render featured medicines (top 6 by stock)
    renderFeaturedMedicines() {
        const container = document.getElementById('featuredGrid');
        if (!container) return;
        const featured = medicinesData.slice().sort((a,b) => (b.stock||0) - (a.stock||0)).slice(0,6);
        container.innerHTML = '';
        featured.forEach(medicine => {
            const card = document.createElement('div');
            card.className = 'medicine-card';
            card.onclick = () => appRouter.goToMedicineDetail(medicine.id);
            const stockBadge = medicine.stock > 10 
                ? `<span class="medicine-stock">${medicine.stock} in stock</span>`
                : `<span class="medicine-stock low">Low stock</span>`;

            card.innerHTML = `
                <div class="medicine-image">💊</div>
                <h3 class="medicine-name">${medicine.name}</h3>
                <p class="medicine-dosage">${medicine.dosage}</p>
                <p class="medicine-price">₹${medicine.price}</p>
                ${stockBadge}
                <button class="btn-add-cart" onclick="event.stopPropagation(); appUI.handleAddToCart(this, ${medicine.id})">Add to Cart</button>
            `;
            container.appendChild(card);
        });
    },

    // Lazy-load Streamlit dashboard iframe or show instructions
    loadStreamlitDashboard() {
        if (window._streamlitLoaded) return;
        const iframe = document.getElementById('streamlitFrame');
        if (!iframe) return;
        // If a global URL is provided, use it. Otherwise show a placeholder message.
        if (window.STREAMLIT_URL && typeof window.STREAMLIT_URL === 'string' && window.STREAMLIT_URL.length > 5) {
            iframe.src = window.STREAMLIT_URL;
        } else {
            const parent = iframe.parentElement;
            parent.innerHTML = '<div class="placeholder-text">Dashboard not configured. Host the Streamlit app separately and set <strong>window.STREAMLIT_URL</strong> to the public URL to embed it here.</div>';
        }
        window._streamlitLoaded = true;
    },

    // Render medicine detail page
    renderMedicineDetail(medicineId) {
        const medicine = medicinesData.find(m => m.id === medicineId);
        if (!medicine) return;

        const container = document.getElementById('medicineDetailContainer');
        container.innerHTML = `
            <div class="medicine-detail-image">💊</div>
            <div class="medicine-detail-info">
                <h2>${medicine.name}</h2>
                <p class="medicine-detail-meta">
                    <strong>Dosage:</strong> ${medicine.dosage}<br>
                    <strong>Manufacturer:</strong> ${medicine.manufacturer}<br>
                    <strong>Category:</strong> ${medicine.category}
                </p>
                <p class="medicine-detail-price">₹${medicine.price}</p>

                <div class="medicine-detail-qty">
                    <button class="qty-btn" onclick="this.nextElementSibling.value = Math.max(1, parseInt(this.nextElementSibling.value) - 1)">−</button>
                    <input type="number" min="1" value="1" class="qty-input" id="medicineQty">
                    <button class="qty-btn" onclick="this.previousElementSibling.value = parseInt(this.previousElementSibling.value) + 1">+</button>
                </div>

                <button class="btn-detail-add" onclick="appUI.handleDetailAdd(this, ${medicine.id})">
                    Add to Cart
                </button>

                <div class="info-tabs">
                    <div class="tab-buttons">
                        <button class="tab-button active" onclick="appUI.switchTab(this, 'usage')">Usage</button>
                        <button class="tab-button" onclick="appUI.switchTab(this, 'side-effects')">Side Effects</button>
                        <button class="tab-button" onclick="appUI.switchTab(this, 'warnings')">Warnings</button>
                    </div>

                    <div class="tab-content active" id="tab-usage">
                        <p>${medicine.usage}</p>
                        <p><strong>Dosage:</strong> ${medicine.dosageRecommendations}</p>
                    </div>

                    <div class="tab-content" id="tab-side-effects">
                        <p>${medicine.sideEffects}</p>
                        <p><strong>Contraindications:</strong> ${medicine.contraindications}</p>
                    </div>

                    <div class="tab-content" id="tab-warnings">
                        <div class="warning-box">
                            <strong>⚠️ Warning:</strong><br>
                            ${medicine.warnings}
                        </div>
                        <p><strong>Hindi Name:</strong> ${medicine.hindiName}</p>
                        <p><strong>Official Resources:</strong></p>
                        <ul>
                            ${medicine.indianLinks.map(link => `<li><a href="${link.url}" target="_blank">${link.title}</a></li>`).join('')}
                        </ul>
                        <p><strong>⚕️ Always consult a pharmacist before use.</strong></p>
                    </div>
                </div>
            </div>
        `;
    },

    // Tab switching
    switchTab(button, tabName) {
        // Remove active from all tabs
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

        // Add active to clicked tab
        button.classList.add('active');
        document.getElementById(`tab-${tabName}`).classList.add('active');
    },

    // Render cart page
    renderCart() {
        const cart = appStore.getCart();
        const cartItemsDiv = document.getElementById('cartItems');
        const cartSummaryDiv = document.getElementById('cartSummary');

        if (cart.length === 0) {
            cartItemsDiv.innerHTML = '<p class="empty-cart">Your cart is empty. <a href="#search">Shop now</a></p>';
            cartSummaryDiv.style.display = 'none';
            return;
        }

        let html = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;

            html += `
                <div class="cart-item">
                    <div class="cart-item-image">💊</div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>${item.dosage}</p>
                        <p style="font-weight: 600; color: #0F766E;">₹${item.price}</p>
                    </div>
                    <div class="cart-item-qty">
                        <button onclick="appStore.updateCartQty(${item.id}, ${item.qty - 1})">−</button>
                        <input type="number" value="${item.qty}" readonly>
                        <button onclick="appStore.updateCartQty(${item.id}, ${item.qty + 1})">+</button>
                    </div>
                    <button class="cart-item-remove" onclick="appStore.removeFromCart(${item.id})">🗑️</button>
                </div>
            `;
        });

        cartItemsDiv.innerHTML = html;

        const tax = Math.round(subtotal * 0.05);
        const total = subtotal + tax;

        document.getElementById('subtotal').textContent = `₹${subtotal}`;
        document.getElementById('tax').textContent = `₹${tax}`;
        document.getElementById('total').textContent = `₹${total}`;

        cartSummaryDiv.style.display = 'block';
    },

    // Render checkout summary
    renderCheckoutSummary() {
        const cart = appStore.getCart();
        const container = document.getElementById('checkoutSummary');

        let html = '<ul style="list-style: none;">';
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.qty;
            subtotal += itemTotal;
            html += `
                <li style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #D9E7E2;">
                    <span>${item.qty}x ${item.name} (${item.dosage})</span>
                    <span>₹${itemTotal}</span>
                </li>
            `;
        });

        const tax = Math.round(subtotal * 0.05);
        const total = subtotal + tax;

        html += `
            <li style="display: flex; justify-content: space-between; padding: 8px 0; font-weight: 600; border-bottom: 1px solid #D9E7E2;">
                <span>Subtotal</span>
                <span>₹${subtotal}</span>
            </li>
            <li style="display: flex; justify-content: space-between; padding: 8px 0; font-weight: 600; border-bottom: 1px solid #D9E7E2;">
                <span>Tax (5%)</span>
                <span>₹${tax}</span>
            </li>
            <li style="display: flex; justify-content: space-between; padding: 12px 0; font-weight: 700; font-size: 1.2em; color: #0F766E;">
                <span>Total</span>
                <span>₹${total}</span>
            </li>
        `;

        html += '</ul>';
        container.innerHTML = html;
    },

    // Render order history
    renderOrders() {
        const orders = appStore.getOrders();
        const container = document.getElementById('ordersContainer');

        if (orders.length === 0) {
            container.innerHTML = '<p class="placeholder-text">No orders yet. <a href="#search">Shop now</a></p>';
            return;
        }

        let html = '';
        orders.forEach(order => {
            const statusClass = `status-${order.status}`;
            const deliveryDate = new Date(order.deliveryEta).toLocaleDateString();

            html += `
                <div class="order-card" onclick="appRouter.goToOrderTracking('${order.id}')">
                    <div class="order-header">
                        <span class="order-id">${order.id}</span>
                        <span class="order-status ${statusClass}">${order.status.toUpperCase()}</span>
                    </div>
                    <p class="order-date">${new Date(order.date).toLocaleDateString()}</p>
                    <div class="order-items-preview">
                        <p>${order.items.length} item(s) - ${order.items.map(i => i.name).join(', ')}</p>
                    </div>
                    <p class="order-total">Total: ₹${order.total}</p>
                    <p style="font-size: 0.85em; color: #5E6E69; margin-top: 8px;">Est. Delivery: ${deliveryDate}</p>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    // Render order tracking detail
    renderOrderTracking(orderId) {
        const orders = appStore.getOrders();
        const order = orders.find(o => o.id === orderId);

        if (!order) {
            document.getElementById('trackingContainer').innerHTML = '<p>Order not found</p>';
            return;
        }

        const statuses = ['pending', 'processing', 'packed', 'shipped', 'delivered'];
        const currentStatusIndex = statuses.indexOf(order.status);

        let trackingHTML = `
            <div class="tracking-header">
                <h2>Order Tracking</h2>
                <p style="color: #5E6E69;">Order ID: ${order.id}</p>
            </div>

            <div class="tracking-timeline">
        `;

        statuses.forEach((status, index) => {
            const isActive = index <= currentStatusIndex;
            const activeClass = isActive ? 'active' : 'pending';
            const emoji = {
                pending: '⏱️',
                processing: '⚙️',
                packed: '📦',
                shipped: '🚚',
                delivered: '✓'
            }[status];

            trackingHTML += `
                <div class="tracking-step ${activeClass}">
                    <div class="tracking-dot">${emoji}</div>
                    <div class="tracking-step-content">
                        <h4 style="text-transform: capitalize;">${status}</h4>
                        <p>${this.getStatusMessage(status)}</p>
                    </div>
                </div>
            `;
        });

        trackingHTML += '</div>';

        const deliveryDate = new Date(order.deliveryEta).toLocaleDateString();
        trackingHTML += `
            <div style="background: #ECFDF5; border: 1px solid #D1FAE5; border-radius: 12px; padding: 16px; margin-top: 24px;">
                <p><strong>Estimated Delivery:</strong> ${deliveryDate}</p>
                <p style="font-size: 0.9em; color: #5E6E69; margin-top: 8px;">Delivery to: ${order.address.street}, ${order.address.city} ${order.address.pincode}</p>
            </div>
        `;

        document.getElementById('trackingContainer').innerHTML = trackingHTML;
    },

    // Get status message
    getStatusMessage(status) {
        const messages = {
            pending: 'Your order has been received',
            processing: 'We\'re preparing your medicines',
            packed: 'Your order is packed and ready',
            shipped: 'Your order is on its way',
            delivered: 'Your order has been delivered'
        };
        return messages[status] || '';
    },

    // Show confirmation
    showConfirmation(order) {
        document.getElementById('confirmationMessage').innerHTML = `
            Order ID: <strong>${order.id}</strong><br>
            Total Amount: <strong>₹${order.total}</strong>
        `;

        let itemsHTML = '<strong>Items:</strong><ul style="margin: 8px 0;">';
        order.items.forEach(item => {
            itemsHTML += `<li>${item.qty}x ${item.name} (${item.dosage}) - ₹${item.price * item.qty}</li>`;
        });
        itemsHTML += '</ul>';

        const detailsDiv = document.getElementById('confirmationDetails');
        detailsDiv.innerHTML = itemsHTML + `
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #D9E7E2;">
                <p><strong>Delivery Address:</strong></p>
                <p>${order.address.name}<br>${order.address.street}<br>${order.address.city} ${order.address.pincode}</p>
            </div>
        `;
    }
};

// ============================================
// PAGE ROUTER (HASH-BASED)
// ============================================

const appRouter = {
    init() {
        window.addEventListener('hashchange', () => this.route());
        this.route();
    },

    route() {
        const hash = window.location.hash.slice(1) || 'home';
        console.log(`🔀 Routing to: ${hash}`);

        // Hide all pages
        document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));

        // Parse hash (e.g., "medicine/5" or "order-tracking/ORD-123")
        const [page, param] = hash.split('/');

        switch (page) {
            case 'home':
                document.getElementById('home').classList.remove('hidden');
                // Render featured medicines on home
                try { appUI.renderFeaturedMedicines(); } catch (e) { /* ignore */ }
                break;
            case 'search':
                document.getElementById('search').classList.remove('hidden');
                appUI.renderMedicines();
                break;
            case 'medicine':
                document.getElementById('medicine-detail').classList.remove('hidden');
                appUI.renderMedicineDetail(parseInt(param));
                break;
            case 'cart':
                document.getElementById('cart').classList.remove('hidden');
                appUI.renderCart();
                break;
            case 'checkout':
                document.getElementById('checkout').classList.remove('hidden');
                appUI.renderCheckoutSummary();
                break;
            case 'confirmation':
                document.getElementById('confirmation').classList.remove('hidden');
                break;
            case 'orders':
                document.getElementById('orders').classList.remove('hidden');
                appUI.renderOrders();
                appUI.updateRecentOrders();
                break;
            case 'order-tracking':
                document.getElementById('order-tracking').classList.remove('hidden');
                appUI.renderOrderTracking(param);
                break;
            case 'dashboard':
                document.getElementById('dashboard').classList.remove('hidden');
                appUI.loadStreamlitDashboard();
                break;
            default:
                window.location.hash = '#home';
        }

        // Scroll to top
        window.scrollTo(0, 0);
    },

    goToHome() { window.location.hash = '#home'; },
    goToSearch(event) { if (event) event.preventDefault(); window.location.hash = '#search'; },
    goToMedicineDetail(id) { window.location.hash = `#medicine/${id}`; },
    goToCart() { window.location.hash = '#cart'; },
    goToCheckout() { window.location.hash = '#checkout'; },
    goToConfirmation() { window.location.hash = '#confirmation'; },
    goToOrders() { window.location.hash = '#orders'; },
    goToOrderTracking(orderId) { window.location.hash = `#order-tracking/${orderId}`; }
};

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Home search
    const homeSearch = document.getElementById('homeSearch');
    if (homeSearch) {
        homeSearch.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = e.target.value.toLowerCase();
                applySearch(searchTerm);
                appRouter.goToSearch();
            }
        });
    }

    // Category chips
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const category = chip.dataset.category;
            const filtered = medicinesData.filter(m => m.category === category);
            appUI.renderMedicines(filtered);
        });
    });

    // Search page search bar
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const term = e.target.value.toLowerCase();
            applySearch(term);
        });
    }

    // Search page filters
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }

    if (priceFilter) {
        priceFilter.addEventListener('input', (e) => {
            document.getElementById('priceDisplay').textContent = `₹0 - ₹${e.target.value}`;
            applyFilters();
        });
    }
}

function applySearch(term) {
    const filtered = medicinesData.filter(m =>
        m.name.toLowerCase().includes(term) ||
        m.dosage.toLowerCase().includes(term) ||
        m.category.toLowerCase().includes(term)
    );
    appUI.renderMedicines(filtered);
}

function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const maxPrice = parseInt(document.getElementById('priceFilter').value);
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    let filtered = medicinesData.filter(m => {
        const matchCategory = !category || m.category === category;
        const matchPrice = m.price <= maxPrice;
        const matchSearch = !searchTerm || m.name.toLowerCase().includes(searchTerm);
        return matchCategory && matchPrice && matchSearch;
    });

    appUI.renderMedicines(filtered);
}

console.log('🎯 App JS Loaded!');

// ============================================
// INITIALIZE APP ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🏥 MediCare App Starting...');
    
    // Load medicines data
    await appStore.loadMedicines();
    
    // Initialize router
    appRouter.init();
    
    // Update UI
    appUI.updateCartCount();
    appUI.updateRecentOrders();
    appUI.populateCategoryFilter();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('✅ App Ready!');
});

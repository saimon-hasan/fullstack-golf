// --- CONFIGURATION ---
const API_URL = '/api/items';
const main = document.querySelector('main');
const toast = document.querySelector('#toast');

// State management
let state = {
    products: [],
    view: 'home'
};

// --- DATABASE HELPERS (The "HOTEL" CRUD) ---

// READ: Get all products from MongoDB
async function fetchProducts() {
    try {
        const res = await fetch(API_URL);
        state.products = await res.json();
        route(); // Refresh the screen after loading data
    } catch (e) {
        showToast("Error loading products from database");
    }
}

// CREATE: Add a new product to MongoDB
async function addProduct(product) {
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        await fetchProducts();
    } catch (e) {
        showToast("Failed to add product");
    }
}

// DELETE: Remove a product from MongoDB
async function deleteProduct(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        await fetchProducts();
    } catch (e) {
        showToast("Failed to delete product");
    }
}

// --- UI COMPONENTS ---

function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ADMIN PANEL: This is your evidence for the instructor's grade
function renderAdmin() {
    main.innerHTML = `
        <div style="padding: 40px; font-family: sans-serif; max-width: 800px; margin: 0 auto;">
            <h1 style="border-bottom: 2px solid #000; padding-bottom: 10px;">🛠️ STORE ADMIN PANEL</h1>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #ddd;">
                <h3 style="margin-top:0">Add New Product</h3>
                <div style="display: grid; gap: 10px; max-width: 400px;">
                    <input type="text" id="adm-name" placeholder="Product Name" style="padding: 8px;">
                    <input type="text" id="adm-desc" placeholder="Description" style="padding: 8px;">
                    <input type="text" id="adm-price" placeholder="Price (e.g. $39)" style="padding: 8px;">
                    <button id="adm-save" style="padding: 10px; background: black; color: white; cursor: pointer; border: none;">Save Product</button>
                </div>
            </div>

            <h3 style="margin-bottom: 10px;">Current Inventory (from MongoDB)</h3>
            <div style="display: grid; gap: 10px;">
                ${state.products.length === 0 ? '<p>No products found in database.</p>' : 
                  state.products.map(p => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee; background: white;">
                        <span><strong>${p.name}</strong> - ${p.price || ''}</span>
                        <button onclick="removeProd('${p._id}')" style="background: red; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">Delete</button>
                    </div>
                `).join('')}
            </div>
            <br>
            <a href="#home" style="color: #666; text-decoration: underline; cursor: pointer;">← Back to Store</a>
        </div>
    `;

    document.getElementById('adm-save').onclick = async () => {
        const name = document.getElementById('adm-name').value;
        const description = document.getElementById('adm-desc').value;
        const price = document.getElementById('adm-price').value;
        if (!name) return alert("Product name is required");
        
        await addProduct({ name, description, price });
        renderAdmin(); // Refresh the admin list
    };
}

function renderHome() {
    main.innerHTML = `
        <section style="text-align: center; padding: 100px 20px; font-family: sans-serif;">
            <h2 style="font-size: 3rem; margin-bottom: 20px;">New Season</h2>
            <p style="margin-bottom: 30px;">Welcome to CAAVON. Explore our database-driven collection.</p>
            <a href="#shop/all" style="padding: 15px 30px; background: black; color: white; text-decoration: none; font-weight: bold; border-radius: 4px;">Shop Now</a>
            <div style="margin-top: 50px;">
                <a href="#admin" style="color: #ccc; font-size: 12px; text-decoration: none;">Grading Admin Panel ↗</a>
            </div>
        </section>
    `;
}

function renderShop(category = 'all') {
    const filtered = category === 'all' 
        ? state.products 
        : state.products.filter(p => p.category === category);

    main.innerHTML = `
        <div style="padding: 40px 20px; font-family: sans-serif;">
            <h2 style="text-align: center; margin-bottom: 40px;">${category.toUpperCase()} Collection</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 30px;">
                ${filtered.length === 0 ? '<p style="text-align: center; grid-column: 1/-1;">The shop is empty. Use the Admin panel to add products!</p>' : 
                  filtered.map(p => `
                    <div class="product-card" style="border: 1px solid #eee; padding: 15px; text-align: center; cursor: pointer; background: white;">
                        <img src="${p.image || 'https://via.placeholder.com/300'}" alt="${p.name}" style="width: 100%; height: auto;">
                        <div class="info">
                            <h4 style="margin: 10px 0 5px;">${p.name}</h4>
                            <p style="color: #666;">${p.price || ''}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// --- ROUTER ---

function route() {
    const hash = window.location.hash || '#home';
    if (hash === '#home') renderHome();
    else if (hash === '#admin') renderAdmin();
    else if (hash.startsWith('#shop/')) {
        const cat = hash.split('/')[1];
        renderShop(cat);
    } else {
        renderHome();
    }
}

window.addEventListener('hashchange', route);
window.addEventListener('load', async () => {
    await fetchProducts(); // Get data from MongoDB Atlas before showing the site
    route();
});

// Global helper for the admin delete button
window.removeProd = async (id) => {
    if(confirm("Are you sure you want to delete this product from the database?")) {
        await deleteProduct(id);
        renderAdmin();
    }
};
/* API Client for Static Web - FETCHES menu.json */

export const getMenu = async () => {
    try {
        // Fetch from the static JSON file and append timestamp to avoid cache
        const response = await fetch('./menu.json?t=' + new Date().getTime());
        if (!response.ok) throw new Error('Failed to fetch menu');
        const data = await response.json();

        // Manejar ambos casos: root array "[]" o esquema objeto "{ categories: [] }"
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.categories)) return data.categories;

        console.warn("Invalid data format received from menu.json");
        return [];
    } catch (error) {
        console.error("Error loading menu:", error);
        return [];
    }
};

// --- MOCKED FUNCTIONS (Read-Only Mode) ---

export const createOrder = async (orderData) => {
    console.log("Static Mode: Order creation disabled", orderData);
    return Promise.resolve({ success: true });
};

export const getOrders = async () => Promise.resolve([]);
export const getActiveTakeaways = async () => Promise.resolve([]);
export const updateOrderStatus = async () => Promise.resolve({});
export const createProduct = async () => Promise.resolve({});
export const updateProduct = async () => Promise.resolve({});
export const deleteProduct = async () => Promise.resolve();
export const createCategory = async () => Promise.resolve({});
export const deleteCategory = async () => Promise.resolve();
export const updateCategory = async () => Promise.resolve({});
export const clearKitchen = async () => Promise.resolve();
export const uploadImage = async () => Promise.resolve({});

const api = {
    get: () => Promise.resolve({ data: [] }),
    post: () => Promise.resolve({ data: {} }),
    patch: () => Promise.resolve({ data: {} }),
    delete: () => Promise.resolve({}),
};

export default api;

// API Service for React Frontend
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Get headers for API requests
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Make HTTP request
  async makeRequest(method, endpoint, data = null) {
    const url = `${this.baseURL}${endpoint}`;
    
    const options = {
      method,
      headers: this.getHeaders(),
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    console.log('API Request:', { method, url, data, options });

    try {
      const response = await fetch(url, options);
      console.log('API Response Status:', response.status);
      
      const responseData = await response.json();
      console.log('API Response Data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || `HTTP ${response.status}`);
      }

      return {
        success: true,
        data: responseData,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Authentication methods
  async login(email, password) {
    return this.makeRequest('POST', '/users/login', { email, password });
  }

  async register(userData) {
    return this.makeRequest('POST', '/users/register', userData);
  }

  // Product methods
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest('GET', endpoint);
  }

  async getProduct(id) {
    return this.makeRequest('GET', `/products/${id}`);
  }

  async createProduct(productData) {
    return this.makeRequest('POST', '/products', productData);
  }

  async updateProduct(id, productData) {
    return this.makeRequest('PUT', `/products/${id}`, productData);
  }

  async deleteProduct(id) {
    return this.makeRequest('DELETE', `/products/${id}`);
  }

  async updateStock(id, stock) {
    return this.makeRequest('PATCH', `/products/${id}/stock`, { stock });
  }

  async getLowStockProducts(threshold = 10) {
    return this.makeRequest('GET', `/products/low-stock?threshold=${threshold}`);
  }

  // Category methods
  async getCategories(includeProducts = false) {
    const endpoint = `/categories${includeProducts ? '?include_products=true' : ''}`;
    return this.makeRequest('GET', endpoint);
  }

  async getCategory(id) {
    return this.makeRequest('GET', `/categories/${id}`);
  }

  async createCategory(categoryData) {
    return this.makeRequest('POST', '/categories', categoryData);
  }

  async updateCategory(id, categoryData) {
    return this.makeRequest('PUT', `/categories/${id}`, categoryData);
  }

  async deleteCategory(id) {
    return this.makeRequest('DELETE', `/categories/${id}`);
  }

  // Sales methods
  async getSales(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/sales${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest('GET', endpoint);
  }

  async getSale(id) {
    return this.makeRequest('GET', `/sales/${id}`);
  }

  async createSale(saleData) {
    return this.makeRequest('POST', '/sales', saleData);
  }

  async updateSale(id, saleData) {
    return this.makeRequest('PUT', `/sales/${id}`, saleData);
  }

  async deleteSale(id) {
    return this.makeRequest('DELETE', `/sales/${id}`);
  }

  // Order methods
  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/orders${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest('GET', endpoint);
  }

  async getOrder(id) {
    return this.makeRequest('GET', `/orders/${id}`);
  }

  async createOrder(orderData) {
    return this.makeRequest('POST', '/orders', orderData);
  }

  async updateOrderStatus(id, status) {
    return this.makeRequest('PATCH', `/orders/${id}/status`, { status });
  }

  async deleteOrder(id) {
    return this.makeRequest('DELETE', `/orders/${id}`);
  }

  // Report methods
  async getDashboardSummary() {
    return this.makeRequest('GET', '/reports/dashboard');
  }

  async getSalesReport(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/reports/sales${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest('GET', endpoint);
  }

  async getTopProductsReport(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/reports/top-products${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest('GET', endpoint);
  }

  async getCustomersReport(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/reports/customers${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest('GET', endpoint);
  }

  async getStockReport(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/reports/stock${queryString ? `?${queryString}` : ''}`;
    return this.makeRequest('GET', endpoint);
  }
}

// Export singleton instance
export default new ApiService();

/**
 * Logic Peripherals Australia (LPA) - Main JavaScript
 * ===================================================
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeNavigation();
    initializeCartCounter();
    initializeFormValidation();
    initializeProductCards();
    initializeTooltips();
    initializeFlashMessages();
    initializeSearch();
    initializeQuantityControls();
    
    console.log('LPA E-commerce website initialized successfully');
});

/**
 * Navigation functionality
 */
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggler = document.querySelector('.navbar-toggler');
    const navCollapse = document.querySelector('.navbar-collapse');
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile navigation toggle
    if (navToggler) {
        navToggler.addEventListener('click', function() {
            navCollapse.classList.toggle('show');
        });
    }
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navCollapse.classList.contains('show')) {
            navCollapse.classList.remove('show');
        }
    });
}

/**
 * Cart counter functionality
 */
function initializeCartCounter() {
    console.log('Initializing cart counter...');
    
    // Find all add to cart buttons
    const addToCartButtons = document.querySelectorAll('button[type="submit"]');
    console.log('Found buttons:', addToCartButtons.length);
    
    addToCartButtons.forEach((button, index) => {
        console.log(`Button ${index}:`, button);
        const form = button.closest('form');
        console.log('Form:', form);
        
        if (form && form.action.includes('cart.php')) {
            console.log('Adding event listener to button:', button);
            
            button.addEventListener('click', function(e) {
                console.log('Button clicked!');
                
                // Add loading state
                this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Adding...';
                this.disabled = true;
                
                // Submit the form
                form.submit();
            });
        }
    });
}

/**
 * Form validation
 */
function initializeFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                
                // Focus on first invalid field
                const firstInvalid = form.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
            form.classList.add('was-validated');
        });
    });
    
    // Real-time validation
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.checkValidity()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('was-validated')) {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            }
        });
    });
}

/**
 * Product cards functionality
 */
function initializeProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Image lazy loading
        const img = card.querySelector('img');
        if (img && 'IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });
            
            imageObserver.observe(img);
        }
    });
}

/**
 * Initialize tooltips
 */
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        tooltipElements.forEach(element => {
            new bootstrap.Tooltip(element);
        });
    } else {
        // Fallback for when Bootstrap is not loaded
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.title = this.getAttribute('data-bs-original-title') || this.title;
            });
        });
    }
}

/**
 * Flash messages auto-hide
 */
function initializeFlashMessages() {
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(alert => {
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.style.opacity = '0';
                alert.style.transform = 'translateY(-100%)';
                setTimeout(() => {
                    if (alert.parentNode) {
                        alert.parentNode.removeChild(alert);
                    }
                }, 300);
            }
        }, 5000);
        
        // Manual close
        const closeBtn = alert.querySelector('.btn-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                alert.style.opacity = '0';
                alert.style.transform = 'translateY(-100%)';
                setTimeout(() => {
                    if (alert.parentNode) {
                        alert.parentNode.removeChild(alert);
                    }
                }, 300);
            });
        }
    });
}

/**
 * Search functionality
 */
function initializeSearch() {
    const searchInput = document.querySelector('#search-input');
    const searchResults = document.querySelector('#search-results');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            clearTimeout(searchTimeout);
            
            if (query.length >= 2) {
                searchTimeout = setTimeout(() => {
                    performSearch(query);
                }, 300);
            } else if (searchResults) {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
            }
        });
        
        // Hide search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && searchResults) {
                searchResults.style.display = 'none';
            }
        });
    }
}

/**
 * Perform AJAX search
 */
function performSearch(query) {
    const searchResults = document.querySelector('#search-results');
    
    if (!searchResults) return;
    
    // Show loading
    searchResults.innerHTML = '<div class="p-3">Searching...</div>';
    searchResults.style.display = 'block';
    
    // Simulate search (replace with actual AJAX call)
    setTimeout(() => {
        searchResults.innerHTML = `
            <div class="p-3">
                <div class="search-result-item">
                    <strong>No results found for "${query}"</strong>
                </div>
            </div>
        `;
    }, 500);
}

/**
 * Quantity controls for cart
 */
function initializeQuantityControls() {
    const quantityInputs = document.querySelectorAll('input[name="quantity"]');
    
    quantityInputs.forEach(input => {
        const minusBtn = input.parentNode.querySelector('.btn-minus');
        const plusBtn = input.parentNode.querySelector('.btn-plus');
        
        if (minusBtn) {
            minusBtn.addEventListener('click', () => {
                const currentValue = parseInt(input.value) || 1;
                if (currentValue > 1) {
                    input.value = currentValue - 1;
                    input.dispatchEvent(new Event('change'));
                }
            });
        }
        
        if (plusBtn) {
            plusBtn.addEventListener('click', () => {
                const currentValue = parseInt(input.value) || 1;
                const maxValue = parseInt(input.getAttribute('max')) || 99;
                if (currentValue < maxValue) {
                    input.value = currentValue + 1;
                    input.dispatchEvent(new Event('change'));
                }
            });
        }
    });
}

/**
 * Image gallery functionality
 */
function initializeImageGallery() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    const mainImage = document.querySelector('.main-product-image');
    
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            if (mainImage) {
                mainImage.src = this.src;
                mainImage.alt = this.alt;
            }
            
            // Update active state
            galleryImages.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * Price formatting
 */
function formatPrice(price) {
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD'
    }).format(price);
}

/**
 * Smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Loading states for buttons
 */
function showButtonLoading(button, text = 'Loading...') {
    const originalText = button.innerHTML;
    button.innerHTML = `<span class="loading"></span> ${text}`;
    button.disabled = true;
    
    return function hideLoading() {
        button.innerHTML = originalText;
        button.disabled = false;
    };
}

/**
 * Show notification
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

/**
 * Utility functions
 */
const LPA = {
    formatPrice,
    showNotification,
    showButtonLoading,
    performSearch
};

// Make LPA utilities globally available
window.LPA = LPA;

// Initialize Bootstrap components when available
if (typeof bootstrap !== 'undefined') {
    // Initialize all Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize all Bootstrap popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
} 
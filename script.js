
/**
 * ============================================
 * FRAGRANZE.LK - LUXURY PERFUME E-COMMERCE
 * Premium JavaScript Application
 * ============================================
 */

// Global State
const App = {
    cart: JSON.parse(localStorage.getItem('fragranze_cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('fragranze_wishlist')) || [],
    user: JSON.parse(localStorage.getItem('fragranze_user')) || null,
    currency: 'LKR',
    exchangeRate: 1,

    init() {
        this.setupEventListeners();
        this.updateCartCount();
        this.updateWishlistCount();
        this.initHeroSlider();
        this.initScrollEffects();
        this.initLazyLoading();
        this.initMobileMenu();
        this.initSearch();
        this.initFilters();
        this.initQuantitySelectors();
        this.initPaymentSelection();
        this.initFormValidation();
        this.initToastSystem();
        this.initScrollToTop();
        this.initProductGallery();
        this.initCarousel();
        this.initAdminCharts();
    },

    // Event Listeners
    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            // Add to cart buttons
            document.querySelectorAll('.add-to-cart').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const card = btn.closest('.product-card');
                    if (card) {
                        const product = {
                            id: card.dataset.id || Math.random().toString(36).substr(2, 9),
                            name: card.querySelector('.product-name')?.textContent || 'Product',
                            brand: card.querySelector('.product-brand')?.textContent || 'Brand',
                            price: this.extractPrice(card.querySelector('.price-current')?.textContent || '0'),
                            image: card.querySelector('.product-image img')?.src || '',
                            quantity: 1
                        };
                        this.addToCart(product);
                    }
                });
            });

            // Wishlist buttons
            document.querySelectorAll('.wishlist-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const card = btn.closest('.product-card');
                    if (card) {
                        const product = {
                            id: card.dataset.id || Math.random().toString(36).substr(2, 9),
                            name: card.querySelector('.product-name')?.textContent || 'Product',
                            brand: card.querySelector('.product-brand')?.textContent || 'Brand',
                            price: this.extractPrice(card.querySelector('.price-current')?.textContent || '0'),
                            image: card.querySelector('.product-image img')?.src || ''
                        };
                        this.toggleWishlist(product);
                        btn.classList.toggle('active');
                        btn.innerHTML = btn.classList.contains('active') ? 
                            '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
                    }
                });
            });

            // Newsletter form
            const newsletterForm = document.querySelector('.newsletter-form');
            if (newsletterForm) {
                newsletterForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const email = newsletterForm.querySelector('input[type="email"]').value;
                    if (this.validateEmail(email)) {
                        this.showToast('Successfully subscribed to newsletter!', 'success');
                        newsletterForm.reset();
                    } else {
                        this.showToast('Please enter a valid email address', 'error');
                    }
                });
            }

            // Coupon code
            const couponForm = document.querySelector('.coupon-input');
            if (couponForm) {
                couponForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const code = couponForm.querySelector('input').value;
                    this.applyCoupon(code);
                });
            }

            // Checkout form
            const checkoutForm = document.querySelector('#checkout-form');
            if (checkoutForm) {
                checkoutForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    if (this.validateForm(checkoutForm)) {
                        this.processOrder();
                    }
                });
            }
        });
    },

    // Hero Slider
    initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.hero-dot');
        if (!slides.length) return;

        let currentSlide = 0;
        const totalSlides = slides.length;

        const goToSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentSlide = index;
        };

        const nextSlide = () => {
            goToSlide((currentSlide + 1) % totalSlides);
        };

        // Auto slide
        let slideInterval = setInterval(nextSlide, 5000);

        // Dot clicks
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                goToSlide(index);
                slideInterval = setInterval(nextSlide, 5000);
            });
        });

        // Touch support
        let touchStartX = 0;
        const heroSlider = document.querySelector('.hero-slider');
        if (heroSlider) {
            heroSlider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            heroSlider.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    clearInterval(slideInterval);
                    if (diff > 0) {
                        goToSlide((currentSlide + 1) % totalSlides);
                    } else {
                        goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
                    }
                    slideInterval = setInterval(nextSlide, 5000);
                }
            }, { passive: true });
        }
    },

    // Scroll Effects
    initScrollEffects() {
        const header = document.querySelector('.main-header');
        const sections = document.querySelectorAll('.section-padding');

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));

        // Header scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header?.classList.add('scrolled');
            } else {
                header?.classList.remove('scrolled');
            }
        });
    },

    // Lazy Loading
    initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    },

    // Mobile Menu
    initMobileMenu() {
        const toggle = document.querySelector('.mobile-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (toggle && navMenu) {
            toggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                toggle.classList.toggle('active');
            });

            // Dropdown toggles on mobile
            document.querySelectorAll('.dropdown > a').forEach(dropdown => {
                dropdown.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        dropdown.parentElement.classList.toggle('active');
                    }
                });
            });
        }
    },

    // Live Search
    initSearch() {
        const searchInput = document.querySelector('.search-bar input');
        const searchResults = document.querySelector('.search-results');

        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();

                if (query.length < 2) {
                    searchResults?.classList.remove('active');
                    return;
                }

                searchTimeout = setTimeout(() => {
                    this.performSearch(query);
                }, 300);
            });

            // Close search on click outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search-bar')) {
                    searchResults?.classList.remove('active');
                }
            });
        }
    },

    performSearch(query) {
        // Simulated search - in production, this would fetch from API
        const products = this.getSampleProducts();
        const results = products.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.brand.toLowerCase().includes(query.toLowerCase())
        );

        this.displaySearchResults(results);
    },

    displaySearchResults(results) {
        const container = document.querySelector('.search-results');
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = '<div class="no-results">No products found</div>';
        } else {
            container.innerHTML = results.map(product => `
                <div class="search-result-item" data-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="search-result-info">
                        <h4>${product.name}</h4>
                        <p>${product.brand}</p>
                        <span class="price">LKR ${product.price.toLocaleString()}</span>
                    </div>
                </div>
            `).join('');
        }
        container.classList.add('active');
    },

    // Filters
    initFilters() {
        const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
        const sortSelect = document.querySelector('.sort-select');
        const priceInputs = document.querySelectorAll('.price-range input');

        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.applyFilters());
        });

        if (sortSelect) {
            sortSelect.addEventListener('change', () => this.applyFilters());
        }

        priceInputs.forEach(input => {
            input.addEventListener('input', () => this.applyFilters());
        });
    },

    applyFilters() {
        const products = document.querySelectorAll('.product-card');
        const checkedBrands = Array.from(document.querySelectorAll('.filter-brand:checked')).map(cb => cb.value);
        const checkedTypes = Array.from(document.querySelectorAll('.filter-type:checked')).map(cb => cb.value);
        const minPrice = parseFloat(document.querySelector('.price-min')?.value) || 0;
        const maxPrice = parseFloat(document.querySelector('.price-max')?.value) || Infinity;
        const sortValue = document.querySelector('.sort-select')?.value;

        let visibleCount = 0;

        products.forEach(product => {
            const brand = product.dataset.brand;
            const type = product.dataset.type;
            const price = parseFloat(product.dataset.price) || 0;
            const gender = product.dataset.gender;

            let visible = true;

            if (checkedBrands.length && !checkedBrands.includes(brand)) visible = false;
            if (checkedTypes.length && !checkedTypes.includes(type)) visible = false;
            if (price < minPrice || price > maxPrice) visible = false;

            product.style.display = visible ? 'block' : 'none';
            if (visible) visibleCount++;
        });

        // Update count
        const countDisplay = document.querySelector('.product-count');
        if (countDisplay) {
            countDisplay.textContent = `${visibleCount} products found`;
        }

        // Sorting
        if (sortValue) {
            this.sortProducts(sortValue);
        }
    },

    sortProducts(criteria) {
        const grid = document.querySelector('.products-grid');
        if (!grid) return;

        const products = Array.from(grid.querySelectorAll('.product-card'));

        products.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price) || 0;
            const priceB = parseFloat(b.dataset.price) || 0;

            switch(criteria) {
                case 'price-low': return priceA - priceB;
                case 'price-high': return priceB - priceA;
                case 'newest': return (b.dataset.new === 'true' ? 1 : 0) - (a.dataset.new === 'true' ? 1 : 0);
                case 'bestseller': return (b.dataset.bestseller === 'true' ? 1 : 0) - (a.dataset.bestseller === 'true' ? 1 : 0);
                default: return 0;
            }
        });

        products.forEach(product => grid.appendChild(product));
    },

    // Quantity Selectors
    initQuantitySelectors() {
        document.querySelectorAll('.quantity-selector').forEach(selector => {
            const minus = selector.querySelector('.qty-minus');
            const plus = selector.querySelector('.qty-plus');
            const input = selector.querySelector('input');

            minus?.addEventListener('click', () => {
                const val = parseInt(input.value) || 1;
                if (val > 1) input.value = val - 1;
            });

            plus?.addEventListener('click', () => {
                const val = parseInt(input.value) || 1;
                if (val < 99) input.value = val + 1;
            });

            input?.addEventListener('change', () => {
                let val = parseInt(input.value) || 1;
                if (val < 1) val = 1;
                if (val > 99) val = 99;
                input.value = val;
            });
        });
    },

    // Payment Selection
    initPaymentSelection() {
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                option.querySelector('input[type="radio"]').checked = true;
            });
        });
    },

    // Form Validation
    initFormValidation() {
        document.querySelectorAll('form[data-validate]').forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    },

    validateForm(form) {
        let valid = true;
        const required = form.querySelectorAll('[required]');

        required.forEach(field => {
            if (!field.value.trim()) {
                valid = false;
                field.classList.add('error');
                this.showToast(`${field.name || 'Field'} is required`, 'error');
            } else {
                field.classList.remove('error');
            }

            // Email validation
            if (field.type === 'email' && field.value) {
                if (!this.validateEmail(field.value)) {
                    valid = false;
                    field.classList.add('error');
                    this.showToast('Please enter a valid email', 'error');
                }
            }

            // Phone validation
            if (field.type === 'tel' && field.value) {
                const phoneRegex = /^[0-9+\-\s()]{10,}$/;
                if (!phoneRegex.test(field.value)) {
                    valid = false;
                    field.classList.add('error');
                    this.showToast('Please enter a valid phone number', 'error');
                }
            }
        });

        return valid;
    },

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    // Toast System
    initToastSystem() {
        if (!document.querySelector('.toast-container')) {
            const container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    },

    showToast(message, type = 'info') {
        const container = document.querySelector('.toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };

        toast.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Scroll to Top
    initScrollToTop() {
        const btn = document.querySelector('.scroll-top');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },

    // Product Gallery
    initProductGallery() {
        const mainImage = document.querySelector('.main-image img');
        const thumbnails = document.querySelectorAll('.thumbnail');

        if (mainImage && thumbnails.length) {
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', () => {
                    const newSrc = thumb.querySelector('img')?.src;
                    if (newSrc) {
                        mainImage.src = newSrc;
                        thumbnails.forEach(t => t.classList.remove('active'));
                        thumb.classList.add('active');
                    }
                });
            });
        }
    },

    // Carousel
    initCarousel() {
        const carousels = document.querySelectorAll('.offers-carousel');

        carousels.forEach(carousel => {
            const track = carousel.querySelector('.offers-track');
            const prevBtn = carousel.querySelector('.carousel-prev');
            const nextBtn = carousel.querySelector('.carousel-next');

            if (!track) return;

            let currentIndex = 0;
            const items = track.children;
            const itemWidth = items[0]?.offsetWidth + 30 || 300;
            const maxIndex = Math.max(0, items.length - Math.floor(carousel.offsetWidth / itemWidth));

            const updateCarousel = () => {
                track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
            };

            prevBtn?.addEventListener('click', () => {
                currentIndex = Math.max(0, currentIndex - 1);
                updateCarousel();
            });

            nextBtn?.addEventListener('click', () => {
                currentIndex = Math.min(maxIndex, currentIndex + 1);
                updateCarousel();
            });

            // Touch support
            let touchStart = 0;
            carousel.addEventListener('touchstart', (e) => {
                touchStart = e.changedTouches[0].screenX;
            }, { passive: true });

            carousel.addEventListener('touchend', (e) => {
                const diff = touchStart - e.changedTouches[0].screenX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0 && currentIndex < maxIndex) {
                        currentIndex++;
                    } else if (diff < 0 && currentIndex > 0) {
                        currentIndex--;
                    }
                    updateCarousel();
                }
            }, { passive: true });
        });
    },

    // Admin Charts
    initAdminCharts() {
        const chartCanvas = document.querySelector('#salesChart');
        if (chartCanvas && typeof Chart !== 'undefined') {
            const ctx = chartCanvas.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Sales (LKR)',
                        data: [45000, 52000, 48000, 61000, 58000, 72000],
                        borderColor: '#D4AF37',
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(0,0,0,0.05)' }
                        },
                        x: {
                            grid: { display: false }
                        }
                    }
                }
            });
        }
    },

    // Cart Functions
    addToCart(product) {
        const existing = this.cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity += product.quantity || 1;
        } else {
            this.cart.push({ ...product, quantity: product.quantity || 1 });
        }

        this.saveCart();
        this.updateCartCount();
        this.showToast(`${product.name} added to cart`, 'success');
    },

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
    },

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, Math.min(99, quantity));
            this.saveCart();
            this.renderCart();
        }
    },

    saveCart() {
        localStorage.setItem('fragranze_cart', JSON.stringify(this.cart));
    },

    updateCartCount() {
        const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    },

    renderCart() {
        const container = document.querySelector('.cart-items');
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>Your cart is empty</h3>
                    <p>Discover our luxury fragrances and add them to your cart</p>
                    <a href="products.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
            this.updateCartSummary();
            return;
        }

        container.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="brand">${item.brand}</p>
                </div>
                <div class="quantity-selector">
                    <button class="qty-minus" onclick="App.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1" max="99" readonly>
                    <button class="qty-plus" onclick="App.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-price">LKR ${(item.price * item.quantity).toLocaleString()}</div>
                <button class="cart-item-remove" onclick="App.removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        this.updateCartSummary();
    },

    updateCartSummary() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 5000 ? 0 : 350;
        const discount = this.calculateDiscount();
        const total = subtotal + shipping - discount;

        const summaryElements = {
            '.summary-subtotal': subtotal,
            '.summary-shipping': shipping,
            '.summary-discount': discount,
            '.summary-total': total
        };

        Object.entries(summaryElements).forEach(([selector, value]) => {
            const el = document.querySelector(selector);
            if (el) el.textContent = `LKR ${value.toLocaleString()}`;
        });
    },

    calculateDiscount() {
        // Apply coupon logic here
        return 0;
    },

    applyCoupon(code) {
        const validCoupons = {
            'FRAGRANZE10': 0.10,
            'LUXURY20': 0.20,
            'WELCOME15': 0.15
        };

        const discount = validCoupons[code.toUpperCase()];
        if (discount) {
            this.showToast(`Coupon applied! ${discount * 100}% discount`, 'success');
            // Apply discount logic
        } else {
            this.showToast('Invalid coupon code', 'error');
        }
    },

    // Wishlist Functions
    toggleWishlist(product) {
        const index = this.wishlist.findIndex(item => item.id === product.id);

        if (index > -1) {
            this.wishlist.splice(index, 1);
            this.showToast('Removed from wishlist', 'info');
        } else {
            this.wishlist.push(product);
            this.showToast('Added to wishlist', 'success');
        }

        localStorage.setItem('fragranze_wishlist', JSON.stringify(this.wishlist));
        this.updateWishlistCount();
    },

    updateWishlistCount() {
        const count = this.wishlist.length;
        document.querySelectorAll('.wishlist-count').forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    },

    // Order Processing
    processOrder() {
        const order = {
            id: 'ORD' + Date.now(),
            items: [...this.cart],
            date: new Date().toISOString(),
            status: 'pending',
            total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };

        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('fragranze_orders')) || [];
        orders.push(order);
        localStorage.setItem('fragranze_orders', JSON.stringify(orders));

        // Clear cart
        this.cart = [];
        this.saveCart();
        this.updateCartCount();

        this.showToast('Order placed successfully!', 'success');

        // Redirect to order confirmation
        setTimeout(() => {
            window.location.href = 'order-confirmation.html?order=' + order.id;
        }, 1500);
    },

    // Utility Functions
    extractPrice(priceString) {
        const match = priceString.replace(/,/g, '').match(/(\d+)/);
        return match ? parseFloat(match[1]) : 0;
    },

    formatPrice(price) {
        return `LKR ${price.toLocaleString()}`;
    },

    getSampleProducts() {
        return [
            { id: '1', name: 'Sauvage Eau de Parfum', brand: 'Dior', price: 28500, image: 'images/products/dior-sauvage.jpg', type: 'edp', gender: 'men' },
            { id: '2', name: 'Coco Mademoiselle', brand: 'Chanel', price: 32000, image: 'images/products/chanel-coco.jpg', type: 'edp', gender: 'women' },
            { id: '3', name: 'Eros', brand: 'Versace', price: 18500, image: 'images/products/versace-eros.jpg', type: 'edt', gender: 'men' },
            { id: '4', name: 'Si Passione', brand: 'Armani', price: 22000, image: 'images/products/armani-si.jpg', type: 'edp', gender: 'women' },
            { id: '5', name: 'Oud Wood', brand: 'Tom Ford', price: 45000, image: 'images/products/tomford-oud.jpg', type: 'edp', gender: 'unisex' },
            { id: '6', name: 'Boss Bottled', brand: 'Hugo Boss', price: 16500, image: 'images/products/hugoboss-bottled.jpg', type: 'edt', gender: 'men' },
            { id: '7', name: '1 Million', brand: 'Paco Rabanne', price: 19500, image: 'images/products/paco-1million.jpg', type: 'edt', gender: 'men' },
            { id: '8', name: 'Raghba', brand: 'Lattafa', price: 8500, image: 'images/products/lattafa-raghba.jpg', type: 'edp', gender: 'unisex' },
            { id: '9', name: 'Supremacy Silver', brand: 'Afnan', price: 12000, image: 'images/products/afnan-supremacy.jpg', type: 'edp', gender: 'men' },
            { id: '10', name: 'Shuhrah', brand: 'Rasasi', price: 9500, image: 'images/products/rasasi-shuhrah.jpg', type: 'edp', gender: 'men' }
        ];
    },

    // Auth Functions
    login(email, password) {
        // Simulated login - in production, this would call an API
        const users = JSON.parse(localStorage.getItem('fragranze_users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.user = { id: user.id, name: user.name, email: user.email };
            localStorage.setItem('fragranze_user', JSON.stringify(this.user));
            this.showToast('Welcome back, ' + user.name + '!', 'success');
            return true;
        } else {
            this.showToast('Invalid email or password', 'error');
            return false;
        }
    },

    register(name, email, password) {
        const users = JSON.parse(localStorage.getItem('fragranze_users')) || [];

        if (users.find(u => u.email === email)) {
            this.showToast('Email already registered', 'error');
            return false;
        }

        const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('fragranze_users', JSON.stringify(users));

        this.user = { id: newUser.id, name: newUser.name, email: newUser.email };
        localStorage.setItem('fragranze_user', JSON.stringify(this.user));

        this.showToast('Account created successfully!', 'success');
        return true;
    },

    logout() {
        this.user = null;
        localStorage.removeItem('fragranze_user');
        this.showToast('Logged out successfully', 'info');
        window.location.href = 'index.html';
    },

    isLoggedIn() {
        return !!this.user;
    },

    updateAuthUI() {
        const authElements = document.querySelectorAll('.auth-dependent');
        authElements.forEach(el => {
            if (this.isLoggedIn()) {
                el.classList.add('logged-in');
                el.classList.remove('logged-out');
            } else {
                el.classList.add('logged-out');
                el.classList.remove('logged-in');
            }
        });
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    App.updateAuthUI();

    // Render cart if on cart page
    if (document.querySelector('.cart-items')) {
        App.renderCart();
    }
});

// Expose App globally for inline onclick handlers
window.App = App;

/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

// Initialize cart counter
let cartCount = 0;

// Add click event listeners to all "Add to cart" buttons
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.btn-outline-dark[href="#"]');
    const cartCounter = document.getElementById('cartCounter');
    const notificationBanner = document.getElementById('notification-banner');

    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCounter();

    function showNotification() {
        notificationBanner.style.display = 'block';
        setTimeout(() => {
            notificationBanner.style.display = 'none';
        }, 2000);
    }

    function updateCartCounter() {
        cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCounter.textContent = cartCount;
    }

    addToCartButtons.forEach(button => {
        const originalHTML = button.innerHTML;
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!button.querySelector('.quantity-control')) {
                // Get product details
                const card = button.closest('.card');
                const productName = card.querySelector('.fw-bolder').textContent;
                const priceText = card.querySelector('.card-body').textContent.match(/Ksh\s+(\d+)/);
                const productPrice = priceText ? parseInt(priceText[1]) : 0;
                
                // Add to cart array
                const existingItem = cart.find(item => item.name === productName);
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({
                        name: productName,
                        price: productPrice,
                        quantity: 1
                    });
                }
                
                // Save to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCounter();
                showNotification();

                const quantityHTML = `
                    <div class="quantity-control">
                        <button class="btn btn-sm btn-secondary minus">-</button>
                        <span class="mx-2 quantity">1</span>
                        <button class="btn btn-sm btn-secondary plus">+</button>
                    </div>
                `;
                button.innerHTML = quantityHTML;

                const plusBtn = button.querySelector('.plus');
                const minusBtn = button.querySelector('.minus');
                const quantitySpan = button.querySelector('.quantity');
                let quantity = 1;

                plusBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    quantity++;
                    
                    // Update cart in localStorage
                    const item = cart.find(item => item.name === productName);
                    if (item) {
                        item.quantity++;
                        localStorage.setItem('cart', JSON.stringify(cart));
                    }
                    
                    quantitySpan.textContent = quantity;
                    updateCartCounter();
                    showNotification();
                });

                minusBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (quantity > 0) {
                        quantity--;
                        
                        // Update cart in localStorage
                        const item = cart.find(item => item.name === productName);
                        if (item) {
                            item.quantity--;
                            if (item.quantity === 0) {
                                cart = cart.filter(i => i.name !== productName);
                                button.innerHTML = originalHTML;
                            }
                            localStorage.setItem('cart', JSON.stringify(cart));
                        }
                        
                        quantitySpan.textContent = quantity;
                        updateCartCounter();
                    }
                });
            }
        });
    });
});
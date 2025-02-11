document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage if it exists
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartDisplay();

    function updateCartDisplay() {
        const cartBody = document.getElementById('cart-items-body');
        const subtotalElement = document.getElementById('cart-subtotal');
        const taxElement = document.getElementById('cart-tax');
        const totalElement = document.getElementById('cart-total');
        
        // Clear current cart display
        cartBody.innerHTML = '';
        
        let subtotal = 0;

        // Add each item to the cart display
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>Ksh ${item.price.toLocaleString()}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-secondary me-2" onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="btn btn-sm btn-secondary ms-2" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                </td>
                <td>Ksh ${itemTotal.toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">Remove</button>
                </td>
            `;
            cartBody.appendChild(row);
        });

        // Calculate and display totals with 16% VAT
        const tax = subtotal * 0.16;
        const total = subtotal + tax;

        subtotalElement.textContent = `Ksh ${subtotal.toLocaleString()}`;
        taxElement.textContent = `Ksh ${tax.toLocaleString()}`;
        totalElement.textContent = `Ksh ${total.toLocaleString()}`;

        // Show empty cart message if no items
        if (cart.length === 0) {
            cartBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">Your cart is empty</td>
                </tr>
            `;
        }
    }

    // Make functions available globally
    window.updateQuantity = function(index, change) {
        if (cart[index].quantity + change > 0) {
            cart[index].quantity += change;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
    };

    window.removeItem = function(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    };

    // Make these functions globally available
    window.showPaymentInstructions = function() {
        // Hide checkout button
        document.getElementById('checkout-button').classList.add('d-none');
        
        // Show payment instructions
        document.getElementById('payment-instructions').classList.remove('d-none');
    };

    window.copyPaymentDetails = function() {
        navigator.clipboard.writeText('0793520615').then(() => {
            alert('M-PESA number copied to clipboard!\n\nSend payment to: 0793520615');
        });
    };
}); 
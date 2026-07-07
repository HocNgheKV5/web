// DOM Elements
const header = document.querySelector('.header');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const filterBtns = document.querySelectorAll('.filter');
const productCards = document.querySelectorAll('.product-card');
const modal = document.getElementById('productModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalDesc = document.getElementById('modalDesc');
const modalPrice = document.getElementById('modalPrice');
const addToCartBtn = document.getElementById('addCartBtn');
const cartBtn = document.getElementById('cartBtn');
const cartDropdown = document.getElementById('cartDropdown');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const toast = document.getElementById('toast');

let cart = [];

// Cart Toggle
cartBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    cartDropdown.classList.toggle('show');
    navLinks.classList.remove('open');
});

document.addEventListener('click', (e) => {
    if (!cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
        cartDropdown.classList.remove('show');
    }
});

// Update Cart UI
function updateCartUI() {
    cartCount.textContent = cart.length;
    cartCount.style.transform = 'scale(1.5)';
    setTimeout(() => cartCount.style.transform = 'scale(1)', 200);

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Chưa có sản phẩm</p>';
        cartTotalElement.textContent = '0đ';
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div>
                    <h5>${item.name}</h5>
                    <p>${new Intl.NumberFormat('vi-VN').format(item.price)}đ</p>
                </div>
                <button class="cart-remove material-symbols-outlined" onclick="removeFromCart(${index})">delete</button>
            </div>
        `;
    }).join('');

    cartTotalElement.textContent = new Intl.NumberFormat('vi-VN').format(total) + 'đ';
}

// Remove from Cart (Global function so onclick works)
window.removeFromCart = (index) => {
    const removedName = cart[index].name;
    cart.splice(index, 1);
    updateCartUI();
    showToast(`Đã xoá ${removedName} khỏi giỏ`);
};

// Add to Cart
addToCartBtn.addEventListener('click', () => {
    const name = modalName.textContent;
    const price = parseInt(modalPrice.textContent.replace(/\./g, '').replace('đ', ''));
    const img = modalImage.src;

    cart.push({ name, price, img });
    updateCartUI();
    showToast(`Đã thêm ${name} vào giỏ hàng`);
    closeModal();

    // Open dropdown to show what was added
    cartDropdown.classList.add('show');
});
menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

// Scroll Effect for Header
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll <= 0) {
        header.classList.remove('hide');
        return;
    }
    if (currentScroll > lastScroll && !header.classList.contains('hide')) {
        header.classList.add('hide');
    } else if (currentScroll < lastScroll && header.classList.contains('hide')) {
        header.classList.remove('hide');
    }
    lastScroll = currentScroll;
});

// Category Filters
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        productCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => card.classList.add('hidden'), 300);
            }
        });
    });
});

// Product Modal
document.querySelectorAll('.detail-btn').forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.product-card');
        const img = card.querySelector('img').src;
        const name = card.dataset.name;
        const price = parseInt(card.dataset.price);

        modalImage.src = img;
        modalName.textContent = name;
        modalDesc.textContent = `Điện thoại ${name} chính hãng, hiệu năng mạnh, camera sắc nét, pin bền, hỗ trợ trả góp và bảo hành 12 tháng.`;
        modalPrice.textContent = new Intl.NumberFormat('vi-VN').format(price) + 'đ';

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
});

// Close Modal
const closeModal = () => {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
};

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
});

// Toast
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Scroll Reveal
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

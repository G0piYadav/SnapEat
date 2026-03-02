// common utilities for SnapEat pages

// mobile navigation toggle and sticky header
function initNavigation() {
  const btnNav = document.querySelector('.btn-mobile-nav');
  const headerEl = document.querySelector('.header');
  if (!btnNav || !headerEl) return;

  btnNav.addEventListener('click', function () {
    const open = headerEl.classList.toggle('nav-open');
    btnNav.setAttribute('aria-expanded', open);
  });

  // close mobile nav when one of the links is clicked
  document.querySelectorAll('.main-nav-link').forEach((link) => {
    link.addEventListener('click', function () {
      headerEl.classList.remove('nav-open');
      btnNav.setAttribute('aria-expanded', false);
    });
  });

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) headerEl.classList.add('sticky');
    else headerEl.classList.remove('sticky');
  });
}

// authentication logic (signup & login)
function initAuthForms() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const pwd = document.getElementById('password').value;
      const users = JSON.parse(localStorage.getItem('snapeat-users') || '[]');
      const user = users.find(u => u.email === email && u.password === pwd);
      if (user) {
        alert('Welcome back, ' + user.name + '!');
        localStorage.setItem('snapeat-current', JSON.stringify(user));
        window.location.href = 'index.html';
      } else {
        alert('Invalid email or password');
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const pwd = document.getElementById('password').value;
      const users = JSON.parse(localStorage.getItem('snapeat-users') || '[]');

      if (users.find(u => u.email === email)) {
        alert('Email already registered. Please log in.');
        return;
      }

      users.push({ name, email, password: pwd });
      localStorage.setItem('snapeat-users', JSON.stringify(users));
      alert('Account created! You can now log in.');
      window.location.href = 'login.html';
    });
  }
}

// recipe rendering logic for recipes.html
const recipes = [
  {
    img: 'img/meals/meal-1.jpg',
    title: 'Japanese Gyozas',
    tags: ['Vegetarian'],
    calories: 650,
  },
  {
    img: 'img/meals/meal-2.jpg',
    title: 'Avocado Salad',
    tags: ['Vegan', 'Paleo'],
    calories: 400,
  },
  {
    img: 'img/meals/pad thai.jpg',
    title: 'Pad Thai',
    tags: ['Pescatarian'],
    calories: 800,
  },
  {
    img: 'img/meals/Green Bowl.jpg',
    title: 'Green Bowl',
    tags: ['Vegan', 'Gluten-free'],
    calories: 500,
  },
  {
    img: 'img/meals/Burger.jpg',
    title: 'Burger',
    tags: ['Keto'],
    calories: 750,
  },
  {
    img: 'img/meals/Salmon.jpg',
    title: 'Salmon',
    tags: ['Pescatarian'],
    calories: 700,
  },
];

// cart utilities
function getCart() {
  return JSON.parse(localStorage.getItem('snapeat-cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('snapeat-cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(item) {
  const cart = getCart();
  cart.push(item);
  saveCart(cart);
  alert(item.title + ' added to cart');
}

function clearCart() {
  localStorage.removeItem('snapeat-cart');
  updateCartCount();
}

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (!countEl) return;
  const cart = getCart();
  countEl.textContent = cart.length;
}

function renderCartPage() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) paymentForm.style.display = 'none';
    return;
  }
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) paymentForm.style.display = '';

  container.innerHTML = '';
  cart.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'meal';
    div.innerHTML = `
      <img src="${item.img}" class="meal-img" alt="${item.title}" />
      <div class="meal-content">
        <p class="meal-title">${item.title}</p>
        <button data-index="${idx}" class="btn btn--small btn--outline remove-btn">Remove</button>
      </div>
    `;
    container.appendChild(div);
  });
  container.querySelectorAll('.remove-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      const i = parseInt(this.dataset.index, 10);
      const c = getCart();
      c.splice(i, 1);
      saveCart(c);
      renderCartPage();
    });
  });
}

function initCartPage() {
  renderCartPage();
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      // simple validation already handled by HTML patterns
      alert('Payment successful! Thank you for your order.');
      clearCart();
      renderCartPage();
      paymentForm.reset();
    });
  }
}

function renderRecipes() {
  const grid = document.getElementById('recipes-grid');
  if (!grid) return;
  recipes.forEach((r) => {
    const mealDiv = document.createElement('div');
    mealDiv.className = 'meal';
    mealDiv.innerHTML = `
      <img src="${r.img}" class="meal-img" alt="${r.title}" />
      <div class="meal-content">
        <div class="meal-tags">
          ${r.tags
            .map((t) => `<span class="tag tag--${t.toLowerCase()}">${t}</span>`)
            .join('')}
        </div>
        <p class="meal-title">${r.title}</p>
        <ul class="meal-attributes">
          <li class="meal-attribute">
            <ion-icon class="meal-icon" name="flame-outline"></ion-icon>
            <span>${r.calories} calories</span>
          </li>
        </ul>
        <button class="btn btn--full add-cart-btn">Add to cart</button>
      </div>
    `;
    grid.appendChild(mealDiv);
  });
  document.querySelectorAll('.add-cart-btn').forEach((btn, idx) => {
    btn.addEventListener('click', function () {
      addToCart(recipes[idx]);
    });
  });
}

// initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAuthForms();
  updateCartCount();
  if (document.getElementById('recipes-grid')) {
    renderRecipes();
  }
  if (document.getElementById('cart-items')) {
    initCartPage();
  }
});
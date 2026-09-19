'use strict';

// ---------- Datos de productos ----------
const productos = [
  {
    id: 1,
    nombre: 'Abrigo Camel',
    precio: 129.99,
    img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    nombre: 'Vestido Noche',
    precio: 89.99,
    img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    nombre: 'Blazer Oversize',
    precio: 74.50,
    img: 'https://images.unsplash.com/photo-1541576966352-d9b128838179?w=600&auto=format&fit=crop'
  },
  {
    id: 4,
    nombre: 'Falda Midi',
    precio: 49.99,
    img: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&auto=format&fit=crop'
  },
  {
    id: 5,
    nombre: 'Sweater Beige',
    precio: 59.99,
    img: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&auto=format&fit=crop'
  },
  {
    id: 6,
    nombre: 'Jeans Clásicos',
    precio: 69.99,
    img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop'
  }
];

const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

const formatMoney = (n) => '$' + n.toFixed(2);

// ---------- Renderizar productos ----------
const renderProductos = () => {
  const contenedor = document.getElementById('products');

  if (!contenedor) return;

  contenedor.innerHTML = productos
    .map(
      (p) => `
      <div class="product">
        <div class="product-img" style="background-image:url('${p.img}');"></div>
        <div class="product-info">
          <h3>${p.nombre}</h3>
          <span class="price">${formatMoney(p.precio)}</span>
          <button class="add-btn" data-id="${p.id}">Añadir al Carrito</button>
        </div>
      </div>`
    )
    .join('');

  document.querySelectorAll('.add-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      agregarAlCarrito(id);
      btn.textContent = '✔ Añadido';
      btn.style.background = '#b08d57';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.textContent = 'Añadir al Carrito';
        btn.style.background = '';
        btn.style.color = '';
      }, 1500);
    });
  });
};

// ---------- Carrito ----------
const agregarAlCarrito = (id) => {
  const producto = productos.find((p) => p.id === id);
  const existente = carrito.find((c) => c.id === id);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  guardarYrender();
};

const eliminarDelCarrito = (id) => {
  const index = carrito.findIndex((c) => c.id === id);
  if (index !== -1) carrito.splice(index, 1);
  guardarYrender();
};

const cambiarCantidad = (id, delta) => {
  const item = carrito.find((c) => c.id === id);
  if (!item) return;

  item.cantidad += delta;

  if (item.cantidad <= 0) {
    eliminarDelCarrito(id);
    return;
  }

  guardarYrender();
};

const guardarYrender = () => {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  renderCarrito();
};

const renderCarrito = () => {
  const contenedor = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const countEl = document.getElementById('cartCount');

  const totalItems = carrito.reduce((acc, c) => acc + c.cantidad, 0);
  countEl.textContent = totalItems;

  if (carrito.length === 0) {
    contenedor.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>';
    totalEl.textContent = '$0';
    return;
  }

  contenedor.innerHTML = carrito
    .map(
      (c) => `
      <div class="cart-item">
        <img src="${c.img}" alt="${c.nombre}">
        <div class="info">
          <h4>${c.nombre}</h4>
          <span class="item-price">${formatMoney(c.precio * c.cantidad)}</span>
          <div class="item-actions">
            <div>
              <button onclick="cambiarCantidad(${c.id}, -1)">−</button>
              <span>${c.cantidad}</span>
              <button onclick="cambiarCantidad(${c.id}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="eliminarDelCarrito(${c.id})">Eliminar</button>
          </div>
        </div>
      </div>`
    )
    .join('');

  const total = carrito.reduce((acc, c) => acc + c.precio * c.cantidad, 0);
  totalEl.textContent = formatMoney(total);
};

// ---------- Carrito modal ----------
const cartBtn = document.getElementById('cartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');

const abrirCarrito = () => {
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
};

const cerrarCarrito = () => {
  cartOverlay.classList.remove('open');
  document.body.style.overflow = '';
};

if (cartBtn) cartBtn.addEventListener('click', abrirCarrito);
if (closeCart) closeCart.addEventListener('click', cerrarCarrito);

cartOverlay.addEventListener('click', (e) => {
  if (e.target === cartOverlay) cerrarCarrito();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    cerrarCarrito();
    cerrarLightbox();
  }
});

// Checkout
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (carrito.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }
    alert('¡Gracias por tu compra! Este es un demo.');
    carrito.length = 0;
    guardarYrender();
    cerrarCarrito();
  });
}

// ---------- Galería / Lightbox ----------
const itemsGaleria = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');

const abrirLightbox = (img) => {
  lightboxContent.style.backgroundImage = `url('${img}')`;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
};

const cerrarLightbox = () => {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
};

itemsGaleria.forEach((item) => {
  item.addEventListener('click', () => {
    const url = getComputedStyle(item).backgroundImage.slice(5, -2);
    abrirLightbox(url);
  });
});

const lightboxClose = document.getElementById('lightboxClose');
if (lightboxClose) lightboxClose.addEventListener('click', cerrarLightbox);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) cerrarLightbox();
});

// ---------- Navbar scroll ----------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ---------- Menú móvil ----------
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ---------- Newsletter ----------
const newsletterForm = document.getElementById('newsletterForm');
const formMsg = document.getElementById('formMsg');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();

    if (email && email.includes('@') && email.includes('.')) {
      formMsg.textContent = '¡Gracias por suscribirte! 🎉';
      formMsg.style.color = '#27ae60';
      newsletterForm.reset();
    } else {
      formMsg.textContent = 'Por favor, ingresa un correo válido.';
      formMsg.style.color = '#c0392b';
    }
  });
}

// ---------- Animación de aparición ----------
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.product, .trend-card, .gallery-item').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ---------- Init ----------
renderProductos();
renderCarrito();
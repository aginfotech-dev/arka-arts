/* ============================================================
   ARKA ARTS — Portfolio Website Scripts
   ============================================================ */

// ── NAV SCROLL EFFECT ──────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── MOBILE HAMBURGER ───────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

hamburger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = navMobile.classList.contains('open');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity   = isOpen ? '0' : '1';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

navMobile.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navMobile.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '1';
    });
  });
});

// ── SCROLL REVEAL ──────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── SMOOTH ANCHOR SCROLLING ────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = nav.offsetHeight;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── CONTACT FORM ───────────────────────────────────────────
const form = document.getElementById('contactForm');
form.addEventListener('submit', async e => {
  e.preventDefault();
  const btn  = form.querySelector('button[type="submit"]');
  const orig = btn.textContent;

  btn.textContent = 'Sending…';
  btn.disabled    = true;

  const data = {
    fname:   form.fname.value.trim(),
    lname:   form.lname.value.trim(),
    email:   form.email.value.trim(),
    company: form.company.value.trim(),
    service: form.service.value,
    message: form.message.value.trim(),
  };

  try {
    const res = await fetch('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();

    if (json.ok) {
      btn.textContent      = 'Message Sent ✓';
      btn.style.background = '#2d6a4f';
      btn.style.color      = '#fff';
      form.reset();
      setTimeout(() => {
        btn.textContent      = orig;
        btn.style.background = '';
        btn.style.color      = '';
        btn.disabled         = false;
      }, 3500);
    } else {
      throw new Error(json.error || 'Server error');
    }
  } catch (err) {
    console.error('Contact form error:', err);
    btn.textContent      = 'Failed — Try Again';
    btn.style.background = '#c0392b';
    btn.style.color      = '#fff';
    btn.disabled         = false;
    setTimeout(() => {
      btn.textContent      = orig;
      btn.style.background = '';
      btn.style.color      = '';
    }, 3000);
  }
});

// ── SERVICE CARD TILT ──────────────────────────────────────
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 10;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -10;
    card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
    card.style.transition = 'none';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = '';
  });
});

// ── COUNTER ANIMATION ──────────────────────────────────────
function animateCounter(el, target, suffix, duration) {
  let start = null;
  const isPercent = suffix === '%';
  const startVal = isPercent ? Math.floor(target * 0.8) : 0;

  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(startVal + (target - startVal) * ease);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent;
      const num  = parseInt(text);
      const suffix = text.replace(num, '').replace(/\d/g,'');
      animateCounter(el, num, suffix, 1200);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => statsObserver.observe(el));

// thumbnails are now local — no dynamic loading needed

// ── PORTFOLIO FILTER ───────────────────────────────────────
const pfFilters = document.querySelectorAll('.pf-filter');
const pfItems   = document.querySelectorAll('.pf-item');

pfFilters.forEach(btn => {
  btn.addEventListener('click', () => {
    pfFilters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    pfItems.forEach((item, i) => {
      const show = filter === 'all' || item.dataset.cat === filter;
      if (show) {
        item.classList.remove('pf-hidden');
        item.classList.remove('pf-fade-in');
        void item.offsetWidth;
        item.style.animationDelay = (i % 8) * 0.04 + 's';
        item.classList.add('pf-fade-in');
      } else {
        item.classList.add('pf-hidden');
        item.classList.remove('pf-fade-in');
      }
    });
  });
});

// ── LIGHTBOX MODAL ─────────────────────────────────────────
const modal      = document.getElementById('pfModal');
const backdrop   = document.getElementById('pfBackdrop');
const closeBtn   = document.getElementById('pfClose');
const modalLabel = document.getElementById('pfModalLabel');
const modalTitle = document.getElementById('pfModalTitle');
const modalMedia = document.getElementById('pfModalMedia');

function openModal(item) {
  const type  = item.dataset.type;
  const id    = item.dataset.id;
  const src   = item.dataset.src;
  const title = item.dataset.title;
  const label = item.dataset.label;

  modalLabel.textContent = label;
  modalTitle.textContent = title;

  if (type === 'local') {
    modalMedia.innerHTML = `<img src="${src}" alt="${title}" />`;
  } else if (type === 'image') {
    modalMedia.innerHTML = `<img src="https://drive.google.com/thumbnail?id=${id}&sz=w1200" alt="${title}" />`;
  } else {
    modalMedia.innerHTML = `<iframe src="https://drive.google.com/file/d/${id}/preview" allowfullscreen allow="autoplay"></iframe>`;
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { modalMedia.innerHTML = ''; }, 350);
}

pfItems.forEach(item => item.addEventListener('click', () => openModal(item)));
backdrop.addEventListener('click', closeModal);
closeBtn.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

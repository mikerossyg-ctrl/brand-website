/* =====================================================
   PETVITA v2 — Script
   - Header scroll shadow
   - Mobile menu toggle
   - Swiper sliders (top banner / best / new / reviews)
   - Fade-up on scroll
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Header scroll shadow ---------- */
  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger?.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  /* ---------- 3. Top banner (vertical autoplay) ---------- */
  new Swiper('.top-banner__swiper', {
    direction: 'vertical',
    loop: true,
    autoplay: { delay: 4500, disableOnInteraction: false },
    pagination: { el: '.top-banner .swiper-pagination', clickable: true },
    speed: 600,
  });

  /* ---------- 4. Product sliders ---------- */
  const productCommon = {
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    spaceBetween: 20,
    slidesPerView: 1.2,
    breakpoints: {
      640:  { slidesPerView: 2.2, spaceBetween: 20 },
      900:  { slidesPerView: 3,   spaceBetween: 24 },
      1200: { slidesPerView: 4,   spaceBetween: 24 },
    },
  };

  new Swiper('#bestSwiper', {
    ...productCommon,
    pagination: { el: '#bestSwiper .swiper-pagination', clickable: true },
    navigation: {
      nextEl: '#bestSwiper .swiper-button-next',
      prevEl: '#bestSwiper .swiper-button-prev',
    },
  });

  new Swiper('#newSwiper', {
    ...productCommon,
    pagination: { el: '#newSwiper .swiper-pagination', clickable: true },
    navigation: {
      nextEl: '#newSwiper .swiper-button-next',
      prevEl: '#newSwiper .swiper-button-prev',
    },
  });

  /* ---------- 5. Reviews: duplicate tracks for seamless vertical loop ---------- */
  document.querySelectorAll('.review-col__track').forEach(track => {
    const copy = track.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    track.parentElement.appendChild(copy);
  });

  /* ---------- 6. Fade-up on scroll ---------- */
  const fadeTargets = document.querySelectorAll(
    '.section-header, .vip-card, .product-card, .curation-item, .philosophy__block, .hero__copy, .hero__awards'
  );
  fadeTargets.forEach(el => el.classList.add('fade-up'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeTargets.forEach(el => io.observe(el));

  /* ---------- 7. Inquiry modal ---------- */
  const modal = document.getElementById('inquiryModal');
  const form  = document.getElementById('inquiryForm');
  const toast = document.getElementById('inquiryToast');

  if (modal && form && toast) {
    const views = modal.querySelectorAll('[data-view]');
    const fields = form.querySelectorAll('.inquiry-form__field');
    let lastFocus = null;
    let toastTimer = null;

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRe = /^[0-9\-+\s()]{7,20}$/;

    const showView = (name) => {
      views.forEach(v => { v.hidden = v.dataset.view !== name; });
    };

    const clearErrors = () => {
      fields.forEach(f => {
        f.classList.remove('is-invalid');
        const msg = f.querySelector('.inquiry-form__error');
        if (msg) msg.textContent = '';
      });
    };

    const setError = (fieldName, message) => {
      const input = form.querySelector(`[name="${fieldName}"]`);
      if (!input) return;
      const field = input.closest('.inquiry-form__field');
      field.classList.add('is-invalid');
      const msg = field.querySelector('.inquiry-form__error');
      if (msg) msg.textContent = message;
    };

    const validate = (data) => {
      const errors = {};
      if (!data.name) errors.name = '이름을 입력해 주세요.';
      if (!data.contact) errors.contact = '연락처 또는 이메일을 입력해 주세요.';
      else if (!phoneRe.test(data.contact) && !emailRe.test(data.contact))
        errors.contact = '전화번호 또는 이메일 형식으로 입력해 주세요.';
      if (!data.message) errors.message = '문의 내용을 입력해 주세요.';
      else if (data.message.length < 5) errors.message = '문의 내용을 5자 이상 적어주세요.';
      return errors;
    };

    const getFocusable = () =>
      modal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled])'
      );

    const onKey = (e) => {
      if (e.key === 'Escape') { closeInquiry(); return; }
      if (e.key !== 'Tab') return;
      const focusable = Array.from(getFocusable()).filter(el => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    };

    const openInquiry = () => {
      lastFocus = document.activeElement;
      modal.hidden = false;
      modal.classList.add('is-open');
      document.body.classList.add('inquiry-open');
      document.body.style.overflow = 'hidden';
      showView('form');
      clearErrors();
      setTimeout(() => form.querySelector('input[name="name"]')?.focus(), 0);
      document.addEventListener('keydown', onKey);
    };

    const closeInquiry = () => {
      modal.classList.remove('is-open');
      modal.hidden = true;
      document.body.classList.remove('inquiry-open');
      document.body.style.overflow = '';
      form.reset();
      clearErrors();
      document.removeEventListener('keydown', onKey);
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    };

    const showToast = () => {
      toast.hidden = false;
      requestAnimationFrame(() => toast.classList.add('is-visible'));
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('is-visible');
        setTimeout(() => { toast.hidden = true; }, 300);
      }, 3500);
    };

    document.querySelectorAll('[data-inquiry-open]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openInquiry();
      });
    });

    modal.querySelectorAll('[data-close]').forEach(el => {
      el.addEventListener('click', closeInquiry);
    });

    form.addEventListener('input', (e) => {
      const field = e.target.closest('.inquiry-form__field');
      if (field && field.classList.contains('is-invalid')) {
        field.classList.remove('is-invalid');
        const msg = field.querySelector('.inquiry-form__error');
        if (msg) msg.textContent = '';
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();
      const fd = new FormData(form);
      const data = {
        name:    (fd.get('name')    || '').trim(),
        contact: (fd.get('contact') || '').trim(),
        message: (fd.get('message') || '').trim(),
      };
      const errors = validate(data);
      const keys = Object.keys(errors);
      if (keys.length) {
        keys.forEach(k => setError(k, errors[k]));
        form.querySelector(`[name="${keys[0]}"]`)?.focus();
        return;
      }

      try {
        const store = JSON.parse(localStorage.getItem('pv_inquiries') || '[]');
        store.push({ ...data, submittedAt: new Date().toISOString() });
        localStorage.setItem('pv_inquiries', JSON.stringify(store));
      } catch (_) { /* storage unavailable — still show success */ }

      showView('success');
      showToast();
      modal.querySelector('[data-view="success"] [data-close]')?.focus();
    });
  }
});

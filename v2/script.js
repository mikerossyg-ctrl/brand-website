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

  /* ---------- 5. Review slider ---------- */
  new Swiper('.review-swiper', {
    loop: true,
    autoplay: { delay: 6000, disableOnInteraction: false },
    spaceBetween: 24,
    slidesPerView: 1.1,
    centeredSlides: false,
    breakpoints: {
      640:  { slidesPerView: 2, spaceBetween: 24 },
      1024: { slidesPerView: 3, spaceBetween: 28 },
    },
    pagination: { el: '.review-swiper .swiper-pagination', clickable: true },
  });

  /* ---------- 6. Fade-up on scroll ---------- */
  const fadeTargets = document.querySelectorAll(
    '.section-header, .vip-card, .product-card, .curation-item, .review, .philosophy__block, .hero__copy, .hero__awards'
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
});

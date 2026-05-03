/*
 * navbar.js — Willship International Clone
 * Comportements navbar : sticky scroll, burger menu, dropdowns mobile
 */

(function () {
  'use strict';

  const navbar  = document.getElementById('navbar');
  const burger  = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  /* ─── Sticky scroll ─── */

  function handleScroll() {
    if (!navbar) return;
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ─── Burger menu toggle ─── */

  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.toggle('open');
      burger.classList.toggle('active', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  /* ─── Fermer menu mobile si click extérieur ─── */

  document.addEventListener('click', function (e) {
    if (!navbar) return;
    if (!navbar.contains(e.target)) {
      closeMobileMenu();
    }
  });

  function closeMobileMenu() {
    if (!mobileMenu || !burger) return;
    mobileMenu.classList.remove('open');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* ─── Dropdowns mobile (accordéon) ─── */

  const mobileToggles = document.querySelectorAll('.mobile-toggle');

  mobileToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('data-target');
      const target   = document.getElementById(targetId);
      const chevron  = this.querySelector('.chevron-toggle');
      const isOpen   = target.classList.contains('open');

      // Fermer tous les autres dropdowns ouverts
      document.querySelectorAll('.mobile-dropdown.open').forEach(function (el) {
        el.classList.remove('open');
      });
      document.querySelectorAll('.chevron-toggle.open').forEach(function (el) {
        el.classList.remove('open');
      });
      document.querySelectorAll('.mobile-toggle').forEach(function (el) {
        el.setAttribute('aria-expanded', 'false');
      });

      // Toggle le dropdown ciblé
      if (!isOpen) {
        target.classList.add('open');
        if (chevron) chevron.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ─── Fermer menu mobile sur resize desktop ─── */

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) {
      closeMobileMenu();
    }
  });

  /* ─── Active link highlighting ─── */

  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-link, .mobile-nav-link, .mobile-dropdown-link');

  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href.replace('../', '/').replace('.html', ''))) {
      link.classList.add('active');
    }
  });

})();

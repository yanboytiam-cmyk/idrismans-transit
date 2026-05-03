/*
 * animations.js — Willship International Clone
 * Intersection Observer pour animations au scroll (data-aos)
 * Compteurs animés pour les statistiques
 */

(function () {
  'use strict';

  /* ─── Scroll animations (AOS-like) ─── */

  function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-aos]');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-aos-delay') || 0;
            setTimeout(function () {
              entry.target.classList.add('aos-animate');
            }, parseInt(delay));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ─── Compteurs animés ─── */

  function animateCounter(el, target, duration) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);
      el.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-counter'));
            animateCounter(entry.target, target, 2000);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ─── FAQ Accordéon ─── */

  function initAccordion() {
    const triggers = document.querySelectorAll('.accordion-trigger');

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        const item    = this.closest('.accordion-item');
        const content = item.querySelector('.accordion-content');
        const chevron = this.querySelector('.chevron-toggle');
        const isOpen  = content.classList.contains('open');

        // Fermer tous les autres
        document.querySelectorAll('.accordion-content.open').forEach(function (el) {
          el.classList.remove('open');
          el.closest('.accordion-item').querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
          const ch = el.closest('.accordion-item').querySelector('.chevron-toggle');
          if (ch) ch.classList.remove('open');
        });

        if (!isOpen) {
          content.classList.add('open');
          this.setAttribute('aria-expanded', 'true');
          if (chevron) chevron.classList.add('open');
        }
      });
    });
  }

  /* ─── Smooth scroll for anchor links ─── */

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navbarHeight = document.getElementById('navbar')
            ? document.getElementById('navbar').offsetHeight
            : 80;
          const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ─── Init on DOM ready ─── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initScrollAnimations();
    initCounters();
    initAccordion();
    initSmoothScroll();
  }

})();

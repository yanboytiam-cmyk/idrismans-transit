/*
 * forms.js — Willship International Clone
 * Validation et soumission des formulaires de contact
 */

(function () {
  'use strict';

  /* ─── Validation des champs ─── */

  function validateField(field) {
    const value   = field.value.trim();
    const type    = field.type;
    const name    = field.name;
    const required = field.hasAttribute('required');
    let valid = true;
    let message = '';

    if (required && !value) {
      valid = false;
      message = 'This field is required.';
    } else if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        valid = false;
        message = 'Please enter a valid email address.';
      }
    } else if (type === 'tel' && value) {
      const telRegex = /^[\+]?[\d\s\-\(\)]{6,20}$/;
      if (!telRegex.test(value)) {
        valid = false;
        message = 'Please enter a valid phone number.';
      }
    }

    setFieldState(field, valid, message);
    return valid;
  }

  function setFieldState(field, valid, message) {
    const feedback = field.parentElement.querySelector('.form-feedback');

    field.classList.remove('is-valid', 'is-invalid');
    field.classList.add(valid ? 'is-valid' : 'is-invalid');

    if (feedback) {
      feedback.textContent = message;
      feedback.className = 'form-feedback ' + (valid ? 'form-feedback--success' : 'form-feedback--error');
    }
  }

  /* ─── Initialiser formulaires ─── */

  function initForms() {
    const forms = document.querySelectorAll('.form[data-validate]');

    forms.forEach(function (form) {
      const fields = form.querySelectorAll('input, textarea, select');
      const submitBtn = form.querySelector('[type="submit"]');
      const successMsg = form.querySelector('.form-success-message');

      // Validation en temps réel au blur
      fields.forEach(function (field) {
        field.addEventListener('blur', function () {
          validateField(this);
        });
        field.addEventListener('input', function () {
          if (this.classList.contains('is-invalid')) {
            validateField(this);
          }
        });
      });

      // Soumission
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        let allValid = true;
        fields.forEach(function (field) {
          if (!validateField(field)) {
            allValid = false;
          }
        });

        if (!allValid) return;

        if (submitBtn) {
          const originalText = submitBtn.textContent;
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="spinner"></span> Envoi en cours…';
          
          form.submit();
        }
      });
    });
  }

  /* ─── Init ─── */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForms);
  } else {
    initForms();
  }

})();

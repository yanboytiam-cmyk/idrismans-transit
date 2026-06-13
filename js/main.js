/*
 * main.js — IdrisMans Transit
 * Initialisation globale et utilitaires partagés
 */

(function () {
  'use strict';

  /* ─── Lazy loading images natives ─── */

  function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) return; // Support natif

    const images = document.querySelectorAll('img[loading="lazy"]');
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    images.forEach(function (img) {
      observer.observe(img);
    });
  }

  /* ─── Scroll to top button ─── */

  function initScrollTop() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      btn.style.opacity = window.scrollY > 400 ? '1' : '0';
      btn.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── Bandeau de consentement cookies (RGPD) ─── */

  function initCookieBanner() {
    var STORAGE_KEY = 'idm_cookie_consent';
    if (localStorage.getItem(STORAGE_KEY)) return; // choix déjà fait

    // Lien vers la politique de confidentialité, relatif à la profondeur de la page
    var privacyHref = location.pathname.indexOf('/pages/') !== -1 ? 'privacy.html' : 'pages/privacy.html';

    // Styles (injectés une seule fois)
    if (!document.getElementById('idmCookieStyles')) {
      var style = document.createElement('style');
      style.id = 'idmCookieStyles';
      style.textContent =
        '.idm-cookie{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:9998;' +
        'width:min(960px,calc(100% - 32px));background:#1a2b3c;color:#fff;border-radius:12px;' +
        'box-shadow:0 12px 40px rgba(0,0,0,.35);padding:18px 22px;display:flex;gap:18px;' +
        'align-items:center;justify-content:space-between;flex-wrap:wrap;font-size:14px;line-height:1.5}' +
        '.idm-cookie__text{margin:0;flex:1 1 320px}' +
        '.idm-cookie__actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap}' +
        '.idm-cookie__link{color:#9ec5ff;text-decoration:underline;white-space:nowrap}' +
        '.idm-cookie__btn{border:0;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit}' +
        '.idm-cookie__btn--ghost{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.4)}' +
        '.idm-cookie__btn--primary{background:#1a5f9e;color:#fff}' +
        '.idm-cookie__btn--primary:hover{background:#134a7c}' +
        '@media(max-width:600px){.idm-cookie{flex-direction:column;align-items:stretch}.idm-cookie__actions{justify-content:flex-end}}';
      document.head.appendChild(style);
    }

    var banner = document.createElement('div');
    banner.className = 'idm-cookie';
    banner.id = 'idmCookie';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.innerHTML =
      '<p class="idm-cookie__text" data-i18n="cookie.message">Nous utilisons des cookies pour améliorer votre expérience et mesurer l\'audience du site. Vous pouvez les accepter ou les refuser.</p>' +
      '<div class="idm-cookie__actions">' +
        '<a href="' + privacyHref + '" class="idm-cookie__link" data-i18n="cookie.learn">En savoir plus</a>' +
        '<button type="button" class="idm-cookie__btn idm-cookie__btn--ghost" id="idmCookieRefuse" data-i18n="cookie.refuse">Refuser</button>' +
        '<button type="button" class="idm-cookie__btn idm-cookie__btn--primary" id="idmCookieAccept" data-i18n="cookie.accept">Tout accepter</button>' +
      '</div>';
    document.body.appendChild(banner);

    function choose(value) {
      try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
      banner.remove();
      // Aucun script de suivi n'est chargé tant que le consentement n'est pas « accepted ».
      // Brancher ici l'activation des outils d'analyse (ex. Matomo/GA) si value === 'accepted'.
    }
    document.getElementById('idmCookieAccept').addEventListener('click', function () { choose('accepted'); });
    document.getElementById('idmCookieRefuse').addEventListener('click', function () { choose('declined'); });
  }

  /* ─── Init ─── */

  /* ─── Modale "Demander un devis" (envoi vers le Google Form du client) ─── */

  function initQuoteModal() {
    var ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLScJ0Ycl4Bf21A5516kVbrJtle5YDSL-AKroEOvhl67LUqVhsw/formResponse';
    var SERVICES = [
      'FCL - Conteneur complet / Full Container Load Import / Export',
      'LCL - Groupage Maritime / Less than a Container Load (Grouping )  Import / Export',
      'Services de dédouanement / Customs clearance service',
      'Transport National et International  de véhicules (Voiture , Camion , Moto ...) / Vehicles transportation',
      'Déménagement complet / Move',
      'Transport terrestre (Groupage / Land transportation (Grouping )',
      'Location camion avec chauffeur / Van and Truck Rental with driver',
      'Transport Maritime Roulier de véhicules RORO - Roll-On / Roll-Off',
      'Fret Exceptionnel ou hors gabarit/ Out of Gauge Cargo Transport',
      'Transport Maritime de bateaux, yachts/ Yacht And Boat Shipping',
      'Transport de fret aérien/ International Air Freight',
      'Cartons de déménagement / Moving boxes',
      'Transport Maritime Grand et lourd cargo / Break bulk Large & Heavy Cargo',
      'Logistics services',
      "Certificat provisoire d'immatriculation WW (CPI) / Provisional Gray Card"
    ];
    function t(k) { return (window.IdrisMansI18n && window.IdrisMansI18n.t) ? window.IdrisMansI18n.t(k) : k; }

    if (!document.getElementById('quoteModalStyles')) {
      var st = document.createElement('style');
      st.id = 'quoteModalStyles';
      st.textContent =
        '.qm-overlay{position:fixed;inset:0;z-index:10000;display:none;background:rgba(10,22,40,.7)}' +
        '.qm-overlay.open{display:block}' +
        '.qm-dialog{position:absolute;inset:0;background:#fff;display:flex;flex-direction:column;overflow:hidden}' +
        '.qm-head{flex:0 0 auto;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:16px 18px;background:var(--color-primary,#1a5f9e);color:#fff}' +
        '.qm-head h2{margin:0;font-size:1.15rem;line-height:1.2;font-family:var(--font-heading,inherit)}' +
        '.qm-head p{margin:3px 0 0;font-size:.8rem;opacity:.9}' +
        '.qm-close{background:transparent;border:0;color:#fff;font-size:2rem;line-height:1;cursor:pointer;padding:0 6px}' +
        '.qm-body{flex:1 1 auto;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:18px}' +
        '.qm-intro{font-size:.9rem;color:#475563;line-height:1.6;white-space:pre-line;background:#f3f6fa;border-radius:10px;padding:14px 16px;margin-bottom:18px}' +
        '.qm-info{font-size:.9rem;color:#33414f;line-height:1.6;white-space:pre-line;border-left:3px solid var(--color-primary,#1a5f9e);background:#f7f9fc;border-radius:8px;padding:12px 14px;margin:16px 0}' +
        '.qm-info a{color:var(--color-primary,#1a5f9e);font-weight:600;word-break:break-all}' +
        '.qm-info img{max-width:130px;height:auto;display:block;margin-bottom:10px}' +
        '.qm-field{margin-bottom:18px}' +
        '.qm-field>label{display:block;font-size:.95rem;font-weight:600;color:#1a2b3c;margin-bottom:8px;line-height:1.45;white-space:pre-line}' +
        '.qm-field .req{color:#d4380d}' +
        '.qm-field input,.qm-field select,.qm-field textarea{width:100%;border:1px solid #cdd6e0;border-radius:10px;padding:13px 14px;font-size:16px;font-family:inherit;color:#1a2b3c;background:#fff;box-sizing:border-box}' +
        '.qm-field textarea{min-height:90px;resize:vertical}' +
        '.qm-field input:focus,.qm-field select:focus,.qm-field textarea:focus{outline:none;border-color:var(--color-primary,#1a5f9e);box-shadow:0 0 0 3px rgba(26,95,158,.15)}' +
        '.qm-note{font-size:.82rem;color:#7a8694;margin-top:6px;line-height:1.5;white-space:pre-line}' +
        '.qm-radios{display:flex;flex-direction:column;gap:10px}' +
        '.qm-radio{border:1px solid #cdd6e0;border-radius:10px;padding:14px;cursor:pointer;font-size:1rem;display:flex;align-items:center;gap:10px}' +
        '.qm-radio input{width:20px;height:20px;margin:0;flex:0 0 auto}' +
        '.qm-submit{width:100%;background:var(--color-primary,#1a5f9e);color:#fff;border:0;border-radius:10px;padding:15px;font-weight:700;font-size:1.05rem;cursor:pointer;margin-top:8px;font-family:inherit}' +
        '.qm-submit:disabled{opacity:.7;cursor:default}' +
        '.qm-success{text-align:center;padding:48px 16px}' +
        '.qm-success i{font-size:3rem;color:#3aa657}' +
        '.qm-success h3{margin:16px 0 10px;color:var(--color-heading,#0a1628)}' +
        '.qm-success p{color:#56616e;line-height:1.7}' +
        '@media(min-width:640px){.qm-overlay.open{display:flex;align-items:flex-start;justify-content:center;padding:24px 16px;overflow-y:auto}' +
        '.qm-dialog{position:relative;inset:auto;max-width:660px;width:100%;margin:auto;border-radius:16px;max-height:92vh;box-shadow:0 24px 60px rgba(0,0,0,.4)}' +
        '.qm-head h2{font-size:1.3rem}.qm-radios{flex-direction:row}.qm-radio{flex:1 1 0}}';
      document.head.appendChild(st);
    }

    var reqStar = ' <span class="req">*</span>';
    var base = location.pathname.indexOf('/pages/') !== -1 ? '../' : '';
    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    var INTRO = `Chère clientèle,

Merci de l'intérêt que vous portez à IdrisMans Transit. Pour en savoir plus sur la manière dont nous pouvons vous accompagner dans vos besoins en courtage en douane, conseil commercial, gestion du commerce mondial ou expédition de fret international, veuillez remplir le formulaire ci-dessous. Un représentant d'IdrisMans vous contactera sous peu.

Pour toute demande urgente ou question particulière, n'hésitez pas à nous contacter par téléphone. Nous serons heureux de vous servir et de vous apporter entière satisfaction.

---

Dear Valued Customers,

Thank you for your interest in IdrisMans Transit. To learn more about how we can assist you with your customs brokerage, trade consulting, global trade management, or international freight forwarding needs, please complete the following form, and a representative from IdrisMans will contact you shortly.

For any urgent inquiries or specific questions, please feel free to contact us by phone. We will be happy to assist you and ensure your complete satisfaction.

👉📲 Chattez avec nous | Chat with us on 👉Whatsapp | 👉 Telegram
👉📲 Phone: +33695724985
👉 E-mail us 📧 contact[@]idrismans.com
👉 www.idrismans.com
👉 Blogspot
👉 facebook/IdrisMansTransport

- Nous vous remercions d'avoir choisi notre compagnie.
- Thank you for choosing our company and trusting us.
- 感谢您选择我们公司并信任我们
شكرا لكم لاختيار شركتنا والوثوق بنا

歡迎 | مرحبا | Marhaban | Welcome | Bienvenue | Bruchim Habaim
Made In France 🇫🇷 Since 2011`;

    var RORO = `Nous vous proposons nos services maritime roulants Roll-on/Roll-off pour toutes destinations et pour toutes cargaisons motorisées ou statiques / We offer you our rolling maritime services Roll-on / Roll-off for all destinations and for all motorized or static cargo.`;

    var SLOGAN = `Don't Ship Without IdrisMans | We Deliver And Connect The World 🌍
- IdrisMans Ocean, Air, Rail & Road Freight | Customs Clearance & Logistics | International Trade Management.
- IdrisMans Transit – Transport Maritime, Aérien, Ferroviaire & Routier | Dédouanement & Logistique | International Trade Management.`;

    var COMMENTS = `Vos commentaires et contacts. Nous vous prions de bien vouloir nous envoyer le plus d'informations possibles, le type de marchandise, le model exact si c'est un véhicule, un bateau ou un engin, le volume, les dimensions et poids. Afin de vous garantir une réponse rapide et un devis adapté à vos besoin. Nous serons heureux de vous servir afin de vous donner satisfaction.

Your comments and contacts. We kindly ask you to send us as much information as possible :
1. the type of goods or Customs code (HS),
2. the exact model if it is a vehicle, a boat or a machine,
3. the volume how many cubic meters (feet cubic),
4. the dimensions and weight.
In order to guarantee you a rapid response and a quote adapted to your needs. We will be happy to serve you in order to ensure your utmost satisfaction.`;

    var overlay = document.createElement('div');
    overlay.className = 'qm-overlay';
    overlay.id = 'quoteModal';
    overlay.innerHTML =
      '<div class="qm-dialog" role="dialog" aria-modal="true" aria-labelledby="qmTitle">' +
        '<div class="qm-head"><div><h2 id="qmTitle" data-i18n="quote.title">Demande de devis / Request a Quote</h2>' +
        '<p data-i18n="quote.subtitle">Formulaire de demande de devis</p></div>' +
        '<button class="qm-close" type="button" data-qm-close aria-label="Fermer / Close" data-i18n-aria="quote.close">&times;</button></div>' +
        '<div class="qm-body"><form id="qmForm" novalidate>' +
          '<div class="qm-intro">' + esc(INTRO) + '</div>' +
          '<div class="qm-field"><label>Vous êtes / You are' + reqStar + '</label>' +
            '<div class="qm-radios">' +
              '<label class="qm-radio"><input type="radio" name="entry.1411603373" value="Professionnel / Professional" required> Professionnel / Professional</label>' +
              '<label class="qm-radio"><input type="radio" name="entry.1411603373" value="Particulier/ Private"> Particulier / Private</label>' +
            '</div></div>' +
          '<div class="qm-field"><label>Votre Nom ou Société / Your Name or Company' + reqStar + '</label><input type="text" name="entry.2052266147" required></div>' +
          '<div class="qm-field"><label>Votre numéro de téléphone / Your phone number' + reqStar + '</label><input type="tel" name="entry.1500677191" required>' +
            '<p class="qm-note">Vous pouvez vous inscrire sur le site internet bloctel.gouv.fr\nArticle L.223-2 du Code de la consommation.</p></div>' +
          '<div class="qm-field"><label>Type d\'objet à transporter ou Service / Type of Service' + reqStar + '</label>' +
            '<select id="qmService" name="entry.170844922" required></select></div>' +
          '<div class="qm-info">' + esc(RORO) + '</div>' +
          '<div class="qm-info"><img src="' + base + 'logo.png" alt="IdrisMans Transit">' + esc(SLOGAN) + '\n<a href="https://www.idrismans.com/" target="_blank" rel="noopener">https://www.idrismans.com/</a></div>' +
          '<div class="qm-field"><label>Adresse de chargement / Loading address' + reqStar + '</label><textarea name="entry.628206381" required></textarea></div>' +
          '<div class="qm-field"><label>Adresse de livraison / Delivery address' + reqStar + '</label><textarea name="entry.1792187518" required></textarea></div>' +
          '<div class="qm-field"><label>' + esc(COMMENTS) + '</label><textarea name="entry.1756974394"></textarea></div>' +
          '<div class="qm-field"><label>Chargement : Nombre d\'étages ou contrainte spécifique / Loading: Number of floors or specific constraint' + reqStar + '</label><textarea name="entry.1400259700" required></textarea></div>' +
          '<div class="qm-field"><label>Livraison : Nombre d\'étages ou contrainte spécifique / Delivery: Number of floors or specific constraint' + reqStar + '</label><textarea name="entry.330913193" required></textarea></div>' +
          '<button type="submit" id="qmSubmit" class="qm-submit" data-i18n="quote.submit">Envoyer ma demande / Send</button>' +
        '</form></div>' +
      '</div>';
    document.body.appendChild(overlay);

    // options du select (valeurs = chaînes EXACTES du Google Form ; placeholder traduit)
    var sel = overlay.querySelector('#qmService');
    var ph = document.createElement('option');
    ph.value = ''; ph.disabled = true; ph.selected = true;
    ph.setAttribute('data-i18n', 'quote.select_ph'); ph.textContent = '— Sélectionnez —';
    sel.appendChild(ph);
    SERVICES.forEach(function (s) {
      var o = document.createElement('option'); o.value = s; o.textContent = s; sel.appendChild(o);
    });

    var form = overlay.querySelector('#qmForm');
    var body = overlay.querySelector('.qm-body');

    function open() { overlay.classList.add('open'); document.documentElement.style.overflow = 'hidden'; }
    function close() { overlay.classList.remove('open'); document.documentElement.style.overflow = ''; }

    // tague tous les boutons "Devis" du site
    ['nav.quote', 'mobile.quote', 'why.cta', 'services.automotive_quote', 'footer.get_quote'].forEach(function (k) {
      document.querySelectorAll('[data-i18n="' + k + '"]').forEach(function (el) { el.setAttribute('data-quote-trigger', ''); });
    });

    document.addEventListener('click', function (e) {
      var trig = e.target.closest('[data-quote-trigger]');
      if (trig) { e.preventDefault(); open(); return; }
      if (e.target.closest('[data-qm-close]') || e.target === overlay) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var btn = overlay.querySelector('#qmSubmit');
      btn.disabled = true; btn.textContent = t('quote.sending');
      var params = new URLSearchParams();
      var names = ['entry.1411603373', 'entry.170844922', 'entry.2052266147', 'entry.1500677191',
        'entry.628206381', 'entry.1792187518', 'entry.1756974394', 'entry.1400259700', 'entry.330913193'];
      names.forEach(function (n) {
        var el = form.elements[n];
        if (el) params.append(n, el.value || '');
      });
      fetch(ACTION, { method: 'POST', mode: 'no-cors', body: params })
        .then(function () { showSuccess(); })
        .catch(function () { showSuccess(); }); // réponse opaque (no-cors) : on considère l'envoi parti
    });

    function showSuccess() {
      body.innerHTML = '<div class="qm-success"><i class="fa-solid fa-circle-check" aria-hidden="true"></i>' +
        '<h3>' + t('quote.success_title') + '</h3><p>' + t('quote.success_msg') + '</p></div>';
    }
  }

  function init() {
    initLazyLoading();
    initScrollTop();
    initCookieBanner();
    initQuoteModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

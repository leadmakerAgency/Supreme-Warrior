(function () {
  'use strict';

  var STORAGE_KEY = 'sw_cookie_notice';
  var CONSENT_VERSION = '1';

  function hasAccepted() {
    try {
      return localStorage.getItem(STORAGE_KEY) === CONSENT_VERSION;
    } catch (e) {
      return false;
    }
  }

  function acceptNotice() {
    try {
      localStorage.setItem(STORAGE_KEY, CONSENT_VERSION);
    } catch (e) {
      /* storage unavailable */
    }

    document.dispatchEvent(new CustomEvent('sw:cookie-notice-accepted'));
    window.SW_COOKIE = { accepted: true, version: CONSENT_VERSION };
  }

  function removeBanner(banner) {
    if (!banner || !banner.parentNode) return;
    banner.classList.remove('is-visible');
    window.setTimeout(function () {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 280);
  }

  function handleAccept(banner) {
    acceptNotice();
    removeBanner(banner);
  }

  function createBanner() {
    var banner = document.createElement('div');
    banner.className = 'sw-cookie-notice';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie notice');
    banner.setAttribute('aria-live', 'polite');

    banner.innerHTML =
      '<p class="sw-cookie-notice__title">Cookie notice</p>' +
      '<p class="sw-cookie-notice__text">We use essential cookies and similar technologies to run this site and remember your preferences. ' +
      '<a href="/privacy-policy.html">Privacy Policy</a></p>' +
      '<button type="button" class="sw-cookie-notice__btn">Accept</button>';

    var acceptBtn = banner.querySelector('.sw-cookie-notice__btn');

    acceptBtn.addEventListener('click', function () {
      handleAccept(banner);
    });

    banner.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        handleAccept(banner);
      }
    });

    document.body.appendChild(banner);

    window.requestAnimationFrame(function () {
      banner.classList.add('is-visible');
      acceptBtn.focus();
    });
  }

  window.SW_COOKIE = {
    accepted: hasAccepted(),
    version: CONSENT_VERSION,
  };

  if (!hasAccepted()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createBanner);
    } else {
      createBanner();
    }
  }
})();

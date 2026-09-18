(function () {
  'use strict';

  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqpkbezo';

  function getErrorMessage(err) {
    if (err && err.errors && err.errors.length) {
      return err.errors.map(function (e) {
        return e.message;
      }).join(' ');
    }
    return 'Something went wrong sending your request. Please try again or contact us directly.';
  }

  window.submitSupremeForm = function (form, successUrl) {
    var box = document.getElementById('formError');
    var btn = form.querySelector('button[type="submit"]');

    if (btn) btn.disabled = true;
    if (box) box.classList.remove('show');

    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    })
      .then(function (response) {
        if (response.ok) {
          window.location.href = successUrl;
          return;
        }
        return response.json().then(function (data) {
          throw data;
        });
      })
      .catch(function (err) {
        if (btn) btn.disabled = false;
        if (box) {
          box.textContent = getErrorMessage(err);
          box.classList.add('show');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  };
})();

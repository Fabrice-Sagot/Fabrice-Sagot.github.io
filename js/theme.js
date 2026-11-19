/* Gestion du thème clair / sombre.
 * Principe : le <script> dans <head> de index.html applique déjà data-theme AVANT
 * le premier rendu (pas de flash blanc). Ce fichier gère ensuite le bouton :
 * clic -> bascule -> sauvegarde du choix dans localStorage ("cv-theme").
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  function isDark() {
    return root.dataset.theme === 'dark';
  }

  function syncButton() {
    var pressed = isDark() ? 'true' : 'false';
    toggle.setAttribute('aria-pressed', pressed);
    var label = toggle.querySelector('.toggle-label');
    if (label) label.textContent = isDark() ? 'Mode clair' : 'Mode sombre';
  }

  toggle.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('cv-theme', next); } catch (e) { /* stockage indisponible : on ignore */ }
    syncButton();
  });

  /* Si l'utilisateur n'a jamais fait de choix manuel, on suit le système
   * même s'il change de préférence pendant la navigation (best practice). */
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function (e) {
      var saved = null;
      try { saved = localStorage.getItem('cv-theme'); } catch (err) {}
      if (!saved) {
        root.dataset.theme = e.matches ? 'dark' : 'light';
        syncButton();
      }
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  var printBtn = document.getElementById('print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', function () { window.print(); });
  }

  syncButton();
})();

// Always open the page at the top, also after reload or with an old #anchor in the URL
(function () {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  function top() { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }
  top();
  window.addEventListener('load', top);
  window.addEventListener('pageshow', function (e) { if (e.persisted) top(); });
})();

// Tour switch: map tabs, day-by-day panels, "Tag für Tag" links
(function () {
  function show(tour) {
    document.querySelectorAll('.tabs button').forEach(function (b) {
      b.setAttribute('aria-selected', String(b.dataset.tour === tour));
    });
    document.querySelectorAll('.days-panel').forEach(function (el) {
      el.hidden = el.dataset.tour !== tour;
    });
    document.querySelectorAll('.route-line').forEach(function (el) {
      el.style.display = el.dataset.tour === tour ? '' : 'none';
    });
    document.querySelectorAll('.places > g').forEach(function (g) {
      var s = g.dataset.show;
      g.style.display = (s === 'both' || s === tour) ? '' : 'none';
    });
  }
  document.querySelectorAll('.tabs button').forEach(function (b) {
    b.addEventListener('click', function () { show(b.dataset.tour); });
  });
  document.querySelectorAll('a[data-tour]').forEach(function (a) {
    a.addEventListener('click', function () { show(a.dataset.tour); });
  });
  show('atlantico');

  var form = document.getElementById('interest');
  document.querySelectorAll('a[data-rental]').forEach(function (a) {
    a.addEventListener('click', function () {
      var sel = form && form.querySelector('select[name="tour"]');
      if (!sel) return;
      Array.prototype.forEach.call(sel.options, function (o) {
        if (o.text.indexOf('mieten') !== -1) sel.value = o.value || o.text;
      });
    });
  });
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.querySelector('.form-msg').hidden = false;
  });
})();

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
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.querySelector('.form-msg').hidden = false;
  });
})();

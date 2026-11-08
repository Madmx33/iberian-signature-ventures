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
  var tourSel = form && form.querySelector('select[name="tour"]');
  var terminSel = form && form.querySelector('select[name="termin"]');
  // Termine aus der Terminliste lesen: [{tour, id, label}]
  var termine = [];
  document.querySelectorAll('.dates-year').forEach(function (block) {
    var m = (block.querySelector('h3') || {}).textContent.match(/\d{4}/);
    var year = m ? m[0] : '';
    block.querySelectorAll('.dates-list li').forEach(function (li, i) {
      var a = li.querySelector('a[data-tour]');
      var d = li.querySelector('.date');
      if (!a || !d) return;
      var t = { tour: a.dataset.tour, id: year + '-' + i, label: d.textContent.trim() + ' ' + year };
      termine.push(t);
      var book = document.createElement('a');
      book.href = '#anfrage';
      book.className = 'date-book';
      book.textContent = 'Vormerken';
      book.addEventListener('click', function () { setTour(t.tour, t.id); });
      li.querySelector('.date-tour').appendChild(book);
    });
  });
  function setTour(tour, id) {
    if (!tourSel) return;
    tourSel.value = tour;
    fillTermine();
    if (id) terminSel.value = id;
  }
  function fillTermine() {
    var tour = tourSel.value;
    terminSel.length = 1;
    termine.forEach(function (t) {
      if (tour !== 'offen' && t.tour !== tour) return;
      var name = t.tour === 'vuelta' ? 'Gran Vuelta' : 'Atlántica';
      terminSel.add(new Option(tour === 'offen' ? t.label + ' · ' + name : t.label, t.id));
    });
    var miete = tour === 'mieten';
    form.querySelector('.form-termin').hidden = miete;
    form.querySelectorAll('.form-miete').forEach(function (l) { l.hidden = !miete; });
  }
  if (tourSel) {
    tourSel.addEventListener('change', function () { fillTermine(); });
    fillTermine();
  }
  document.querySelectorAll('a[data-rental]').forEach(function (a) {
    a.addEventListener('click', function () { setTour('mieten'); });
  });
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = form.querySelector('.form-msg');
    var was = tourSel.options[tourSel.selectedIndex].text.split(' · ')[0];
    var wann = '';
    if (tourSel.value === 'mieten') {
      var v = form.miete_von.value, b = form.miete_bis.value;
      var fmt = function (x) { var p = x.split('-'); return p[2] + '.' + p[1] + '.' + p[0]; };
      if (v && b) wann = ', ' + fmt(v) + ' bis ' + fmt(b);
    } else if (terminSel.value) {
      wann = ', ' + terminSel.options[terminSel.selectedIndex].text;
    }
    msg.textContent = 'Danke! Vorgemerkt: ' + was + wann + '. Dies ist ein Prototyp, Ihre Angaben wurden nicht gesendet.';
    msg.hidden = false;
  });
})();

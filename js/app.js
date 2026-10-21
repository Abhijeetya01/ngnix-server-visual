(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var C = { blue: '#4da3ff', teal: '#2dd4bf', gold: '#f5b73a', purple: '#a78bfa', red: '#ff6b6b', green: '#4ade80', grey: '#cbd5e1' };
  var svg = document.getElementById('diagram');
  function el(tag, attrs, parent, text) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  var layers = {}, groups = [];
  ['wires', 'boxes', 'packets'].forEach(function (n) { layers[n] = { g: el('g', {}, svg), steps: {} }; });
  function g(layer, step) {
    var L = layers[layer];
    if (!L.steps[step]) { L.steps[step] = el('g', { 'class': 'st' }, L.g); L.steps[step].dataset.step = step; groups.push(L.steps[step]); }
    return L.steps[step];
  }
  function label(step, x, y, txt, col, size, anchor, bold) {
    el('text', { x: x, y: y, 'text-anchor': anchor || 'start', 'font-size': size || 11, 'font-weight': bold ? 700 : 600, fill: col || '#e8eefc' }, g('boxes', step), txt);
  }
  function box(step, x, y, w, h, col, o) {
    o = o || {};
    var p = g('boxes', step);
    el('rect', { x: x, y: y, width: w, height: h, rx: o.r || 8, fill: col, 'fill-opacity': o.op || 0.16, stroke: col, 'stroke-width': o.sw || 1.6, 'stroke-dasharray': o.dash || '' }, p);
    if (o.lines) {
      var y0 = y + h / 2 - (o.lines.length - 1) * 7;
      o.lines.forEach(function (t, i) {
        var small = t.charAt(0) === '(';
        el('text', { x: x + w / 2, y: y0 + i * (small ? 12 : 14), 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-size': small ? 9 : 11, 'font-weight': small ? 400 : 700, fill: small ? '#b9c4e4' : '#fff' }, p, t);
      });
    }
  }
  function cross(step, x, y) {
    var p = g('boxes', step);
    el('circle', { cx: x, cy: y, r: 9, fill: C.red }, p);
    el('path', { d: 'M' + (x - 5) + ',' + (y - 5) + ' L' + (x + 5) + ',' + (y + 5) + ' M' + (x + 5) + ',' + (y - 5) + ' L' + (x - 5) + ',' + (y + 5), stroke: '#fff', 'stroke-width': 2, 'stroke-linecap': 'round' }, p);
  }
  function wire(step, id, d, col) {
    el('path', { id: id, d: d, 'class': 'wire', stroke: col, 'stroke-width': 2, opacity: 0.8 }, g('wires', step));
  }
  // rev = true: the packet travels the wire backwards (a reply)
  function packet(step, emoji, id, dur, begin, o) {
    o = o || {};
    var grp = el('g', {}, g('packets', step));
    el('text', { 'font-size': 20, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, grp, emoji);
    var a = { dur: dur + 's', begin: begin + 's', repeatCount: 'indefinite' };
    if (o.rev) { a.keyPoints = '1;0'; a.keyTimes = '0;1'; a.calcMode = 'linear'; }
    el('mpath', { href: '#' + id }, el('animateMotion', a, grp));
    if (o.fade) el('animate', { attributeName: 'opacity', values: '1;1;0', keyTimes: '0;0.85;1', dur: dur + 's', begin: begin + 's', repeatCount: 'indefinite' }, grp);
  }

  // ---------- wires (drawn first) ----------
  wire(1, 'w1', 'M120,125 H300 M470,125 H680', C.grey);
  wire(2, 'w2', 'M120,150 H300 M470,275 H680', C.grey);
  wire(3, 'w3a', 'M120,295 H300 M470,365 H680', C.grey);
  wire(3, 'w3b', 'M120,325 H300 M470,460 H680', C.grey);
  wire(4, 'c4', 'M300,190 H120', C.teal);
  wire(5, 'tls', 'M120,172 H300', C.green);
  wire(6, 'blog', 'M470,207 H940 V250', C.gold);
  wire(7, 'bot', 'M120,470 H285', C.red);
  wire(9, 'hc', 'M470,385 H680', C.green);
  wire(9, 'fo', 'M120,350 H300 M470,550 H680', C.grey);

  // ---------- boxes ----------
  box(1, 10, 110, 110, 90, C.blue, { lines: ['Browser', '(visitor)'] });
  box(1, 300, 100, 170, 480, C.green, { r: 14, op: 0.08, sw: 2.4 });
  label(1, 385, 122, 'NGINX', C.green, 15, 'middle', true);
  label(1, 385, 138, '(front desk manager)', '#b9c4e4', 10, 'middle');
  box(1, 680, 105, 160, 60, C.gold, { lines: ['Static files', '(brochure shelf)'] });
  label(1, 760, 181, 'abhijeet-shop.com', C.gold, 9, 'middle');
  label(2, 680, 241, 'App servers (the kitchen)', '#b9c4e4', 10);
  box(2, 680, 250, 160, 60, C.purple, { lines: ['App server 1', '(cook)'] });
  box(3, 10, 270, 110, 90, C.blue, { lines: ['Phone', '(visitor)'] });
  box(3, 680, 340, 160, 60, C.purple, { lines: ['App server 2', '(cook)'] });
  box(3, 680, 430, 160, 60, C.purple, { lines: ['App server 3', '(cook)'] });
  box(4, 315, 160, 140, 44, C.teal, { lines: ['Cache', '(ready-made copies)'], op: 0.3 });
  box(5, 315, 215, 140, 44, C.green, { lines: ['HTTPS', '(ID check at door)'], op: 0.3 });
  box(6, 315, 270, 140, 44, C.gold, { lines: ['Server blocks', '(sign on each shop)'], op: 0.3 });
  box(6, 900, 250, 160, 60, C.gold, { lines: ['Blog site', '(second shop)'] });
  label(6, 980, 326, 'blog.abhijeet-shop.com', C.gold, 9, 'middle');
  box(7, 315, 325, 140, 44, C.red, { lines: ['Rate limit', '(bouncer)'], op: 0.3 });
  box(7, 10, 440, 110, 60, C.red, { lines: ['Bot', '(bad visitor)'] });
  cross(7, 300, 470);
  label(7, 210, 452, 'Blocked!', C.red, 11, 'middle', true);
  box(8, 315, 380, 140, 44, C.teal, { lines: ['Gzip', '(vacuum packing)'], op: 0.3 });
  box(9, 315, 435, 140, 44, C.green, { lines: ['Health check', '(is the cook awake?)'], op: 0.3 });
  box(9, 680, 520, 160, 60, C.purple, { lines: ['Backup server', '(spare cook)'] });
  box(9, 680, 340, 160, 60, C.red, { dash: '5 4', op: 0.25 });
  cross(9, 858, 370);
  label(9, 876, 374, 'Down!', C.red, 11, 'start', true);

  // ---------- packets (drawn last) ----------
  packet(1, '\u2709\uFE0F', 'w1', 4, 0);
  packet(1, '\uD83D\uDCC4', 'w1', 4, 2, { rev: true });
  packet(2, '\u2709\uFE0F', 'w2', 4, 0.5);
  packet(2, '\uD83D\uDCC4', 'w2', 4, 2.5, { rev: true });
  packet(3, '\u2709\uFE0F', 'w3a', 4, 1);
  packet(3, '\u2709\uFE0F', 'w3b', 4, 2);
  packet(4, '\u26A1', 'c4', 2.5, 0);
  packet(5, '\uD83D\uDD12', 'tls', 3, 0);
  packet(6, '\u2709\uFE0F', 'blog', 5, 0.5);
  packet(7, '\uD83D\uDE08', 'bot', 4, 0, { fade: true });
  packet(8, '\uD83D\uDCE6', 'w1', 4, 3, { rev: true });
  packet(9, '\uD83D\uDC93', 'hc', 3, 0);
  packet(9, '\u2709\uFE0F', 'fo', 5, 1);

  var STEPS = [
    { t: 'The front desk', s: 'Web server', plain: "Abhijeet Ranjan opens an online shop. Nginx is the front desk manager. When a visitor asks for a page, Nginx fetches the ready printed page from the brochure shelf and hands it over.", tech: 'Nginx as a web server serving static files (HTML, CSS, images).', watch: 'An envelope (the request) goes from the browser through Nginx to the files, then a page comes back.' },
    { t: 'Passing orders on', s: 'Reverse proxy', plain: 'Some requests need work, like checking a cart. The manager does not cook. He passes the order to the kitchen and brings the answer back, so visitors never meet the kitchen.', tech: 'Reverse proxy (proxy_pass) to an upstream application server.', watch: 'A second request is sent on to the app server, and the answer returns the same way.' },
    { t: 'Sharing the work', s: 'Load balancing', plain: 'When many visitors arrive, the manager shares orders between several cooks so nobody is overloaded.', tech: 'Load balancing across an upstream group (round robin by default).', watch: 'A phone visitor joins, and orders spread across app servers 2 and 3.' },
    { t: 'Ready-made copies', s: 'Caching', plain: 'If many people ask for the same thing, the manager keeps a copy on a nearby shelf and hands it over at once, without bothering the kitchen.', tech: 'proxy_cache stores responses and serves repeat requests directly.', watch: 'A lightning bolt (a cached reply) returns to the browser straight from Nginx.' },
    { t: 'ID check at the door', s: 'HTTPS', plain: 'Before anything is exchanged, the manager checks identity and puts the conversation in a locked box so nobody on the way can read it.', tech: 'TLS/SSL termination (HTTPS) with a certificate on port 443.', watch: 'A lock travels from the browser to Nginx, showing the encrypted connection.' },
    { t: 'Many shops, one desk', s: 'Server blocks', plain: 'One front desk can serve several shops. The manager reads the signboard (the website name) and sends the visitor to the right shop.', tech: 'server blocks (virtual hosts) matched on server_name.', watch: 'Requests for the blog go to the Blog site, while the main shop stays on its own shelf.' },
    { t: 'The bouncer', s: 'Rate limiting', plain: 'If one visitor rushes in again and again, the bouncer turns them away so real customers are not squeezed out.', tech: 'limit_req and limit_conn restrict how many requests one client can make.', watch: 'A bad bot rushes toward Nginx and is stopped with a red cross and \u201cBlocked!\u201d.' },
    { t: 'Vacuum packing', s: 'Gzip', plain: 'Big pages are squeezed into small parcels before they leave, so they travel faster on slow phones.', tech: 'gzip compression of text responses (HTML, CSS, JavaScript).', watch: 'A small package travels back to the browser along the file route.' },
    { t: 'Is the cook awake?', s: 'Health checks', plain: 'The manager keeps checking that each cook is awake. If one has fallen asleep, orders go to a spare cook instead.', tech: 'Health checks (max_fails, fail_timeout, backup servers) in an upstream group.', watch: 'A heartbeat checks app server 2, which is marked Down!, and an envelope is sent to the backup server.' }
  ];
  var LEGEND = [['\u2709\uFE0F', 'Visitor request'], ['\uD83D\uDCC4', 'Page sent back'], ['\u26A1', 'Fast reply from cache'], ['\uD83D\uDD12', 'HTTPS (locked)'], ['\uD83D\uDE08', 'Bad bot'], ['\uD83D\uDCE6', 'Compressed (gzip) reply'], ['\uD83D\uDC93', 'Health check']];

  var stepsEl = document.getElementById('steps'), autoBtn = document.getElementById('auto'), cur = 0, timer = null, buttons = [];
  LEGEND.forEach(function (l) {
    var li = document.createElement('li');
    li.innerHTML = '<span>' + l[0] + '</span>' + l[1];
    document.getElementById('legend').appendChild(li);
  });
  STEPS.forEach(function (s, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'step';
    b.innerHTML = '<span class="n">' + (i + 1) + '</span><span><b></b><small></small></span>';
    b.querySelector('b').textContent = s.t;
    b.querySelector('small').textContent = s.s;
    b.addEventListener('click', function () { stopAuto(); show(i + 1); });
    stepsEl.appendChild(b); buttons.push(b);
  });
  function show(n) {
    cur = n;
    groups.forEach(function (gr) {
      var k = +gr.dataset.step;
      gr.classList.remove('new');
      gr.classList.toggle('on', k <= n);
      if (k === n) { void gr.getBoundingClientRect(); gr.classList.add('new'); }
    });
    buttons.forEach(function (b, i) {
      b.classList.toggle('on', i < n);
      if (i === n - 1) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    var s = STEPS[n - 1];
    document.getElementById('c-title').textContent = 'Step ' + n + ': ' + s.t;
    document.getElementById('c-plain').textContent = s.plain;
    document.getElementById('c-tech').textContent = s.tech;
    document.getElementById('c-watch').textContent = s.watch;
  }
  function stopAuto() { clearInterval(timer); timer = null; autoBtn.classList.remove('active'); autoBtn.textContent = 'Auto-play'; }
  autoBtn.addEventListener('click', function () {
    if (timer) { stopAuto(); return; }
    if (cur >= STEPS.length) show(1);
    autoBtn.classList.add('active'); autoBtn.textContent = 'Pause';
    timer = setInterval(function () { if (cur >= STEPS.length) stopAuto(); else show(cur + 1); }, 5000);
  });
  document.getElementById('reset').addEventListener('click', function () { stopAuto(); show(1); });
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) { svg.setCurrentTime(1.2); svg.pauseAnimations(); }
  show(1);
})();

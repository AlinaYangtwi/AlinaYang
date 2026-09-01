// 入场揭示：IntersectionObserver + 级联延迟
(function () {
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
      el.style.transitionDelay = delay + 'ms';
      el.classList.add('in');
      io.unobserve(el);
      el.addEventListener('transitionend', function () {
        el.style.transitionDelay = '0ms';
      }, { once: true });
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  items.forEach(function (el) { io.observe(el); });
})();

// 顶部栏：滚动超过首屏后加深底部分隔线
(function () {
  var bar = document.querySelector('.topbar');
  var onScroll = function () {
    bar.style.borderBottomColor = window.scrollY > 40 ? 'var(--ink)' : 'var(--line)';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// 深色 / 浅色主题切换（localStorage 持久化）
(function () {
  var btn = document.getElementById('themeToggle');
  if (!btn) return;
  var isEN = document.documentElement.lang === 'en';
  function label(theme) {
    // 按钮文字 = 点击后将切换到的目标主题
    if (isEN) return theme === 'dark' ? 'Light' : 'Dark';
    return theme === 'dark' ? '浅色' : '深色';
  }
  function current() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  btn.textContent = label(current());
  btn.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('ay-theme', next); } catch (e) {}
    btn.textContent = label(next);
  });
})();

// PDF 导出（调用浏览器打印，选「另存为 PDF」）
(function () {
  var btn = document.getElementById('pdfBtn');
  if (!btn) return;
  btn.addEventListener('click', function () {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    window.print();
  });
})();

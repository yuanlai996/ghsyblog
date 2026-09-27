/* ==========================================================================
   GHSY 博客 — 交互脚本（主题切换 / 移动导航 / 站内搜索 / 标签筛选）
   无依赖，纯原生 JS。所有功能在不支持时都会优雅降级。
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- 主题切换 ---------- */
  var THEME_KEY = 'ghsy-theme';

  function applyTheme(theme) {
    if (theme) {
      root.setAttribute('data-theme', theme);
    } else {
      root.removeAttribute('data-theme');
    }
  }

  try {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') applyTheme(saved);
  } catch (e) { /* 隐私模式下忽略 */ }

  function currentTheme() {
    var explicit = root.getAttribute('data-theme');
    if (explicit === 'light' || explicit === 'dark') return explicit;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  document.addEventListener('click', function (event) {
    var toggle = event.target.closest('[data-theme-toggle]');
    if (!toggle) return;
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    toggle.setAttribute('aria-label', next === 'dark' ? '切换到浅色模式' : '切换到深色模式');
  });

  /* ---------- 移动端导航 ---------- */
  var navToggle = document.querySelector('[data-nav-toggle]');
  var siteNav = document.getElementById('site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var open = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', function (event) {
      if (!siteNav.classList.contains('is-open')) return;
      if (siteNav.contains(event.target) || navToggle.contains(event.target)) return;
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  }

  /* ---------- 滚动时的页头描边 ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 4);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 站内搜索 ---------- */
  var searchPanel = document.getElementById('search-panel');
  var searchInput = document.getElementById('search-input');
  var searchStatus = document.getElementById('search-status');
  var allCards = Array.prototype.slice.call(document.querySelectorAll('[data-post-card]'));

  function normalize(text) {
    return (text || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function openSearch() {
    if (!searchPanel) return;
    searchPanel.classList.add('is-open');
    var trigger = document.querySelector('[data-search-toggle]');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  }

  function closeSearch() {
    if (!searchPanel) return;
    searchPanel.classList.remove('is-open');
    var trigger = document.querySelector('[data-search-toggle]');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-search-toggle]')) {
      event.preventDefault();
      if (searchPanel && searchPanel.classList.contains('is-open')) closeSearch();
      else openSearch();
    }
    if (event.target.closest('[data-search-close]')) closeSearch();
  });

  document.addEventListener('keydown', function (event) {
    var typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);
    if (event.key === 'Escape') closeSearch();
    if (event.key === '/' && !typing) {
      event.preventDefault();
      openSearch();
    }
  });

  /* ---------- 标签筛选 + 搜索 联动 ---------- */
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var emptyState = document.getElementById('empty-state');
  var activeTag = 'all';

  function cardText(card) {
    return normalize([
      card.dataset.title,
      card.dataset.excerpt,
      card.dataset.tags,
      card.textContent
    ].join(' '));
  }

  function updateCards() {
    if (!allCards.length) return;
    var query = normalize(searchInput ? searchInput.value : '');
    var visible = 0;

    allCards.forEach(function (card) {
      var tags = (card.dataset.tags || '').split(',').map(normalize).filter(Boolean);
      var tagMatch = activeTag === 'all' || tags.indexOf(normalize(activeTag)) !== -1;
      var textMatch = !query || cardText(card).indexOf(query) !== -1;
      var show = tagMatch && textMatch;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (emptyState) emptyState.hidden = visible !== 0;
    if (searchStatus) {
      searchStatus.textContent = query
        ? '找到 ' + visible + ' 篇匹配「' + query + '」的文章'
        : '';
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeTag = button.dataset.filter || 'all';
      filterButtons.forEach(function (other) {
        other.setAttribute('aria-pressed', String(other === button));
      });
      updateCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', updateCards);
    searchInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        var first = allCards.filter(function (card) { return !card.hidden; })[0];
        var link = first && first.querySelector('a[href]');
        if (link) window.location.href = link.href;
      }
    });
  }

  /* ---------- 阅读进度条 ---------- */
  var article = document.querySelector('[data-article]');
  if (article) {
    var bar = document.createElement('div');
    bar.setAttribute('aria-hidden', 'true');
    bar.style.cssText =
      'position:fixed;top:0;left:0;height:2px;width:0;z-index:80;' +
      'background:var(--accent);transition:width .1s linear;pointer-events:none;';
    document.body.appendChild(bar);

    var progress = function () {
      var start = article.offsetTop;
      var total = article.offsetHeight - window.innerHeight + 200;
      var ratio = (window.scrollY - start + 120) / Math.max(total, 1);
      bar.style.width = Math.min(Math.max(ratio, 0), 1) * 100 + '%';
    };
    progress();
    window.addEventListener('scroll', progress, { passive: true });
    window.addEventListener('resize', progress);
  }

  /* ---------- 复制链接 ---------- */
  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-copy-link]');
    if (!button) return;
    var url = window.location.href;

    var done = function () {
      var original = button.dataset.label || button.textContent.trim();
      button.dataset.label = original;
      button.textContent = '已复制链接';
      setTimeout(function () { button.textContent = original; }, 1800);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, function () { window.prompt('复制下面的链接：', url); });
    } else {
      window.prompt('复制下面的链接：', url);
    }
  });

  /* ---------- 页脚年份 ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();

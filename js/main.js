/* ============================================================
   EcoRenter.com - Main JavaScript
   Mobile Navigation | FAQ Accordion | Search | Social Share
   ============================================================ */

(function() {
  'use strict';

  // ---------- Mobile Navigation ----------
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navOverlay = document.querySelector('.nav-overlay');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function() {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('active');
      if (navOverlay) navOverlay.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', function() {
        mainNav.classList.remove('open');
        navToggle.classList.remove('active');
        navOverlay.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        navToggle.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });
  }

  // ---------- FAQ Accordion ----------
  document.querySelectorAll('.faq-question').forEach(function(button) {
    button.addEventListener('click', function() {
      var item = this.closest('.faq-item');
      var answer = item.querySelector('.faq-answer');
      var isOpen = item.classList.contains('open');

      // Close all other items in same section
      var section = item.closest('.faq-section');
      if (section) {
        section.querySelectorAll('.faq-item.open').forEach(function(openItem) {
          if (openItem !== item) {
            openItem.classList.remove('open');
            var openAnswer = openItem.querySelector('.faq-answer');
            if (openAnswer) openAnswer.style.maxHeight = '0';
            openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });
      }

      item.classList.toggle('open');
      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        this.setAttribute('aria-expanded', 'true');
      } else {
        answer.style.maxHeight = '0';
        this.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ---------- Back to Top ----------
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Social Sharing ----------
  window.shareOnFacebook = function(url, title) {
    var shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url || window.location.href);
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  window.shareOnTwitter = function(url, title) {
    var text = encodeURIComponent(title || document.title);
    var shareUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url || window.location.href) + '&text=' + text;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  window.shareOnLinkedIn = function(url) {
    var shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url || window.location.href);
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  window.shareOnPinterest = function(url, title, image) {
    var shareUrl = 'https://pinterest.com/pin/create/button/?url=' + encodeURIComponent(url || window.location.href) + '&description=' + encodeURIComponent(title || document.title);
    if (image) shareUrl += '&media=' + encodeURIComponent(image);
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  window.shareByEmail = function(url, title) {
    var subject = encodeURIComponent(title || document.title);
    var body = encodeURIComponent('Check out this eco-friendly listing on EcoRenter:\n\n' + (url || window.location.href));
    window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
  };

  window.copyLink = function(url) {
    var link = url || window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(function() {
        showToast('Link copied to clipboard!');
      });
    } else {
      var input = document.createElement('input');
      input.value = link;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      showToast('Link copied to clipboard!');
    }
  };

  // ---------- Toast Notification ----------
  function showToast(message) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    document.body.appendChild(toast);

    requestAnimationFrame(function() {
      toast.classList.add('show');
    });

    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() { toast.remove(); }, 300);
    }, 2500);
  }

  // ---------- Client-Side Search ----------
  var searchInput = document.querySelector('.search-input');
  if (searchInput) {
    var debounceTimer;
    searchInput.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      var query = this.value.toLowerCase().trim();
      debounceTimer = setTimeout(function() {
        filterCards(query);
      }, 200);
    });
  }

  function filterCards(query) {
    var cards = document.querySelectorAll('.card-grid .card');
    var visibleCount = 0;
    cards.forEach(function(card) {
      var text = card.textContent.toLowerCase();
      var match = !query || text.indexOf(query) !== -1;
      card.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    var noResults = document.querySelector('.no-results');
    if (visibleCount === 0 && query) {
      if (!noResults) {
        noResults = document.createElement('p');
        noResults.className = 'no-results text-center text-muted';
        noResults.style.gridColumn = '1 / -1';
        noResults.style.padding = '2rem';
        noResults.textContent = 'No listings match your search. Try different keywords.';
        var grid = document.querySelector('.card-grid');
        if (grid) grid.appendChild(noResults);
      }
    } else if (noResults) {
      noResults.remove();
    }
  }

  // ---------- Filter Tags ----------
  document.querySelectorAll('.filter-tag').forEach(function(tag) {
    tag.addEventListener('click', function() {
      var group = this.closest('.filter-tags');
      if (group) {
        group.querySelectorAll('.filter-tag').forEach(function(t) {
          t.classList.remove('active');
        });
      }
      this.classList.add('active');

      var filter = this.getAttribute('data-filter');
      var cards = document.querySelectorAll('.card-grid .card');
      cards.forEach(function(card) {
        if (!filter || filter === 'all') {
          card.style.display = '';
        } else {
          var tags = card.getAttribute('data-tags') || '';
          card.style.display = tags.indexOf(filter) !== -1 ? '' : 'none';
        }
      });
    });
  });

  // ---------- Intersection Observer for Animations ----------
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.card, .impact-item, .philosophy-item, .practice-item').forEach(function(el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

  // ---------- Lazy Load Images ----------
  if ('IntersectionObserver' in window) {
    var imgObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imgObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(function(img) {
      imgObserver.observe(img);
    });
  }

  // ---------- Active Nav Highlighting ----------
  var currentPath = window.location.pathname;
  document.querySelectorAll('.nav-list a').forEach(function(link) {
    var href = link.getAttribute('href');
    if (href && currentPath.indexOf(href) === 0 && href !== '/') {
      link.classList.add('active');
    } else if (href === '/' && currentPath === '/') {
      link.classList.add('active');
    }
  });

  // ---------- Sustainability Meter Animation ----------
  if ('IntersectionObserver' in window) {
    var meterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var fills = entry.target.querySelectorAll('.meter-fill');
          fills.forEach(function(fill) {
            var width = fill.getAttribute('data-width');
            if (width) fill.style.width = width;
          });
          meterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.sustainability-meter').forEach(function(meter) {
      meter.querySelectorAll('.meter-fill').forEach(function(fill) {
        fill.setAttribute('data-width', fill.style.width);
        fill.style.width = '0';
      });
      meterObserver.observe(meter);
    });
  }

})();

/* ── Theme init: runs before first paint to prevent flash ── */
(function () {
    var t = localStorage.getItem('theme');
    if (t) document.documentElement.setAttribute('data-theme', t);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches)
        document.documentElement.setAttribute('data-theme', 'dark');
})();

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');

if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu when clicking on a link
    navLinks.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            navLinks.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Smooth scrolling for navigation links (for long.html)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll state — CSS class, dark-mode-aware
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 80);
}, { passive: true });

// Update active navigation link based on scroll position (for long.html)
if (document.body.classList.contains('smooth-scroll-page')) {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;

                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));

                // Add active class to current section link
                const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.1
    });

    sections.forEach(section => observer.observe(section));
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    fadeInObserver.observe(el);
});

// Interactive hover effects are handled entirely by CSS transitions

// Back to top button functionality
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ── Dark mode toggle ──
const themeToggle = document.getElementById('themeToggle');
const setThemeIcon = (isDark) => { if (themeToggle) themeToggle.textContent = isDark ? '☀️' : '🌙'; };
setThemeIcon(document.documentElement.getAttribute('data-theme') === 'dark');
themeToggle?.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setThemeIcon(next === 'dark');
});

// ── Palette swatch (cycles through palettes) ──
const paletteToggle = document.getElementById('paletteToggle');
if (paletteToggle) {
    if (window.SITE_THEME && window.SITE_THEME.enablePaletteToggle === false) {
        paletteToggle.style.display = 'none';
    } else {
        const syncPalette = () => {
            paletteToggle.textContent = '';
            const label = window.__paletteLabel ? window.__paletteLabel() : '';
            paletteToggle.title = label ? `Theme: ${label} — click to change` : 'Change color theme';
            paletteToggle.setAttribute('aria-label', label ? `Color theme: ${label}. Click to change.` : 'Change color theme');
        };
        syncPalette();
        paletteToggle.addEventListener('click', () => {
            if (window.__cyclePalette) window.__cyclePalette();
            syncPalette();
        });
    }
}

// ── Scroll progress bar ──
const scrollProgress = document.getElementById('scrollProgress');
if (scrollProgress) {
    window.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        const pct = scrollHeight - clientHeight > 0 ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 0;
        scrollProgress.style.width = pct + '%';
    }, { passive: true });
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Handle Escape key for mobile menu
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenuToggle?.setAttribute('aria-expanded', 'false');
    }
});

// Lazy loading for images (if you add images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

console.log('%c MO ', 'background:linear-gradient(135deg,#6366f1,#a855f7);color:white;font-size:18px;font-weight:900;border-radius:6px;padding:2px 8px;');
console.log('%cMukharbek Organokov — Senior AI Stack Engineer', 'color:#6366f1;font-size:13px;font-weight:600;');
console.log('%cCode → https://github.com/kabartay', 'color:#94a3b8;font-size:12px;');

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio initialized successfully!');

    // Set home link as active by default on single pages
    if (!document.body.classList.contains('smooth-scroll-page')) {
        const path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
        const section = '/' + (path.split('/')[1] || '');   // /blog/<post> highlights Blog
        const activeLink = document.querySelector(`.nav-links a[href="${section}"]`);
        if (activeLink) {
            document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
            activeLink.classList.add('active');
        }
    }
});

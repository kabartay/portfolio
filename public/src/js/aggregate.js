const pages = [
    { id: 'home', url: 'index.html', title: 'Home' },
    { id: 'about', url: 'about.html', title: 'About' },
    { id: 'experience', url: 'experience.html', title: 'Experience' },
    { id: 'education', url: 'education.html', title: 'Education' },
    { id: 'projects', url: 'projects.html', title: 'Projects' },
    { id: 'achievements', url: 'achievements.html', title: 'Achievements' },
    { id: 'blog', url: 'blog.html', title: 'Blog' },
    { id: 'contact', url: 'contact.html', title: 'Contact' },
];

const mount = document.getElementById('all-sections');
const loadingIndicator = document.getElementById('loading-indicator');

async function fetchSection({ id, url, title }) {
    try {
        console.log(`Loading ${title} from ${url}`);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const section = document.createElement('section');
        section.id = id;

        if (id === 'home') {
            // Extract hero section for home
            const heroSection = doc.querySelector('.hero');
            if (heroSection) {
                section.innerHTML = heroSection.innerHTML;
            } else {
                // Fallback hero content
                section.innerHTML = `
                    <div class="hero-content">
                        <h1>Mukharbek Organokov</h1>
                        <p>Senior AI Stack Engineer</p>
                        <div class="hero-now">Currently Senior ML Engineer at Temelion · Paris, France</div>
                        <div class="cta-buttons">
                            <a href="#projects" class="cta-button">Discover My Work</a>
                            <a href="/assets/cv.pdf" class="cta-button-secondary" download aria-label="Download CV PDF">Download CV</a>
                        </div>
                        <div class="hero-social">
                            <a href="https://www.linkedin.com/in/circassia/" class="hero-social-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
                            <a href="https://github.com/kabartay" class="hero-social-link" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
                            <a href="https://www.kaggle.com/muhakabartay" class="hero-social-link" target="_blank" rel="noopener noreferrer" aria-label="Kaggle" title="Kaggle"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.358"/></svg></a>
                            <a href="https://huggingface.co/kabartay" class="hero-social-link" target="_blank" rel="noopener noreferrer" aria-label="Hugging Face" title="Hugging Face"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M1.4446 11.5059c0 1.1021.1673 2.1585.4847 3.1563-.0378-.0028-.0691-.0058-.1058-.0058-.4209 0-.8015.16-1.0704.4512-.3454.3737-.4984.8335-.4316 1.293a1.576 1.576 0 0 0 .2148.5978c-.2319.1864-.4018.4456-.4844.7578-.0646.2448-.131.7543.2149 1.2794a1.4552 1.4552 0 0 0-.0625.1055c-.208.3923-.2207.8372-.0371 1.25.2783.6258.9696 1.1175 2.3126 1.6467.8356.3292 1.5988.5411 1.6056.543 1.1046.2847 2.104.4277 2.969.4277 1.4173 0 2.4754-.3849 3.1525-1.1446 1.538.2651 2.791.1403 3.592.006.6773.7555 1.7332 1.1387 3.1467 1.1387.8649 0 1.8643-.143 2.969-.4278.0068-.0019.77-.2138 1.6056-.543 1.343-.5292 2.0343-1.0208 2.3126-1.6466.1836-.4129.171-.8577-.037-1.25a1.4685 1.4685 0 0 0-.0626-.1056c.346-.525.2795-1.0346.2149-1.2793-.0826-.3122-.2525-.5714-.4844-.7579.11-.1816.1831-.3788.2148-.5977.0669-.4595-.0862-.9193-.4316-1.293-.2688-.2913-.6495-.4513-1.0704-.4513-.0209 0-.0376.0008-.0588.0018.3162-.9966.4846-2.0518.4846-3.1523 0-5.807-4.7362-10.5144-10.5789-10.5144-5.8426 0-10.5788 4.7073-10.5788 10.5144Zm10.5788-9.4831c5.2727 0 9.5476 4.246 9.5476 9.483a9.4201 9.4201 0 0 1-.2696 2.2365c-.0039-.0047-.0079-.011-.0117-.0156-.274-.3255-.6679-.5059-1.1075-.5059-.352 0-.714.1155-1.0763.3438-.2403.1517-.5058.422-.7793.7598-.2534-.3492-.608-.5832-1.0137-.6465a1.5174 1.5174 0 0 0-.2344-.0176c-.9263 0-1.4828.7993-1.6935 1.5177-.1046.2426-.6065 1.3482-1.3614 2.0978-1.1681 1.1601-1.4458 2.3534-.8396 3.6382-.843.1029-1.5836.0927-2.365-.006.5906-1.212.3626-2.4388-.8426-3.6322-.755-.7496-1.2568-1.8552-1.3614-2.0978-.2107-.7184-.7673-1.5177-1.6935-1.5177-.078 0-.1568.0054-.2344.0176-.4057.0633-.7604.2973-1.0137.6465-.2735-.3379-.539-.6081-.7794-.7598-.3622-.2283-.7243-.3438-1.0762-.3438-.4266 0-.8094.171-1.0821.4786a9.4208 9.4208 0 0 1-.2598-2.1936c0-5.237 4.2749-9.483 9.5475-9.483zM8.6443 7.0036c-.4838.0043-.9503.2667-1.1934.7227-.3536.6633-.1006 1.4873.5645 1.84.351.1862.4883-.5261.836-.6485.3107-.1095.841.399 1.0078.086.3536-.6634.1025-1.4874-.5625-1.84a1.3659 1.3659 0 0 0-.6524-.1602Zm6.8403 0c-.2199-.002-.4426.05-.6504.1602-.665.3526-.9181 1.1766-.5645 1.84.1669.313.6971-.1955 1.0079-.086.3476.1224.4867.8347.838.6485.6649-.3527.916-1.1767.5624-1.84-.243-.456-.7096-.7184-1.1934-.7227Zm-9.7565 1.418a.8768.8768 0 0 0-.877.877c0 .4846.3925.877.877.877a.8768.8768 0 0 0 .877-.877.8768.8768 0 0 0-.877-.877zm12.6434 0c-.4845 0-.879.3925-.879.877 0 .4846.3945.877.879.877a.8768.8768 0 0 0 .877-.877.8768.8768 0 0 0-.877-.877zM8.7927 11.459c-.179-.003-.2793.1107-.2793.416 0 .8097.3874 2.125 1.4279 2.924.207-.7123 1.3453-1.2832 1.5079-1.2012.2315.1167.2191.4417.6074.7266.3884-.285.374-.6098.6056-.7266.1627-.082 1.3009.4889 1.5079 1.2012 1.0404-.799 1.4278-2.1144 1.4278-2.924 0-1.2212-1.583.6402-3.5413.6485-1.4686-.0061-2.7266-1.0558-3.2639-1.0645zM4.312 14.4768c.5792.365 1.6964 2.2751 2.1056 3.0177.1371.2488.371.3536.582.3536.4188 0 .7465-.4138.0391-.9395-1.0636-.791-.6914-2.0846-.1836-2.1642a.4302.4302 0 0 1 .0664-.004c.4616 0 .666.7892.666.7892s.5959 1.4898 1.6213 2.508c.942.9356 1.062 1.703.4961 2.6661-.0164-.004-.0159.0236-.1484.2149-.1853.2673-.4322.4688-.7188.6152-.5062.2269-1.1397.2696-1.7833.2696-1.037 0-2.1017-.1824-2.6975-.336-.0293-.0075-3.6505-.9567-3.1916-1.8224.0771-.1454.2033-.2031.3633-.2031.6463 0 1.823.9551 2.3283.9551.113 0 .196-.0865.2285-.2031.2249-.8045-3.2787-1.0522-2.9846-2.1642.0519-.1967.193-.2757.3907-.2754.854 0 2.7704 1.4923 3.172 1.4923.0307 0 .0525-.0085.0645-.0274.2012-.3227.1096-.5865-1.3087-1.4395-1.4182-.8533-2.4315-1.329-1.8653-1.9416.0651-.0707.1574-.1015.2695-.1015.8611.0002 2.8948 1.84 2.8948 1.84s.5487.5683.8809.5683c.0762 0 .1416-.0315.1855-.1054.2355-.3946-2.1858-2.2183-2.3224-2.971-.0926-.51.0641-.7676.3555-.7676-.0006.008.1701-.0285.4942.1759zm16.2257.5918c-.1366.7526-2.5579 2.5764-2.3224 2.9709.044.074.1092.1055.1855.1055.3321 0 .881-.5684.881-.5684s2.0336-1.8397 2.8947-1.84c.1121 0 .2044.0308.2695.1016.5662.6125-.447 1.0882-1.8653 1.9415-1.4183.853-1.51 1.1168-1.3087 1.4396.012.0188.0337.0273.0644.0273.4016 0 2.3181-1.4923 3.1721-1.4923.1977-.0002.3388.0787.3907.2754.294 1.112-3.2095 1.3597-2.9846 2.1642.0325.1166.1156.2032.2285.2032.5054 0 1.682-.9552 2.3283-.9552.16 0 .2862.0577.3633.2032.459.8656-3.1623 1.8149-3.1916 1.8224-.5958.1535-1.6605.336-2.6975.336-.6351 0-1.261-.0409-1.7638-.2599-.2949-.1472-.5488-.3516-.7383-.625-.0411-.0682-.1026-.1476-.1426-.205-.5726-.9679-.455-1.7371.4903-2.676 1.0254-1.0182 1.6212-2.508 1.6212-2.508s.2044-.7891.666-.7891a.4318.4318 0 0 1 .0665.0039c.5078.0796.88 1.3732-.1836 2.1642-.7074.5257-.3797.9395.039.9395.211 0 .445-.1047.5821-.3535.4092-.7426 1.5264-2.6527 2.1056-3.0178.5588-.3524.99-.1816.8497.5918z"/></svg></a>
                            <a href="https://scholar.google.com/citations?user=jYZaDVoAAAAJ" class="hero-social-link" target="_blank" rel="noopener noreferrer" aria-label="Google Scholar" title="Google Scholar"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/></svg></a>
                            <a href="mailto:mukharbek.organokov@gmail.com" class="hero-social-link" aria-label="Email" title="Email"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></a>
                        </div>
                        <ul class="hero-proof" aria-label="Highlights">
                            <li><a href="#achievements">PhD in Astrophysics</a></li>
                            <li><a href="#achievements">Patent pending at Cisco</a></li>
                            <li><a href="#achievements">Kaggle best rank 143rd</a></li>
                            <li><a href="#achievements">19 Kaggle medals</a></li>
                        </ul>
                    </div>
                `;
            }
        } else {
            // Extract main section content for other pages
            const mainSection = doc.querySelector('main section');
            const standaloneSection = doc.querySelector('section');

            if (mainSection) {
                section.innerHTML = mainSection.innerHTML;
            } else if (standaloneSection) {
                section.innerHTML = standaloneSection.innerHTML;
            } else {
                // Fallback: extract from main
                const main = doc.querySelector('main');
                if (main) {
                    const content = main.innerHTML
                        .replace(/style="[^"]*"/g, '')
                        .replace(/style='[^']*'/g, '');
                    section.innerHTML = content;
                } else {
                    section.innerHTML = `
                        <div class="container">
                            <h2 class="section-title">${title}</h2>
                            <p>Content extracted from ${url}</p>
                        </div>
                    `;
                }
            }
        }

        // Standalone pages title themselves with an h1; on the homepage the hero keeps the only h1
        section.querySelectorAll('h1.section-title').forEach(h => {
            const h2 = document.createElement('h2');
            h2.className = h.className;
            if (h.getAttribute('style')) h2.setAttribute('style', h.getAttribute('style'));
            h2.innerHTML = h.innerHTML;
            h.replaceWith(h2);
        });

        mount.appendChild(section);
        console.log(`Successfully loaded ${title}`);

    } catch (error) {
        console.error(`Failed to load ${title}:`, error);

        // Create error fallback section
        const section = document.createElement('section');
        section.id = id;
        section.innerHTML = `
            <div class="container">
                <h2 class="section-title">${title}</h2>
                <p style="text-align: center; color: var(--text-light); padding: 2rem;">
                    Failed to load content from ${url}<br>
                    <small>Error: ${error.message}</small>
                </p>
            </div>
        `;
        mount.appendChild(section);
    }
}

// Setup smooth scrolling navigation
function setupSmoothScrolling() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    console.log(`Found ${sections.length} sections and ${navLinks.length} nav links`);

    // Intersection observer for active link highlighting
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;

                // Update active navigation
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        rootMargin: '-30% 0px -30% 0px',
        threshold: 0.1
    });

    sections.forEach(section => observer.observe(section));

    // Click handlers for navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Update active state immediately
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without adding a new history entry
                history.replaceState(null, null, `#${targetId}`);
            }
        });
    });

    // Set home as active by default
    const homeLink = document.querySelector('a[href="#home"]');
    if (homeLink) homeLink.classList.add('active');
}

// Setup all interactions for loaded content
function setupInteractions() {
    // Fade-in animations
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-in').forEach(el => {
        fadeObserver.observe(el);
    });

    // Navbar scroll effect
    // (a CSS class, so dark mode styles it; same as main.js)
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });

    // Scroll progress bar
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const pct = scrollHeight - clientHeight > 0 ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 0;
            scrollProgress.style.width = pct + '%';
        }, { passive: true });
    }

    // Mobile menu functionality
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
    }

    // Back to top button
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


}

// Type the hero name once, as soon as the hero is on screen. Screen readers get the full
// name from aria-label, and reduced-motion users see it immediately.
function typeHeroTitle() {
    const heroTitle = document.querySelector('#home h1');
    if (!heroTitle || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const text = heroTitle.textContent.trim();
    heroTitle.setAttribute('aria-label', text);
    heroTitle.textContent = '';
    let i = 0;
    (function typeWriter() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i++);
            setTimeout(typeWriter, 70);
        }
    })();
}

// Main initialization
async function init() {
    console.log('Starting portfolio loader...');

    // Strip any stale hash from a previous session so fresh loads always start at top
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname);
    }

    try {

        // Load Home section first (pages[0])
        await fetchSection(pages[0]);

        // Hide loading indicator
        loadingIndicator.style.display = 'none';
        typeHeroTitle();

        // Load the rest sequentially (no artificial delay)
        for (const page of pages.slice(1)) {
            await fetchSection(page);
            // removed: await new Promise(r => setTimeout(r, 100));
        }

        // Setup all functionality
        setupSmoothScrolling();
        setupInteractions();

        console.log('Portfolio loaded successfully!');

    } catch (error) {
        console.error('Error loading portfolio:', error);
        loadingIndicator.style.display = 'none'; // For Option 2
        loadingIndicator.innerHTML = `
            <div style="color: red; text-align: center;">
                <h3>Error Loading Portfolio</h3>
                <p>${error.message}</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; border: none; border-radius: 5px; background: var(--primary-color); color: white; cursor: pointer;">
                    Retry
                </button>
            </div>
        `;
    }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        init();
        setupPaletteToggle();
        setupThemeToggle();
    });
} else {
    init();
    setupPaletteToggle();
    setupThemeToggle();
}

function setupThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const sync = (isDark) => { btn.textContent = isDark ? '☀️' : '🌙'; };
    sync(document.documentElement.getAttribute('data-theme') === 'dark');
    btn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const next = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        sync(next === 'dark');
    });
}

function setupPaletteToggle() {
    const btn = document.getElementById('paletteToggle');
    if (!btn) return;
    if (window.SITE_THEME && window.SITE_THEME.enablePaletteToggle === false) {
        btn.style.display = 'none';
        return;
    }
    const sync = () => {
        btn.textContent = '';
        const label = window.__paletteLabel ? window.__paletteLabel() : '';
        btn.title = label ? `Theme: ${label} — click to change` : 'Change color theme';
        btn.setAttribute('aria-label', label ? `Color theme: ${label}. Click to change.` : 'Change color theme');
    };
    sync();
    btn.addEventListener('click', () => {
        if (window.__cyclePalette) window.__cyclePalette();
        sync();
    });
}
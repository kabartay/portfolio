const pages = [
    { id: 'home', url: 'index.html', title: 'Home' },
    { id: 'about', url: 'about.html', title: 'About' },
    { id: 'experience', url: 'experience.html', title: 'Experience' },
    { id: 'education', url: 'education.html', title: 'Education' },
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
                        <div class="cta-buttons">
                            <a href="#about" class="cta-button">Discover My Work</a>
                            <a href="/assets/cv.pdf" class="cta-button-secondary" download aria-label="Download CV PDF">Download CV</a>
                        </div>
                        <div class="hero-social">
                            <a href="https://www.linkedin.com/in/circassia/" class="hero-social-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                LinkedIn
                            </a>
                            <a href="https://github.com/kabartay" class="hero-social-link" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                GitHub
                            </a>
                            <a href="mailto:mukharbek.organokov@gmail.com" class="hero-social-link" aria-label="Send email">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                Email
                            </a>
                        </div>
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
    // Blog toggles
    document.querySelectorAll('.toggle-excerpt').forEach(btn => {
        btn.addEventListener('click', () => {
            const excerpt = btn.previousElementSibling;
            if (excerpt && excerpt.classList.contains('blog-excerpt')) {
                const expanded = excerpt.classList.toggle('expanded');
                excerpt.classList.toggle('clamp', !expanded);
                btn.textContent = expanded ? 'Show less' : 'Read more';
                btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            }
        });
    });

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
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Mobile menu functionality
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('active');
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

    // Typing animation for hero title - run after everything loads
    // setTimeout(() => {
    //     const heroTitle = document.querySelector('#home h1');
    //     if (heroTitle) {
    //         const text = heroTitle.textContent;
    //         heroTitle.textContent = '';

    //         let i = 0;
    //         function typeWriter() {
    //             if (i < text.length) {
    //                 heroTitle.textContent += text.charAt(i);
    //                 i++;
    //                 setTimeout(typeWriter, 100);
    //             }
    //         }

    //         setTimeout(typeWriter, 500);
    //     }
    // }, 1500); // Wait 1.5 seconds for content to fully load

    // Clear name immediately and start typing
    setTimeout(() => {
        const heroTitle = document.querySelector('#home h1');
        if (heroTitle) {
            const text = heroTitle.textContent;
            heroTitle.textContent = ''; // Clear immediately

            let i = 0;
            function typeWriter() {
                if (i < text.length) {
                    heroTitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            }

            // Start typing immediately (no delay)
            typeWriter();
        }
    }, 100); // Much shorter delay - clear as soon as content loads

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
    });
} else {
    init();
    setupPaletteToggle();
}

function setupPaletteToggle() {
    const btn = document.getElementById('paletteToggle');
    if (!btn) return;
    if (window.SITE_THEME && window.SITE_THEME.enablePaletteToggle === false) {
        btn.style.display = 'none';
        return;
    }
    const setIcon = (isGreen) => {
        btn.textContent = isGreen ? '🟣' : '🌿';
        btn.setAttribute('aria-label', isGreen ? 'Switch to indigo palette' : 'Switch to green palette');
    };
    setIcon(document.documentElement.hasAttribute('data-palette'));
    btn.addEventListener('click', () => {
        const next = document.documentElement.hasAttribute('data-palette') ? 'indigo' : 'green';
        window.__applyPalette(next);
        setIcon(next === 'green');
    });
}
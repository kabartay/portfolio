const pages = [
    { id: 'home', url: 'index.html', title: 'Home' },
    { id: 'about', url: 'about.html', title: 'About' },
    { id: 'experience', url: 'experience.html', title: 'Experience' },
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
                // Fallback content
                section.innerHTML = `
                    <div class="hero-content">
                        <h1>Mukharbek Organokov</h1>
                        <p>Senior AI Engineer</p>
                        <a href="#about" class="cta-button">Discover My Work</a>
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

                // Update URL
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });

    // Handle initial hash
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });

                const activeLink = document.querySelector(`a[href="${window.location.hash}"]`);
                if (activeLink) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    activeLink.classList.add('active');
                }
            }
        }, 1000);
    } else {
        // Set home as active by default
        const homeLink = document.querySelector('a[href="#home"]');
        if (homeLink) homeLink.classList.add('active');
    }
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
                btn.setAttribute('aria-expanded', expanded);
            }
        });
    });

    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name')?.value;
            const email = document.getElementById('email')?.value;
            const message = document.getElementById('message')?.value;

            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }

            alert('Thank you for your message! I\'ll get back to you soon.');
            contactForm.reset();
        });
    }

    // Hover effects
    document.querySelectorAll('.skill-card, .blog-card, .timeline-content').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
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

    try {
        // Load all sections
        for (const page of pages) {
            await fetchSection(page);
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Hide loading indicator
        loadingIndicator.style.display = 'none';

        // Setup all functionality
        setupSmoothScrolling();
        setupInteractions();

        console.log('Portfolio loaded successfully!');

    } catch (error) {
        console.error('Error loading portfolio:', error);
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
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
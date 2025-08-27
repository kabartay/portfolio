// Mobile menu toggle
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

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
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

// Blog post "Read more / Show less" toggle
document.querySelectorAll('.toggle-excerpt').forEach(btn => {
    btn.addEventListener('click', () => {
        const excerpt = btn.previousElementSibling;
        if (excerpt && excerpt.classList.contains('blog-excerpt')) {
            const expanded = excerpt.classList.toggle('expanded');
            excerpt.classList.toggle('clamp', !expanded);
            btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            btn.textContent = expanded ? 'Show less' : 'Read more';
        }
    });
});

// Navbar background change on scroll
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

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const name = document.getElementById('name')?.value;
        const email = document.getElementById('email')?.value;
        const message = document.getElementById('message')?.value;

        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Simulate form submission
        alert('Thank you for your message! I\'ll get back to you soon.');

        // Reset form
        e.target.reset();
    });
}

// Interactive hover effects
document.querySelectorAll('.skill-card, .blog-card, .timeline-content, .project-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

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

// Hero animations with fadeInUp (no typing effect)
// Typing animation for hero text
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.minHeight = '1.2em'; // Prevent layout shift

        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }

        // Start typing animation after a short delay
        setTimeout(typeWriter, 1000);
    }
});

// Handle initial hash navigation (for long.html)
if (window.location.hash && document.body.classList.contains('smooth-scroll-page')) {
    setTimeout(() => {
        const targetSection = document.querySelector(window.location.hash);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Update active navigation
            const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
            const activeLink = document.querySelector(`a[href="${window.location.hash}"]`);
            if (activeLink) {
                navLinks.forEach(l => l.classList.remove('active'));
                activeLink.classList.add('active');
            }
        }
    }, 500);
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Handle Escape key for mobile menu
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }

    // Handle Enter/Space for custom buttons
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('toggle-excerpt')) {
        e.preventDefault();
        e.target.click();
    }
});

// Performance optimization - Debounce scroll events
let scrollTimeout;
const handleScroll = () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
        // Your scroll handling code here
    }, 16); // ~60fps
};

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

// Console welcome message (optional)
console.log('%cHello! Welcome to Mukharbek\'s Portfolio', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('%cInterested in the code? Check out the repository!', 'color: #764ba2; font-size: 14px;');

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio initialized successfully!');

    // Set home link as active by default on single pages
    if (!document.body.classList.contains('smooth-scroll-page')) {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const activeLink = document.querySelector(`a[href="${currentPath}"]`);
        if (activeLink) {
            document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
            activeLink.classList.add('active');
        }
    }
});
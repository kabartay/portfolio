// const pages = [
//     { id: 'home', url: 'home.html', title: 'Home' },
//     { id: 'about', url: 'about.html', title: 'About' },
//     { id: 'experience', url: 'experience.html', title: 'Experience' },
//     { id: 'blog', url: 'blog.html', title: 'Blog' },
//     { id: 'contact', url: 'contact.html', title: 'Contact' },
// ];

// const mount = document.getElementById('all-sections');

// async function fetchSection({ id, url, title }) {
//     const res = await fetch(url, { credentials: 'same-origin' });
//     const html = await res.text();
//     const doc = new DOMParser().parseFromString(html, 'text/html');
//     const main = doc.querySelector('main') || doc.body;
//     const section = document.createElement('section');
//     section.id = id;
//     section.innerHTML = main.innerHTML;

//     // Optional: if a section title is missing, inject one
//     if (!section.querySelector('.section-title')) {
//         const h2 = document.createElement('h2');
//         h2.className = 'section-title';
//         h2.textContent = title;
//         section.prepend(h2);
//     }
//     mount.appendChild(section);
// }

// (async () => {
//     for (const p of pages) {
//         try { await fetchSection(p); } catch (e) { console.error('Failed to load', p.url, e); }
//     }
// })();
const pages = [
    { id: 'home', url: 'home.html', title: 'Home' },
    { id: 'about', url: 'about.html', title: 'About' },
    { id: 'experience', url: 'experience.html', title: 'Experience' },
    { id: 'blog', url: 'blog.html', title: 'Blog' },
    { id: 'contact', url: 'contact.html', title: 'Contact' },
];

const mount = document.getElementById('all-sections');
const loadingIndicator = document.getElementById('loading-indicator');

async function fetchSection({ id, url, title }) {
    try {
        const res = await fetch(url, { credentials: 'same-origin' });
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        // Get the main content from the page
        const main = doc.querySelector('main') || doc.body;

        // Create the section element
        const section = document.createElement('section');
        section.id = id;
        section.className = `fade-in-section`;

        // Extract content from the main element
        const existingSection = main.querySelector('section');
        if (existingSection) {
            // Copy the entire section structure
            section.innerHTML = existingSection.outerHTML.replace(/<section[^>]*>|<\/section>/g, '');
            section.className = existingSection.className + ' fade-in-section';
        } else {
            // Create proper structure for non-section content
            const mainContent = main.innerHTML.replace(/style="[^"]*"/g, '');
            if (id === 'home') {
                section.innerHTML = mainContent;
                section.className = 'hero fade-in-section';
            } else {
                section.innerHTML = `<div class="container">${mainContent}</div>`;
            }
        }

        mount.appendChild(section);

        console.log(`Loaded section: ${title}`);

        // Trigger animation after a short delay
        setTimeout(() => {
            section.classList.add('visible');
        }, 100);

    } catch (e) {
        console.error('Failed to load', url, e);

        // Create placeholder section on error
        const section = document.createElement('section');
        section.id = id;
        section.className = id;
        section.innerHTML = `
            <div class="container">
                <h2 class="section-title">${title}</h2>
                <p style="text-align: center; color: var(--text-light);">Content could not be loaded.</p>
            </div>
        `;
        mount.appendChild(section);
    }
}

// Enhanced scroll handling
function setupSmoothScrolling() {
    // Update active nav link based on scroll position
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
        rootMargin: '-50% 0px -50% 0px', // Trigger when section is in middle of viewport
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without triggering page reload
                history.pushState(null, '', `#${targetId}`);
            }
        });
    });

    // Handle direct hash navigation (e.g., from external links)
    if (window.location.hash) {
        setTimeout(() => {
            const targetSection = document.getElementById(window.location.hash.substring(1));
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 500); // Delay to ensure content is loaded
    }
}

// Load all sections and setup scrolling
(async () => {
    try {
        for (const p of pages) {
            await fetchSection(p);
        }

        // Hide loading indicator
        loadingIndicator.style.display = 'none';

        // Setup smooth scrolling behavior
        setupSmoothScrolling();

        console.log('All sections loaded successfully');

    } catch (error) {
        console.error('Error loading sections:', error);
        loadingIndicator.innerHTML = 'Error loading content. Please refresh the page.';
    }
})();
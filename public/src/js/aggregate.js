// Pages to stitch together (order = scroll order)
const pages = [
    { id: 'home', url: 'index.html', title: 'Home' },
    { id: 'about', url: 'about.html', title: 'About' },
    { id: 'experience', url: 'experience.html', title: 'Experience' },
    { id: 'blog', url: 'blog.html', title: 'Blog' },
    { id: 'contact', url: 'contact.html', title: 'Contact' },
];

const mount = document.getElementById('all-sections');

async function fetchSection({ id, url, title }) {
    const res = await fetch(url, { credentials: 'same-origin' }); // same origin ok
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html'); // MDN DOMParser
    const main = doc.querySelector('main') || doc.body; // fall back if no <main>
    const section = document.createElement('section');
    section.id = id;
    section.innerHTML = main.innerHTML;
    // Optional: prepend a section heading if the source page doesn't have one
    if (!section.querySelector('.section-title')) {
        const h2 = document.createElement('h2');
        h2.className = 'section-title';
        h2.textContent = title;
        section.prepend(h2);
    }
    mount.appendChild(section);
}

(async () => {
    for (const p of pages) {
        try { await fetchSection(p); }
        catch (e) { console.error('Failed to load', p.url, e); }
    }
})();

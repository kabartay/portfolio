// Contact form: posts to Formspree with fetch and reports status inline instead of leaving the site.
// Loaded by contact.html and by the homepage (index.html), where the form is injected by aggregate.js.
// Bind once, even if this file is loaded more than once
if (!window.__contactDelegatedBound) {
    window.__contactDelegatedBound = true;

    // Global delegated handler — works even if #contactForm is injected later
    document.addEventListener('submit', async (e) => {
        const form = e.target;
        if (!form.matches('#contactForm')) return; // only handle the contact form
        e.preventDefault();

        const statusEl = document.getElementById('formStatus');
        if (statusEl) statusEl.textContent = 'Sending...';

        try {
            const res = await fetch(form.action, {
                method: form.method || 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });

            const txt = await res.text();
            console.log('Formspree status:', res.status, txt);

            if (res.ok) {
                form.reset();
                if (statusEl) statusEl.textContent = 'Thanks! I’ll get back to you shortly.';
            } else {
                let msg = txt;
                try { msg = JSON.parse(txt)?.errors?.[0]?.message || txt; } catch { }
                if (statusEl) statusEl.textContent = 'Error: ' + msg;
            }
        } catch (err) {
            console.error(err);
            if (statusEl) statusEl.textContent = 'Network error. Please try again.';
        }
    });
}

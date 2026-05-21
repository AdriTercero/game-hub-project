/* ── Section tabs active (mobile) ────────────────── */
document.querySelectorAll('.section-tabs a').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.section-tabs a').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

/* ── Highlight section tabs on scroll (mobile) ────── */
if (window.innerWidth <= 768) {
  const tabLinks   = document.querySelectorAll('.section-tabs a');
  const sectionEls = ['ranking', 'noticias', 'blog', 'streams', 'agenda']
    .map(id => document.getElementById(id)).filter(Boolean);

  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        tabLinks.forEach(t => t.classList.remove('active'));
        const match = [...tabLinks].find(t => t.getAttribute('href') === '#' + e.target.id);
        if (match) match.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sectionEls.forEach(el => secObs.observe(el));
}

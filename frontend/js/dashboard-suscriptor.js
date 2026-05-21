    /* ── Sidebar nav ───────────────────────────────────── */
    function setActive(el) {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      el.classList.add('active');
    }
    /* ── Tabs ──────────────────────────────────────────── */
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
      });
    });

    /* ── Select streamer ───────────────────────────────── */
    function selectStreamer(card, name, meta, initials) {
      document.querySelectorAll('.streamer-card').forEach(c => c.classList.remove('featured'));
      card.classList.add('featured');
      document.getElementById('playerName').textContent = name + ' · jugando Juego X';
      document.getElementById('playerViewers').textContent = meta;
    }

    /* ── Load embed ────────────────────────────────────── */
	function loadEmbed(platform, id) {
	  const embed = document.getElementById('playerEmbed');
	  let src = '';
	  if (platform === 'twitch') {
		const parent = location.hostname || 'localhost';
		src = `https://player.twitch.tv/?channel=${id}&parent=${parent}&autoplay=true`;
	  } else {
		src = `https://www.youtube.com/embed/${id}?autoplay=1`;
	  }
	  embed.innerHTML = `<iframe src="${src}" allowfullscreen allow="autoplay"></iframe>`;
	}
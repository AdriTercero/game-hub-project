    /* ── Show/hide password ────────────────────────────── */
    const passInput = document.getElementById('password');
    const togglePass = document.getElementById('togglePass');
    const eyeShow = document.getElementById('eyeShow');
    const eyeHide = document.getElementById('eyeHide');

    togglePass.addEventListener('click', () => {
        const isHidden = passInput.type === 'password';
        passInput.type = isHidden ? 'text' : 'password';
        eyeShow.style.display = isHidden ? 'none' : '';
        eyeHide.style.display = isHidden ? '' : 'none';
    });

    /* ── CU-02: Login logic with 5-attempt lockout ─────── */
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_SECS = 300; // 5 minutos
    const STORAGE_KEY = 'gh-login-state';

    // Load persisted state
    let state = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null') || {
        attempts: 0,
        lockedUntil: null
    };

    const form = document.getElementById('loginForm');
    const alertBox = document.getElementById('alertError');
    const alertText = document.getElementById('alertText');
    const attemptInfo = document.getElementById('attemptInfo');
    const lockoutBox = document.getElementById('lockoutBox');
    const lockTimer = document.getElementById('lockoutTimer');
    const btnSubmit = document.getElementById('btnSubmit');
    const emailInput = document.getElementById('email');

    let countdownInterval = null;

    function saveState() {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function showAlert(msg) {
        alertText.textContent = msg;
        alertBox.classList.add('visible');
    }

    function hideAlert() {
        alertBox.classList.remove('visible');
    }

    function setError(input) {
        input.classList.add('error');
        input.addEventListener('input', () => input.classList.remove('error'), {
            once: true
        });
    }

    function shake() {
        const card = document.getElementById('loginCard');
        card.classList.remove('shake');
        void card.offsetWidth; // reflow to restart animation
        card.classList.add('shake');
    }

    function formatTime(secs) {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function startLockout(remainingSecs) {
        // Show lockout UI, hide form
        form.style.display = 'none';
        attemptInfo.classList.remove('visible');
        lockoutBox.classList.add('visible');
        btnSubmit.disabled = true;

        lockTimer.textContent = formatTime(Math.ceil(remainingSecs));

        clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            remainingSecs--;
            if (remainingSecs <= 0) {
                clearInterval(countdownInterval);
                endLockout();
            } else {
                lockTimer.textContent = formatTime(remainingSecs);
            }
        }, 1000);
    }

    function endLockout() {
        state.attempts = 0;
        state.lockedUntil = null;
        saveState();
        lockoutBox.classList.remove('visible');
        form.style.display = '';
        hideAlert();
        btnSubmit.disabled = false;
    }

    function checkLockout() {
        if (!state.lockedUntil) return false;
        const remaining = (state.lockedUntil - Date.now()) / 1000;
        if (remaining > 0) {
            startLockout(remaining);
            return true;
        }
        // Lockout expired
        state.lockedUntil = null;
        state.attempts = 0;
        saveState();
        return false;
    }

    function updateAttemptInfo() {
        const left = MAX_ATTEMPTS - state.attempts;
        if (state.attempts > 0 && state.attempts < MAX_ATTEMPTS) {
            attemptInfo.textContent = `Intento ${state.attempts} de ${MAX_ATTEMPTS}. ${left} intento${left !== 1 ? 's' : ''} restante${left !== 1 ? 's' : ''}.`;
            attemptInfo.classList.add('visible');
        }
    }

    // Check lockout on page load
    checkLockout();

    /* Real API call — replaces fake credential check */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (checkLockout()) return;

        const email = emailInput.value.trim();
        const password = passInput.value;

        // Client-side validation (keep as-is)
        let valid = true;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError(emailInput);
            showAlert('Introduce un email válido.');
            shake();
            valid = false;
        }
        if (!password) {
            setError(passInput);
            if (valid) {
                showAlert('Introduce tu contraseña.');
                shake();
            }
            valid = false;
        }
        if (!valid) return;
        hideAlert();

        // API call
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    identifier: email,
                    password
                })
            });

            const data = await res.json();

            if (res.status === 423) {
                // Backend says account is locked
                state.lockedUntil = Date.now() + LOCKOUT_SECS * 1000;
                saveState();
                startLockout(LOCKOUT_SECS);
                return;
            }

            if (!res.ok) {
                // Wrong credentials
                state.attempts++;
                saveState();
                if (state.attempts >= MAX_ATTEMPTS) {
                    state.lockedUntil = Date.now() + LOCKOUT_SECS * 1000;
                    saveState();
                    startLockout(LOCKOUT_SECS);
                    return;
                }
                setError(emailInput);
                setError(passInput);
                showAlert('Email o contraseña incorrectos.');
                updateAttemptInfo();
                shake();
                return;
            }

            // SUCCESS
            btnSubmit.textContent = '✓ Accediendo...';
            btnSubmit.style.background = 'var(--success)';
            btnSubmit.style.boxShadow = 'none';
            setTimeout(() => {
                const role = data.role_id;
                window.location.href = (role === 1 || role === 2) ?
                    'dashboard-admin.html' :
                    'dashboard-suscriptor.html';
            }, 800);

        } catch (err) {
            showAlert('Error de conexión. Inténtalo de nuevo.');
            shake();
        }
    });
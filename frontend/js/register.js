/* ── Password toggles ──────────────────────────────── */
function makeToggle(btnId, inputId, showId, hideId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    const show = document.getElementById(showId);
    const hide = document.getElementById(hideId);
    btn.addEventListener('click', () => {
        const visible = input.type === 'password';
        input.type = visible ? 'text' : 'password';
        show.style.display = visible ? 'none' : '';
        hide.style.display = visible ? '' : 'none';
    });
}
makeToggle('togglePass1', 'password', 'eye1Show', 'eye1Hide');
makeToggle('togglePass2', 'confirm', 'eye2Show', 'eye2Hide');

/* ── Password strength meter ───────────────────────── */
const passInput = document.getElementById('password');
const strengthWrap = document.getElementById('strengthWrap');
const strengthFill = document.getElementById('strengthFill');
const strengthLbl = document.getElementById('strengthLabel');

const levels = [{
        label: 'Muy débil',
        pct: 20,
        color: '#E05252'
    },
    {
        label: 'Débil',
        pct: 40,
        color: '#D97757'
    },
    {
        label: 'Aceptable',
        pct: 60,
        color: '#D9A43A'
    },
    {
        label: 'Fuerte',
        pct: 80,
        color: '#6AAD69'
    },
    {
        label: 'Muy fuerte',
        pct: 100,
        color: '#5BAD5A'
    },
];

function scorePassword(p) {
    let s = 0;
    if (p.length >= 8) s++;
    if (p.length >= 12) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(s, 5);
}

passInput.addEventListener('input', () => {
    const v = passInput.value;
    if (!v) {
        strengthWrap.classList.remove('visible');
        return;
    }
    strengthWrap.classList.add('visible');
    const score = scorePassword(v);
    const lvl = levels[Math.max(score - 1, 0)];
    strengthFill.style.width = lvl.pct + '%';
    strengthFill.style.background = lvl.color;
    strengthLbl.textContent = lvl.label;
    strengthLbl.style.color = lvl.color;
});

/* ── Validation helpers ────────────────────────────── */
const inputs = {
    fullname: document.getElementById('fullname'),
    email: document.getElementById('email'),
    username: document.getElementById('username'),
    password: passInput,
    confirm: document.getElementById('confirm'),
};
const hints = {
    name: document.getElementById('hintName'),
    email: document.getElementById('hintEmail'),
    user: document.getElementById('hintUser'),
    pass: document.getElementById('hintPass'),
    confirm: document.getElementById('hintConfirm'),
};

function setFieldState(input, hint, isOk) {
    input.classList.toggle('error', !isOk);
    input.classList.toggle('ok', isOk);
    if (hint) hint.classList.toggle('visible', !isOk);
}

function validateAll() {
    const name = inputs.fullname.value.trim();
    const email = inputs.email.value.trim();
    const user = inputs.username.value.trim().replace(/^@/, '');
    const pass = inputs.password.value;
    const conf = inputs.confirm.value;
    const terms = document.getElementById('terms').checked;

    const nameOk = name.length >= 2;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const userOk = /^[a-zA-Z0-9_]{3,}$/.test(user);
    const passOk = pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass);
    const confOk = pass === conf && conf.length > 0;

    setFieldState(inputs.fullname, hints.name, nameOk);
    setFieldState(inputs.email, hints.email, emailOk);
    setFieldState(inputs.username, hints.user, userOk);
    setFieldState(inputs.password, hints.pass, passOk);
    setFieldState(inputs.confirm, hints.confirm, confOk);

    const termsLabel = document.getElementById('termsLabel');
    termsLabel.classList.toggle('error-check', !terms);

    return nameOk && emailOk && userOk && passOk && confOk && terms;
}

/* Inline validation on blur */
Object.values(inputs).forEach(inp => {
    inp.addEventListener('blur', () => {
        if (inp.value.trim()) validateAll();
    });
});

/* ── Form submit ───────────────────────────────────── */
const form = document.getElementById('registerForm');
const alertError = document.getElementById('alertError');
const alertOk = document.getElementById('alertSuccess');
const btnSubmit = document.getElementById('btnSubmit');

function shake() {
    const card = document.getElementById('registerCard');
    card.classList.remove('shake');
    void card.offsetWidth;
    card.classList.add('shake');
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertError.classList.remove('visible');

    if (!validateAll()) {
        alertError.classList.add('visible');
        shake();
        return;
    }

    btnSubmit.disabled = true;
    btnSubmit.textContent = t('register.creando');

    const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: inputs.username.value.trim().replace(/^@/, ''),
            email: inputs.email.value.trim(),
            password: inputs.password.value,
        })
    });

    const data = await res.json();

    if (!res.ok) {
        const emailTaken = data.error?.includes('email') || data.error?.includes('usuario');
        setFieldState(inputs.email, null, false);
        hints.email.textContent = emailTaken ? t('register.error.email_taken') : data.error;
        hints.email.classList.add('visible');
        document.getElementById('alertErrorText').textContent = data.error;
        alertError.classList.add('visible');
        shake();
        btnSubmit.disabled = false;
        btnSubmit.textContent = t('register.submit');
        return;
    }

    form.style.display = 'none';
    alertOk.classList.add('visible');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2500);
});
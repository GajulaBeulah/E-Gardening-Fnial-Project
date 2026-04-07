// resigtion.js - client-side validation and interactions
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('regForm');
  const pass = document.getElementById('password');
  const pass2 = document.getElementById('confirmPassword');
  const msg = document.getElementById('formMessage');
  const toggleBtns = document.querySelectorAll('.toggle-pass');
  const strengthBar = document.querySelector('.password-strength > i');

  toggleBtns.forEach(btn => btn.addEventListener('click', e => {
    const target = document.querySelector(btn.dataset.target);
    if (!target) return;
    target.type = target.type === 'password' ? 'text' : 'password';
    btn.textContent = target.type === 'password' ? 'Show' : 'Hide';
  }));

  function strengthScore(s) {
    let score = 0;
    if (s.length >= 8) score += 1;
    if (/[A-Z]/.test(s)) score += 1;
    if (/[0-9]/.test(s)) score += 1;
    if (/[^A-Za-z0-9]/.test(s)) score += 1;
    return score;
  }

  pass.addEventListener('input', () => {
    const pct = (strengthScore(pass.value) / 4) * 100;
    strengthBar.style.width = pct + '%';
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.textContent = '';
    let errors = [];
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const pwd = pass.value;
    const pwd2 = pass2.value;
    const username = form.username.value.trim();
    const newsletter = !!form.newsletter && form.newsletter.checked;
    const marketing = form.marketing && form.marketing.value;

    if (name.length < 2) errors.push('Enter a valid name');
    if (!/^\S+@\S+\.\S+$/.test(email)) errors.push('Enter a valid email');
    if (!/^\d{10}$/.test(phone)) errors.push('Phone must be 10 digits');
    if (pwd.length < 8) errors.push('Password must be at least 8 characters');
    if (pwd !== pwd2) errors.push('Passwords do not match');
    if (!form.terms.checked) errors.push('You must accept terms');

    if (errors.length) {
      msg.className = 'error';
      msg.innerHTML = errors.map(e => '<div>' + e + '</div>').join('');
      return;
    }

    // Demo: Save user to localStorage (do NOT use this for production)
    const STORAGE_KEY = 'garden_users_v1';
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    // simple duplicate checks
    if (existing.some(u => u.email === email)) {
      msg.className = 'error';
      msg.textContent = 'An account with this email already exists.';
      return;
    }
    if (username && existing.some(u => u.username === username)) {
      msg.className = 'error';
      msg.textContent = 'Username already taken.';
      return;
    }

    // store a minimal record; obfuscate password with btoa (demo-only)
    const record = { name, email, phone, username, newsletter, marketing, password: btoa(pwd), created: new Date().toISOString() };
    existing.push(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

    msg.className = 'success';
    msg.textContent = 'Registration successful — account created locally (demo).';
    form.reset();
    strengthBar.style.width = '0%';
    // Optional: redirect after short delay
    setTimeout(() => {
      // location.href = 'flowers.html'; // uncomment to redirect to shop
    }, 900);
  });
});

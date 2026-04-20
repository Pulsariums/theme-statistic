async function loadThemes() {
  const list = document.getElementById('themeList');
  try {
    const res = await fetch('/api/themes');
    const data = await res.json();
    if (!data.themes.length) {
      list.innerHTML = '<p>Henüz tema yok.</p>';
      return;
    }

    list.innerHTML = data.themes.map(theme => `
      <div class="theme-item">
        <strong>${theme.name}</strong> <span style="color:#94a3b8;">(${theme.slug})</span>
        <p>${theme.description}</p>
        <p style="font-size:.9em;color:#94a3b8;">Son güncelleme: ${new Date(theme.updatedAt).toLocaleString()}</p>
      </div>
    `).join('');
  } catch (err) {
    list.textContent = 'Temalar yüklenemedi.';
    console.error(err);
  }
}

async function submitTheme() {
  const name = document.getElementById('themeName').value.trim();
  const slug = document.getElementById('themeSlug').value.trim();
  const description = document.getElementById('themeDesc').value.trim();
  const result = document.getElementById('submitResult');

  if (!name || !slug) {
    result.textContent = 'Tema adı ve slug gereklidir.';
    return;
  }

  try {
    const res = await fetch('/api/themes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug, description })
    });

    const body = await res.json();
    result.textContent = body.message || 'Gönderildi.';
    loadThemes();
  } catch (err) {
    result.textContent = 'Gönderme hatası.';
    console.error(err);
  }
}

document.getElementById('submitBtn').addEventListener('click', submitTheme);
loadThemes();
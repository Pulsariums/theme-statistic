const API_BASE = '';
let currentUser = null;
let authToken = localStorage.getItem('pulsarThemesAuthToken') || '';
let loadedProjects = [];
let loadedTeams = [];
let loadedThemes = [];

function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (authToken) {
    headers['x-access-token'] = authToken;
  }
  return headers;
}

function showMessage(message, type = 'info') {
  const bar = document.getElementById('messageBar');
  if (!bar) return;
  bar.textContent = message;
  bar.style.display = 'block';
  bar.style.borderColor = type === 'error' ? 'rgba(244,63,94,.4)' : 'rgba(99,102,241,.16)';
  bar.style.background = type === 'error' ? 'rgba(244,63,94,.12)' : 'rgba(99,102,241,.12)';
  bar.style.color = type === 'error' ? '#ffe4e6' : '#e2e8f0';
  setTimeout(() => { bar.style.display = 'none'; }, 4500);
}

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'same-origin',
    ...options,
    headers: { ...getAuthHeaders(), ...(options.headers || {}) }
  });
  const json = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, body: json };
}

function setAuthToken(token) {
  authToken = token;
  if (token) {
    localStorage.setItem('pulsarThemesAuthToken', token);
  } else {
    localStorage.removeItem('pulsarThemesAuthToken');
  }
}

async function loadProfile() {
  if (!authToken) {
    renderAuthPanel();
    renderWorkspacePanel();
    return;
  }
  const result = await apiFetch('/api/auth?action=me');
  if (result.ok && result.body.user) {
    currentUser = result.body.user;
  } else {
    currentUser = null;
    setAuthToken('');
  }
  renderAuthPanel();
  renderWorkspacePanel();
}

async function loadProjects() {
  const result = await apiFetch('/api/projects');
  loadedProjects = result.ok ? (result.body.projects || []) : [];
  renderWorkspacePanel();
}

async function loadTeams() {
  const result = await apiFetch('/api/teams');
  loadedTeams = result.ok ? (result.body.teams || []) : [];
  renderWorkspacePanel();
}

async function loadThemes() {
  const result = await apiFetch('/api/themes');
  loadedThemes = result.ok ? (result.body.themes || []) : [];
  renderThemeList();
}

function renderAuthPanel() {
  const panel = document.getElementById('authPanel');
  if (!panel) return;
  if (!currentUser) {
    panel.innerHTML = `
      <h3>Hesap Oluştur veya Giriş Yap</h3>
      <div class="form" id="authForms">
        <div class="form-field">
          <label for="authTab">Hazır mısınız?</label>
          <select id="authTab">
            <option value="login">Giriş</option>
            <option value="register">Kayıt</option>
          </select>
        </div>
        <div class="form-field">
          <label for="authEmail">E-posta</label>
          <input id="authEmail" type="email" placeholder="you@example.com" autocomplete="email" />
        </div>
        <div class="form-field" id="authUsernameField" style="display:none;">
          <label for="authUsername">Kullanıcı Adı</label>
          <input id="authUsername" type="text" placeholder="pulsarCreator" autocomplete="username" />
        </div>
        <div class="form-field">
          <label for="authPassword">Şifre</label>
          <input id="authPassword" type="password" placeholder="••••••••" autocomplete="current-password" />
        </div>
        <button id="authSubmit" class="btn btn-primary">Giriş Yap</button>
        <p class="form-note">Yeni hesap açan kullanıcılar otomatik olarak creator rolüyle başlar. Admin hesabı yalnızca sahip tarafından kontrol edilir.</p>
      </div>
    `;
    document.getElementById('authTab').addEventListener('change', toggleAuthMode);
    document.getElementById('authSubmit').addEventListener('click', handleAuthSubmit);
    return;
  }

  panel.innerHTML = `
    <h3>Hoşgeldin, ${currentUser.username}</h3>
    <div class="user-badge">Rol: ${currentUser.role}</div>
    <p class="form-note">Kendi projelerini ve temalarını yönet. Admin hesabına başka bir kullanıcı asla erişemez.</p>
    <div class="form-field">
      <label>Profil</label>
      <p>${currentUser.email}</p>
    </div>
    <button id="logoutBtn" class="btn btn-secondary">Çıkış Yap</button>
  `;
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

function toggleAuthMode() {
  const mode = document.getElementById('authTab').value;
  document.getElementById('authUsernameField').style.display = mode === 'register' ? 'grid' : 'none';
  document.getElementById('authSubmit').textContent = mode === 'register' ? 'Kaydol' : 'Giriş Yap';
}

async function handleAuthSubmit() {
  const mode = document.getElementById('authTab').value;
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value.trim();
  const username = document.getElementById('authUsername') ? document.getElementById('authUsername').value.trim() : '';

  if (!email || !password || (mode === 'register' && !username)) {
    showMessage('Lütfen gerekli alanları doldurun.', 'error');
    return;
  }

  const result = await apiFetch('/api/auth', {
    method: 'POST',
    body: JSON.stringify({ action: mode, email, password, username })
  });

  if (!result.ok) {
    showMessage(result.body.message || 'Giriş/Kayıt sırasında hata oluştu.', 'error');
    return;
  }

  if (result.body.token) {
    setAuthToken(result.body.token);
    currentUser = result.body.user;
    showMessage(result.body.message || 'Başarılı.', 'info');
    await refreshAll();
    return;
  }

  showMessage('Beklenmeyen bir sorun oluştu.', 'error');
}

function handleLogout() {
  currentUser = null;
  setAuthToken('');
  showMessage('Çıkış yapıldı.', 'info');
  renderAuthPanel();
  renderWorkspacePanel();
}

function renderWorkspacePanel() {
  const panel = document.getElementById('workspacePanel');
  if (!panel) return;
  const projectOptions = loadedProjects.map((project) => `<option value="${project.id}">${project.name}</option>`).join('');
  const userProjects = loadedProjects.filter((project) => currentUser && (project.ownerId === currentUser.id || (project.teamId && loadedTeams.some((team) => team.id === project.teamId && team.memberIds.includes(currentUser.id)))));
  const userThemes = loadedThemes.filter((theme) => currentUser && theme.ownerId === currentUser.id);
  const userTeams = loadedTeams.filter((team) => currentUser && (team.ownerId === currentUser.id || team.memberIds.includes(currentUser.id)));

  if (!currentUser) {
    panel.innerHTML = `
      <h3>Proje ve Tema İşlemleri</h3>
      <p class="form-note">Bir hesapla giriş yaparak proje oluşturabilir, takım yaratabilir ve tema yükleyebilirsiniz.</p>
    `;
    return;
  }

  panel.innerHTML = `
    <h3>Çalışma Alanınız</h3>
    <p class="form-note">Seçtiğiniz projeye bağlı olarak tema yükleme ve plugin kontrolü yapabilirsiniz.</p>
    <div class="form-field"><label>Mevcut Takımlar</label><p>${userTeams.length} takım bulundu.</p></div>
    <div class="form-field"><label>Mevcut Projeler</label><p>${userProjects.length} proje bulundu.</p></div>
    <div class="form-field"><label>Mevcut Temalar</label><p>${userThemes.length} tema bulundu.</p></div>
    <hr class="divider" />
    <div class="form">
      <h4>Yeni Takım Oluştur</h4>
      <div class="form-field"><label for="teamName">Takım Adı</label><input id="teamName" placeholder="OpenAnime Creators" /></div>
      <div class="form-field"><label for="teamDescription">Takım Açıklaması</label><textarea id="teamDescription" placeholder="Takım açıklaması..."></textarea></div>
      <button id="createTeamBtn" class="btn btn-primary">Takım Oluştur</button>
    </div>
    <hr class="divider" />
    <div class="form">
      <h4>Yeni Proje Oluştur</h4>
      <div class="form-field"><label for="projectName">Proje Adı</label><input id="projectName" placeholder="OpenAnime Proje" /></div>
      <div class="form-field"><label for="projectSlug">Proje Slug</label><input id="projectSlug" placeholder="openanime-project" /></div>
      <div class="form-field"><label for="projectDescription">Açıklama</label><textarea id="projectDescription" placeholder="Proje tanıtım metni..."></textarea></div>
      <div class="form-field"><label for="projectThumbnail">Tanıtım Görseli</label><input id="projectThumbnail" placeholder="https://..." /></div>
      <button id="createProjectBtn" class="btn btn-primary">Proje Oluştur</button>
    </div>
    <hr class="divider" />
    <div class="form">
      <h4>Yeni Tema Yükle</h4>
      <div class="form-field"><label for="themeName">Tema Adı</label><input id="themeName" placeholder="OpenAnime Starter" /></div>
      <div class="form-field"><label for="themeSlug">Tema Slug</label><input id="themeSlug" placeholder="openanime" /></div>
      <div class="form-field"><label for="themeId">Tema ID</label><input id="themeId" placeholder="theme_pulsar" /></div>
      <div class="form-field"><label for="themeDescription">Tema Açıklaması</label><textarea id="themeDescription" placeholder="Kısa açıklama..."></textarea></div>
      <div class="form-field"><label for="themeProject">Proje Bağlantısı</label><select id="themeProject">${projectOptions}</select></div>
      <button id="createThemeBtn" class="btn btn-primary">Tema Gönder</button>
      <button id="ensurePluginBtn" class="btn btn-secondary">Projede Plugin Kontrol Et</button>
    </div>
  `;

  document.getElementById('createTeamBtn').addEventListener('click', handleCreateTeam);
  document.getElementById('createProjectBtn').addEventListener('click', handleCreateProject);
  document.getElementById('createThemeBtn').addEventListener('click', handleCreateTheme);
  document.getElementById('ensurePluginBtn').addEventListener('click', handleEnsurePlugin);
}

async function handleCreateProject() {
  const name = document.getElementById('projectName').value.trim();
  const slug = document.getElementById('projectSlug').value.trim();
  const description = document.getElementById('projectDescription').value.trim();
  const thumbnailUrl = document.getElementById('projectThumbnail').value.trim();

  if (!name || !slug) {
    showMessage('Proje adı ve slug gereklidir.', 'error');
    return;
  }

  const result = await apiFetch('/api/projects', {
    method: 'POST',
    body: JSON.stringify({ name, slug, description, thumbnailUrl })
  });

  if (!result.ok) {
    showMessage(result.body.message || 'Proje oluşturulamadı.', 'error');
    return;
  }

  showMessage('Proje oluşturuldu.', 'info');
  await refreshAll();
}

async function handleCreateTeam() {
  const name = document.getElementById('teamName').value.trim();
  const description = document.getElementById('teamDescription').value.trim();

  if (!name) {
    showMessage('Takım adı gereklidir.', 'error');
    return;
  }

  const result = await apiFetch('/api/teams', {
    method: 'POST',
    body: JSON.stringify({ name, description })
  });

  if (!result.ok) {
    showMessage(result.body.message || 'Takım oluşturulamadı.', 'error');
    return;
  }

  showMessage('Takım oluşturuldu.', 'info');
  await refreshAll();
}

async function handleCreateTheme() {
  const name = document.getElementById('themeName').value.trim();
  const slug = document.getElementById('themeSlug').value.trim();
  const themeId = document.getElementById('themeId').value.trim();
  const description = document.getElementById('themeDescription').value.trim();
  const projectId = document.getElementById('themeProject').value;

  if (!name || !slug || !themeId) {
    showMessage('Tema adı, slug ve themeId gereklidir.', 'error');
    return;
  }

  const result = await apiFetch('/api/themes', {
    method: 'POST',
    body: JSON.stringify({ name, slug, description, projectId, themeId })
  });

  if (!result.ok) {
    showMessage(result.body.message || 'Tema yüklenemedi.', 'error');
    return;
  }

  showMessage(result.body.message || 'Tema kaydedildi.', 'info');
  await refreshAll();
}

async function handleEnsurePlugin() {
  const projectId = document.getElementById('themeProject').value;
  if (!projectId) {
    showMessage('Önce bir proje seçin.', 'error');
    return;
  }

  const result = await apiFetch('/api/projects', {
    method: 'PATCH',
    body: JSON.stringify({ projectId, action: 'ensurePlugin' })
  });

  if (!result.ok) {
    showMessage(result.body.message || 'Plugin kontrolü başarısız oldu.', 'error');
    return;
  }

  showMessage(result.body.message || 'Plugin kontrol edildi.', 'info');
  await refreshAll();
}

function renderThemeList() {
  const list = document.getElementById('themeList');
  if (!list) return;
  if (!loadedThemes.length) {
    list.innerHTML = `
      <div class="surface-card"><h3>Henüz tema yok</h3><p class="form-note">Temalar sunucudan yükleniyor veya henüz oluşturulmadı.</p></div>
    `;
    return;
  }

  list.innerHTML = loadedThemes.map((theme) => {
    const project = loadedProjects.find((project) => project.id === theme.projectId) || {};
    return `
      <div class="surface-card theme-card">
        <div>
          <span class="theme-meta"><strong>${theme.name}</strong></span>
          <h4>${theme.name}</h4>
          <p>${theme.description || 'Açıklama eklenmemiş.'}</p>
        </div>
        <div class="theme-meta">
          <span>${theme.slug}</span>
          <span>${theme.themeId}</span>
          <span>Versiyon ${theme.version}</span>
        </div>
        <div class="theme-meta">
          <span>Durum: ${theme.status}</span>
          <span>Proje: ${project.name || 'Bağlı değil'}</span>
        </div>
      </div>
    `;
  }).join('');
}

async function refreshAll() {
  await loadProfile();
  await loadProjects();
  await loadTeams();
  await loadThemes();
}

document.addEventListener('DOMContentLoaded', async () => {
  await refreshAll();
});

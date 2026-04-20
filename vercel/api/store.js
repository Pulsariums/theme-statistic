const crypto = require('crypto');

function now() {
  return new Date().toISOString();
}

function hashPassword(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

const users = [
  {
    id: 'user_admin',
    username: 'pulsar-admin',
    email: 'admin@pulsar.example',
    passwordHash: hashPassword('Admin@1234'),
    role: 'admin',
    createdAt: now(),
    lastLogin: null,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80',
    bio: 'Platform yöneticisi ve tema akışının garantörü.'
  }
];

const sessions = {};

const teams = [
  {
    id: 'team_openanime',
    name: 'OpenAnime Geliştiricileri',
    description: 'OpenAnime temalarını ve proje entegrasyonlarını yöneten takım.',
    ownerId: 'user_admin',
    memberIds: ['user_admin'],
    projectIds: ['proj_openanime'],
    createdAt: now()
  }
];

const projects = [
  {
    id: 'proj_openanime',
    name: 'OpenAnime Tema Projesi',
    slug: 'openanime-project',
    description: 'OpenAnime için tema üretim ve dağıtım projesi.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?auto=format&fit=crop&w=800&q=80',
    ownerId: 'user_admin',
    teamId: 'team_openanime',
    pluginInjected: true,
    createdAt: now(),
    updatedAt: now()
  }
];

const themes = [
  {
    id: 'theme_openanime',
    themeId: 'theme_pulsar',
    slug: 'openanime',
    name: 'OpenAnime Starter',
    description: 'OpenAnime için örnek tema, Vercel tracking pixel ile kullanım sayımı için doğru yapı.',
    ownerId: 'user_admin',
    projectId: 'proj_openanime',
    version: '1.0.0',
    status: 'published',
    createdAt: now(),
    updatedAt: now()
  }
];

const themeUsage = [];

function createFingerprint(req) {
  const values = [
    req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown',
    req.headers['user-agent'] || '',
    req.headers['accept-language'] || '',
    req.headers['sec-ch-ua'] || '',
    req.headers['sec-ch-ua-platform'] || '',
    req.headers['referer'] || '',
    req.url || ''
  ].join('|');
  return crypto.createHash('sha256').update(values).digest('hex');
}

function getUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === (email || '').toLowerCase());
}

function getUserById(id) {
  return users.find((user) => user.id === id);
}

function createUser({ username, email, password }) {
  const id = `user_${crypto.randomBytes(6).toString('hex')}`;
  const user = {
    id,
    username,
    email,
    passwordHash: hashPassword(password),
    role: 'creator',
    createdAt: now(),
    lastLogin: now(),
    avatarUrl: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=80&q=80',
    bio: 'Yeni tema üreticisi.'
  };
  users.push(user);
  return user;
}

function createSession(userId) {
  const token = generateToken();
  sessions[token] = { userId, createdAt: now() };
  return token;
}

function verifyToken(req) {
  const token = (req.headers['x-access-token'] || req.headers.authorization || '').replace('Bearer ', '');
  const session = sessions[token];
  if (!session) {
    return null;
  }
  return getUserById(session.userId) || null;
}

function ensureProjectPlugin(projectId) {
  const project = projects.find((item) => item.id === projectId);
  if (!project) {
    return null;
  }
  if (!project.pluginInjected) {
    project.pluginInjected = true;
    project.updatedAt = now();
  }
  return project;
}

function recordThemeUsage({ theme, themeId, projectId, ownerId, fingerprint }) {
  const nowTs = Date.now();
  const existing = themeUsage.find((entry) => entry.themeId === themeId && entry.fingerprint === fingerprint && nowTs - entry.timestamp < 1000 * 60 * 60 * 24);
  if (existing) {
    return false;
  }
  themeUsage.push({ theme, themeId, projectId, ownerId, fingerprint, timestamp: nowTs, createdAt: now() });
  return true;
}

module.exports = {
  hashPassword,
  generateToken,
  getUserByEmail,
  getUserById,
  createUser,
  createSession,
  verifyToken,
  ensureProjectPlugin,
  recordThemeUsage,
  users,
  sessions,
  teams,
  projects,
  themes,
  themeUsage
};

const { getUserByEmail, createUser, createSession, hashPassword, verifyToken } = require('./store');

module.exports = function handler(req, res) {
  if (req.method === 'POST') {
    const { action, username, email, password } = req.body || {};

    if (action === 'register') {
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'username, email ve password gereklidir.' });
      }
      if (getUserByEmail(email)) {
        return res.status(409).json({ message: 'Bu e-posta zaten kayıtlı.' });
      }
      const user = createUser({ username, email, password });
      const token = createSession(user.id);
      return res.status(201).json({ message: 'Kayıt başarılı.', user: { id: user.id, username: user.username, email: user.email, role: user.role, avatarUrl: user.avatarUrl }, token });
    }

    if (action === 'login') {
      if (!email || !password) {
        return res.status(400).json({ message: 'email ve password gereklidir.' });
      }
      const user = getUserByEmail(email);
      if (!user || user.passwordHash !== hashPassword(password)) {
        return res.status(401).json({ message: 'Kimlik doğrulama başarısız.' });
      }
      user.lastLogin = new Date().toISOString();
      const token = createSession(user.id);
      return res.status(200).json({ message: 'Giriş başarılı.', user: { id: user.id, username: user.username, email: user.email, role: user.role, avatarUrl: user.avatarUrl }, token });
    }

    return res.status(400).json({ message: 'Geçersiz action parametresi.' });
  }

  if (req.method === 'GET') {
    if (req.query.action === 'me') {
      const user = verifyToken(req);
      if (!user) {
        return res.status(401).json({ message: 'Yetkisiz.' });
      }
      return res.status(200).json({ user: { id: user.id, username: user.username, email: user.email, role: user.role, avatarUrl: user.avatarUrl, bio: user.bio } });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).json({ message: 'Yöntem izinli değil.' });
};

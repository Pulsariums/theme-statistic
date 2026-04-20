const { verifyToken, users } = require('./store');

module.exports = function handler(req, res) {
  const me = verifyToken(req);
  if (!me) {
    return res.status(401).json({ message: 'Yetkisiz.' });
  }

  if (req.method === 'GET') {
    if (me.role !== 'admin') {
      return res.status(403).json({ message: 'Yalnızca admin görebilir.' });
    }
    return res.status(200).json({ users: users.map(({ passwordHash, ...rest }) => rest) });
  }

  res.setHeader('Allow', 'GET');
  res.status(405).json({ message: 'Yöntem izinli değil.' });
};

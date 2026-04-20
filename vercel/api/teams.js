const { verifyToken, teams, users } = require('./store');

module.exports = function handler(req, res) {
  const me = verifyToken(req);
  if (!me) {
    return res.status(401).json({ message: 'Yetkisiz.' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ teams });
  }

  if (req.method === 'POST') {
    const { name, description } = req.body || {};
    if (!name) {
      return res.status(400).json({ message: 'Takım adı gereklidir.' });
    }
    const id = `team_${Math.random().toString(36).slice(2, 10)}`;
    const team = {
      id,
      name,
      description: description || '',
      ownerId: me.id,
      memberIds: [me.id],
      projectIds: [],
      createdAt: new Date().toISOString()
    };
    teams.push(team);
    return res.status(201).json({ team });
  }

  if (req.method === 'PATCH') {
    const { teamId, action, userId } = req.body || {};
    const team = teams.find((item) => item.id === teamId);
    if (!team) {
      return res.status(404).json({ message: 'Takım bulunamadı.' });
    }
    if (team.ownerId !== me.id && me.role !== 'admin') {
      return res.status(403).json({ message: 'Takım üzerinde yetkiniz yok.' });
    }
    if (action === 'addMember') {
      if (!userId) {
        return res.status(400).json({ message: 'userId gereklidir.' });
      }
      if (!users.find((u) => u.id === userId)) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
      }
      if (!team.memberIds.includes(userId)) {
        team.memberIds.push(userId);
      }
      return res.status(200).json({ team });
    }
    res.status(400).json({ message: 'Geçersiz işlem.' });
    return;
  }

  res.setHeader('Allow', 'GET, POST, PATCH');
  res.status(405).json({ message: 'Yöntem izinli değil.' });
};

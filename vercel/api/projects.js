const { verifyToken, projects, teams, ensureProjectPlugin } = require('./store');

module.exports = function handler(req, res) {
  const me = verifyToken(req);
  if (!me) {
    return res.status(401).json({ message: 'Yetkisiz.' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ projects });
  }

  if (req.method === 'POST') {
    const { name, slug, description, thumbnailUrl, teamId } = req.body || {};
    if (!name || !slug) {
      return res.status(400).json({ message: 'Proje adı ve slug gereklidir.' });
    }
    let projectTeam = null;
    if (teamId) {
      projectTeam = teams.find((team) => team.id === teamId);
      if (!projectTeam) {
        return res.status(404).json({ message: 'Takım bulunamadı.' });
      }
      if (!projectTeam.memberIds.includes(me.id) && me.role !== 'admin') {
        return res.status(403).json({ message: 'Takım içinde proje oluşturmak için yetkiniz yok.' });
      }
    }

    const id = `proj_${Math.random().toString(36).slice(2, 10)}`;
    const project = {
      id,
      name,
      slug,
      description: description || '',
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?auto=format&fit=crop&w=800&q=80',
      ownerId: me.id,
      teamId: projectTeam ? projectTeam.id : null,
      pluginInjected: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    projects.push(project);
    if (projectTeam && !projectTeam.projectIds.includes(id)) {
      projectTeam.projectIds.push(id);
    }
    return res.status(201).json({ project });
  }

  if (req.method === 'PATCH') {
    const { projectId, action } = req.body || {};
    if (!projectId || action !== 'ensurePlugin') {
      return res.status(400).json({ message: 'projectId ve action=ensurePlugin gereklidir.' });
    }

    const project = projects.find((item) => item.id === projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı.' });
    }
    if (project.ownerId !== me.id && me.role !== 'admin') {
      return res.status(403).json({ message: 'Bu proje için yetkiniz yok.' });
    }

    const updated = ensureProjectPlugin(projectId);
    return res.status(200).json({ message: 'Proje plugin durumu kontrol edildi.', project: updated });
  }

  res.setHeader('Allow', 'GET, POST, PATCH');
  res.status(405).json({ message: 'Yöntem izinli değil.' });
};

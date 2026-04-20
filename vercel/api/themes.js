const { verifyToken, themes, projects, ensureProjectPlugin } = require('./store');

module.exports = function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ themes });
  }

  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Giriş yapmalısınız.' });
  }

  if (req.method === 'POST') {
    const { name, slug, description, projectId, themeId } = req.body || {};
    if (!name || !slug || !themeId) {
      return res.status(400).json({ message: 'name, slug ve themeId gereklidir.' });
    }

    const existing = themes.find((t) => t.slug === slug);
    const project = projectId ? projects.find((item) => item.id === projectId) : null;
    if (projectId && !project) {
      return res.status(404).json({ message: 'İlgili proje bulunamadı.' });
    }

    if (existing) {
      if (existing.ownerId !== user.id && user.role !== 'admin') {
        return res.status(403).json({ message: 'Bu temayı güncellemek için yetkiniz yok.' });
      }
      existing.name = name;
      existing.description = description || existing.description;
      existing.projectId = project ? project.id : existing.projectId;
      existing.themeId = themeId;
      existing.version = existing.version ? `${parseInt(existing.version.split('.')[0] || '1', 10) + 1}.0.0` : '1.0.0';
      existing.status = user.role === 'admin' ? 'published' : 'pending';
      existing.updatedAt = new Date().toISOString();
      if (project && !project.pluginInjected) {
        ensureProjectPlugin(project.id);
      }
      return res.status(200).json({ message: 'Tema güncellendi.', theme: existing });
    }

    if (!['creator', 'admin'].includes(user.role)) {
      return res.status(403).json({ message: 'Tema eklemek için yetkiniz yok.' });
    }

    const item = {
      id: `theme_${Math.random().toString(36).slice(2, 10)}`,
      themeId,
      slug,
      name,
      description: description || '',
      ownerId: user.id,
      projectId: project ? project.id : null,
      version: '1.0.0',
      status: user.role === 'admin' ? 'published' : 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    themes.push(item);
    if (project && !project.pluginInjected) {
      ensureProjectPlugin(project.id);
    }
    return res.status(201).json({ message: 'Tema oluşturuldu.', theme: item });
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).json({ message: 'Yöntem izinli değil.' });
};

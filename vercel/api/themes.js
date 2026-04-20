const themes = [
  {
    slug: 'openanime',
    name: 'OpenAnime Starter',
    description: 'OpenAnime için örnek tema, Vercel tracking pixel ile kullanım sayımı için doğru yapı.',
    updatedAt: new Date().toISOString()
  }
];

module.exports = function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ themes });
  }

  if (req.method === 'POST') {
    const { name, slug, description } = req.body || {};
    if (!name || !slug) {
      return res.status(400).json({ message: 'name ve slug gereklidir' });
    }

    const existing = themes.find(t => t.slug === slug);
    const item = {
      slug,
      name,
      description: description || '',
      updatedAt: new Date().toISOString()
    };

    if (existing) {
      Object.assign(existing, item);
      return res.status(200).json({ message: 'Tema güncellendi', theme: existing });
    }

    themes.push(item);
    return res.status(201).json({ message: 'Tema oluşturuldu', theme: item });
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).json({ message: 'Yöntem izinli değil' });
}
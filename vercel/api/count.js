const crypto = require('crypto');
const { getUserById, recordThemeUsage, themes, projects } = require('./store');

const TRANSPARENT_GIF = Buffer.from(
  'R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  'base64'
);

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

module.exports = function handler(req, res) {
  const theme = req.query.theme || 'unknown';
  const themeId = req.query.themeId || 'unknown';
  const projectId = req.query.projectId || null;
  const fingerprint = createFingerprint(req);

  const themeRecord = themes.find((item) => item.themeId === themeId || item.slug === theme);
  const projectRecord = projects.find((item) => item.id === projectId);
  const ownerId = themeRecord ? themeRecord.ownerId : null;

  const counted = recordThemeUsage({
    theme,
    themeId,
    projectId,
    ownerId,
    fingerprint
  });

  if (counted) {
    console.log(`Theme usage recorded: theme=${theme} themeId=${themeId} projectId=${projectId} fingerprint=${fingerprint}`);
  } else {
    console.log(`Duplicate theme usage suppressed: theme=${theme} themeId=${themeId}`);
  }

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Content-Type', 'image/gif');
  res.status(200).send(TRANSPARENT_GIF);
};

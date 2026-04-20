const crypto = require('crypto');

const TRANSPARENT_GIF = Buffer.from(
  'R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
  'base64'
);

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function createFingerprint(req) {
  const values = [
    getClientIp(req),
    req.headers['user-agent'] || '',
    req.headers['accept-language'] || '',
    req.headers['sec-ch-ua'] || '',
    req.headers['sec-ch-ua-platform'] || '',
    req.headers['referer'] || '',
    req.url || ''
  ].join('|');

  return crypto.createHash('sha256').update(values).digest('hex');
}

const visitCache = {};
const MIN_REPEAT_MS = 1000 * 60 * 60 * 24; // 24 saat

export default function handler(req, res) {
  const theme = req.query.theme || 'unknown';
  const fingerprint = createFingerprint(req);
  const now = Date.now();

  const cacheKey = `${theme}:${fingerprint}`;
  const lastSeen = visitCache[cacheKey] || 0;

  if (now - lastSeen > MIN_REPEAT_MS) {
    visitCache[cacheKey] = now;
    console.log(`Theme count increment: ${theme} fingerprint=${fingerprint}`);
  } else {
    console.log(`Duplicate suppressed: ${theme} fingerprint=${fingerprint}`);
  }

  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Content-Type', 'image/gif');
  res.status(200).send(TRANSPARENT_GIF);
}

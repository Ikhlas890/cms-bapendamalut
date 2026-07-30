const path = require('path');

const DEFAULT_UPLOAD_FALLBACK_ORIGIN = 'https://api-malut-cms.intermatika.id';

function trimSlashes(value) {
  return String(value || '').replace(/^\/+|\/+$/g, '');
}

function getRequestOrigin(req) {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  return `${protocol}://${req.get('host')}`;
}

function getUploadPath(value, folder) {
  if (!value) return null;

  const rawValue = String(value).trim();
  const uploadIndex = rawValue.indexOf('/uploads/');

  if (uploadIndex >= 0) {
    return rawValue.slice(uploadIndex);
  }

  if (rawValue.startsWith('uploads/')) {
    return `/${rawValue}`;
  }

  if (rawValue.startsWith('/uploads/')) {
    return rawValue;
  }

  return `/uploads/${trimSlashes(folder)}/${path.basename(rawValue)}`;
}

function buildUploadUrl(req, value, folder) {
  const uploadPath = getUploadPath(value, folder);
  if (!uploadPath) return null;

  return `${getRequestOrigin(req)}${uploadPath}`;
}

function getUploadFallbackUrl(req, uploadPath) {
  const fallbackOrigin = (process.env.UPLOAD_FALLBACK_ORIGIN || DEFAULT_UPLOAD_FALLBACK_ORIGIN).replace(/\/$/, '');
  const currentOrigin = getRequestOrigin(req).replace(/\/$/, '');

  if (!fallbackOrigin || fallbackOrigin === currentOrigin) {
    return null;
  }

  return `${fallbackOrigin}/${trimSlashes(uploadPath)}`;
}

module.exports = {
  buildUploadUrl,
  getUploadFallbackUrl
};

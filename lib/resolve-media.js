const fs = require("fs");
const path = require("path");
const { normalizeMediaUrl } = require("./media-url");

const MEDIA_DIR = path.join(__dirname, "..", "content", "media");

let cachedMediaFiles = null;

function listMediaFiles() {
  if (cachedMediaFiles) return cachedMediaFiles;
  if (!fs.existsSync(MEDIA_DIR)) {
    cachedMediaFiles = [];
    return cachedMediaFiles;
  }

  cachedMediaFiles = fs
    .readdirSync(MEDIA_DIR)
    .filter((file) => file && file !== ".gitkeep" && !file.startsWith("."));
  return cachedMediaFiles;
}

function toMediaPath(filename) {
  return `/media/${filename}`;
}

function findByBasename(baseName, ext) {
  const mediaFiles = listMediaFiles();
  const exact = mediaFiles.find((file) => file === `${baseName}${ext}`);
  if (exact) return exact;

  const prefixed = mediaFiles.filter((file) => {
    const fileBase = path.basename(file, path.extname(file));
    return fileBase === baseName || fileBase.startsWith(`${baseName}-`) || fileBase.startsWith(`${baseName}_`);
  });

  if (prefixed.length === 0) return null;
  if (prefixed.length === 1) return prefixed[0];

  prefixed.sort((a, b) => a.length - b.length);
  return prefixed[0];
}

function findBySlug(slug) {
  if (!slug) return null;
  const mediaFiles = listMediaFiles();
  const normalizedSlug = slug.toLowerCase().trim();
  const patterns = [
    `image-${normalizedSlug}`,
    normalizedSlug,
  ];

  for (const pattern of patterns) {
    const match = mediaFiles.find((file) => {
      const fileBase = path.basename(file, path.extname(file)).toLowerCase();
      return fileBase === pattern || fileBase.startsWith(`${pattern}-`) || fileBase.startsWith(`${pattern}_`);
    });
    if (match) return match;
  }

  return null;
}

/**
 * Resolve featured image URLs from CMS/automation workflows.
 * Handles /content/media prefixes and filename suffix mismatches
 * (e.g. workflow writes image-slug-220562.png but frontmatter says image-slug.png).
 */
function resolveMediaUrl(url, { slug } = {}) {
  const normalized = normalizeMediaUrl(url);
  if (!normalized || /^https?:\/\//i.test(normalized)) return normalized;

  const mediaFiles = listMediaFiles();
  const requestedName = path.basename(normalized);
  if (mediaFiles.includes(requestedName)) return normalized;

  const ext = path.extname(requestedName) || ".png";
  const baseName = path.basename(requestedName, path.extname(requestedName));

  const byBasename = findByBasename(baseName, ext);
  if (byBasename) return toMediaPath(byBasename);

  const bySlug = findBySlug(slug);
  if (bySlug) return toMediaPath(bySlug);

  return normalized;
}

module.exports = { resolveMediaUrl, listMediaFiles };

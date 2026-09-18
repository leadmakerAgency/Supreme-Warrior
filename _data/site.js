const fs = require("fs");
const path = require("path");

const EXCLUDED_FROM_SITEMAP = [
  "/enquiry",
  "/enquiry-thank-you",
  "/rfp",
  "/rfp-thank-you",
];

const DISALLOWED_IN_ROBOTS = ["/admin/", ...EXCLUDED_FROM_SITEMAP];

const websiteRoot = path.join(__dirname, "..", "website");

function htmlFileToPath(file) {
  if (file === "index.html") return "/";
  return `/${file.replace(/\.html$/, "")}`;
}

const staticPaths = fs
  .readdirSync(websiteRoot)
  .filter((file) => file.endsWith(".html"))
  .map((file) => {
    const urlPath = htmlFileToPath(file);
    const stat = fs.statSync(path.join(websiteRoot, file));
    return {
      path: urlPath,
      lastmod: stat.mtime.toISOString().slice(0, 10),
    };
  })
  .filter((entry) => !EXCLUDED_FROM_SITEMAP.includes(entry.path))
  .sort((a, b) => {
    if (a.path === "/") return -1;
    if (b.path === "/") return 1;
    return a.path.localeCompare(b.path);
  });

module.exports = {
  url: "https://securityagencyphilippines.com",
  name: "Supreme Warrior",
  buildDate: new Date().toISOString().slice(0, 10),
  blogPageSize: 15,
  staticPaths,
  disallowedPaths: DISALLOWED_IN_ROBOTS,
  sitemapUrl: "https://securityagencyphilippines.com/sitemap.xml",
};

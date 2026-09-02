const fs = require("fs");
const path = require("path");

const websiteRoot = path.join(__dirname, "..", "website");
const CSS_MARKER = '<link rel="stylesheet" href="/cookie-consent.css">';
const SCRIPT_MARKER = '<script src="/cookie-consent.js" defer></script>';
const PRIVACY_FOOTER_OLD =
  '<span><a href="/llms.txt">llms.txt</a> &middot; Manila &middot; Cebu &middot; Davao</span>';
const PRIVACY_FOOTER_NEW =
  '<span><a href="/privacy-policy.html">Privacy Policy</a> &middot; <a href="/llms.txt">llms.txt</a> &middot; Manila &middot; Cebu &middot; Davao</span>';

let updated = 0;

for (const entry of fs.readdirSync(websiteRoot, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith(".html")) continue;

  const filePath = path.join(websiteRoot, entry.name);
  let html = fs.readFileSync(filePath, "utf8");
  let changed = false;

  if (!html.includes(CSS_MARKER)) {
    if (!html.includes("</head>")) {
      console.warn(`Skipping ${entry.name}: no </head> found`);
      continue;
    }
    html = html.replace("</head>", `  ${CSS_MARKER}\n</head>`);
    changed = true;
  }

  if (!html.includes(SCRIPT_MARKER)) {
    if (!html.includes("</body>")) {
      console.warn(`Skipping ${entry.name}: no </body> found`);
      continue;
    }
    html = html.replace("</body>", `  ${SCRIPT_MARKER}\n</body>`);
    changed = true;
  }

  if (html.includes(PRIVACY_FOOTER_OLD) && !html.includes('href="/privacy-policy.html"')) {
    html = html.replace(PRIVACY_FOOTER_OLD, PRIVACY_FOOTER_NEW);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html);
    updated += 1;
    console.log(`Updated ${entry.name}`);
  }
}

console.log(`Cookie consent injection complete (${updated} file(s) changed).`);

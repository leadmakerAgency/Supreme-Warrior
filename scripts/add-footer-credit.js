const fs = require("fs");
const path = require("path");

const websiteRoot = path.join(__dirname, "..", "website");
const FBTM_CSS_OLD =
  ".fbtm{border-top:1px solid var(--line);margin-top:40px;padding-top:22px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;font-size:13.5px;color:var(--muted)}";
const FBTM_CSS_NEW =
  FBTM_CSS_OLD +
  ".foot-credit{width:100%;text-align:center;margin-top:8px;font-size:12px}.foot-credit a{color:inherit;text-decoration:none}.foot-credit a:hover{color:var(--orange)}";
const CREDIT =
  '<span class="foot-credit">Built by <a href="https://leadmaker.agency/" target="_blank" rel="noopener noreferrer">LeadMaker</a></span>';
const FOOTER_OLD = "Manila &middot; Cebu &middot; Davao</span></div>";
const FOOTER_NEW = "Manila &middot; Cebu &middot; Davao</span>" + CREDIT + "</div>";

let updated = 0;

for (const entry of fs.readdirSync(websiteRoot, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith(".html")) continue;

  const filePath = path.join(websiteRoot, entry.name);
  let html = fs.readFileSync(filePath, "utf8");
  let changed = false;

  if (html.includes(FBTM_CSS_OLD) && !html.includes(".foot-credit{")) {
    html = html.replace(FBTM_CSS_OLD, FBTM_CSS_NEW);
    changed = true;
  }

  if (html.includes(FOOTER_OLD) && !html.includes("leadmaker.agency")) {
    html = html.replaceAll(FOOTER_OLD, FOOTER_NEW);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html);
    updated += 1;
    console.log(`Updated ${entry.name}`);
  }
}

console.log(`Footer credit injection complete (${updated} file(s) changed).`);

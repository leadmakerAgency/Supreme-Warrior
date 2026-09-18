const fs = require("fs");
const path = require("path");

const websiteRoot = path.join(__dirname, "..", "website");
const CSS_MARKER = '<link rel="stylesheet" href="/cookie-consent.css">';
const SCRIPT_MARKER = '<script src="/cookie-consent.js" defer></script>';
<<<<<<< HEAD
const GTM_CONTAINER_ID = "GTM-TRM5KHRR";
const GTM_HEAD = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');</script>
<!-- End Google Tag Manager -->
`;
const GTM_NOSCRIPT = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
`;
=======
>>>>>>> 09bc9d52bd8ab3459f98c5b74d2b0a083d16c31c
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

<<<<<<< HEAD
  if (!html.includes(GTM_CONTAINER_ID)) {
    if (!/<head>/i.test(html) || !/<body[^>]*>/i.test(html)) {
      console.warn(`Skipping ${entry.name}: missing <head> or <body>`);
      continue;
    }
    html = html.replace(/<head>/i, `<head>\n${GTM_HEAD}`);
    html = html.replace(/<body([^>]*)>/i, (openingTag) => `${openingTag}\n${GTM_NOSCRIPT}`);
    changed = true;
  }

=======
>>>>>>> 09bc9d52bd8ab3459f98c5b74d2b0a083d16c31c
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

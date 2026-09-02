const fs = require("fs");
const path = require("path");

const websiteRoot = path.join(__dirname, "..", "website");
const staticPaths = fs
  .readdirSync(websiteRoot)
  .filter((file) => file.endsWith(".html"))
  .map((file) => (file === "index.html" ? "/" : `/${file.replace(/\.html$/, "")}/`))
  .sort((a, b) => {
    if (a === "/") return -1;
    if (b === "/") return 1;
    return a.localeCompare(b);
  });

module.exports = {
  url: "https://securityagencyphilippines.com",
  name: "Supreme Warrior",
  buildDate: new Date().toISOString().slice(0, 10),
  blogPageSize: 15,
  staticPaths,
};

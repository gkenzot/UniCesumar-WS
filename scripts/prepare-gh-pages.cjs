const fs = require("fs");
const path = require("path");

const dist = path.join(__dirname, "..", "client", "dist");

fs.copyFileSync(path.join(dist, "index.html"), path.join(dist, "404.html"));
fs.writeFileSync(path.join(dist, ".nojekyll"), "");

console.log("GitHub Pages: 404.html e .nojekyll criados em client/dist");

const fs = require("fs");
const path = require("path");

// Function to recursively process all JS files in the dist directory
function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith(".js")) {
      fixImportsInFile(fullPath);
    }
  }
}

// Function to fix imports in a single file
function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Replace .ts extensions in require statements
  content = content.replace(/require\(['"](.+?)\.ts['"]\)/g, 'require("$1")');

  // Replace .ts extensions in import statements (if you use ES modules)
  content = content.replace(/from ['"](.+?)\.ts['"]/g, 'from "$1"');

  fs.writeFileSync(filePath, content, "utf8");
}

// Start processing from the dist directory
processDirectory("./dist");
console.log("Fixed imports in all compiled files");

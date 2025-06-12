import { readdir, readFile, writeFile, mkdir, rm } from "fs/promises";
import { join } from "path";

async function prepareNodeBuild() {
  // Clean and create temp directory
  try {
    await rm("build-temp", { recursive: true });
  } catch {}
  await mkdir("build-temp", { recursive: true });

  // Copy and transform source files
  await copyAndTransform("src", "build-temp");
}

async function copyAndTransform(src, dest) {
  const files = await readdir(src, { withFileTypes: true });

  for (const file of files) {
    const srcPath = join(src, file.name);
    const destPath = join(dest, file.name);

    if (file.isDirectory()) {
      await mkdir(destPath, { recursive: true });
      await copyAndTransform(srcPath, destPath);
    } else if (file.name.endsWith(".ts")) {
      const content = await readFile(srcPath, "utf-8");
      // Transform .ts imports to .js
      const transformed = content
        .replace(/from\s+["']([^"']+)\.ts["']/g, 'from "$1.js"')
        .replace(/import\s+["']([^"']+)\.ts["']/g, 'import "$1.js"');

      await writeFile(destPath, transformed);
      console.log(`Transformed ${srcPath} -> ${destPath}`);
    } else {
      // Copy non-TS files as-is
      const content = await readFile(srcPath);
      await writeFile(destPath, content);
    }
  }
}

async function cleanup() {
  try {
    await rm("build-temp", { recursive: true });
    console.log("Cleaned up build-temp directory");
  } catch {}
}

prepareNodeBuild().catch(console.error);

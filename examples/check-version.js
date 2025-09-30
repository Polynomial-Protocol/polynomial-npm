#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🔍 Checking polynomialfi package source...\n");

try {
  // Check if it's a symlink (npm link)
  const packagePath = path.join(__dirname, "node_modules", "polynomialfi");
  const stats = fs.lstatSync(packagePath);

  if (stats.isSymbolicLink()) {
    const realPath = fs.realpathSync(packagePath);
    console.log("📦 Using LOCAL package (npm link)");
    console.log(`   Linked to: ${realPath}`);
  } else {
    // Check package.json to see if it's file: reference
    const packageJsonPath = path.join(packagePath, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    // Check if installed from file:
    const examplePackageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, "package.json"), "utf8")
    );
    const polynomialDep = examplePackageJson.dependencies?.polynomialfi;

    if (polynomialDep && polynomialDep.startsWith("file:")) {
      console.log("📦 Using LOCAL package (file: reference)");
      console.log(`   File path: ${polynomialDep}`);
    } else {
      console.log("📦 Using REMOTE package (npm registry)");
      console.log(`   Version: ${packageJson.version}`);
    }
  }

  // Show package info
  const packageJsonPath = path.join(packagePath, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  console.log(`   Package version: ${packageJson.version}`);
  console.log(`   Package path: ${packagePath}`);
} catch (error) {
  console.log("❌ polynomialfi package not found");
  console.log("   Run: npm install polynomialfi");
}

console.log("\n🛠️  Available commands:");
console.log("   npm run use-local     - Use local development version");
console.log("   npm run use-remote    - Use published npm version");
console.log("   npm run use-file      - Use local via file: reference");
console.log("   npm run build-and-link - Build local and link it");

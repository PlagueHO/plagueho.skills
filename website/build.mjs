#!/usr/bin/env node
/**
 * Build script for the plagueho.skills GitHub Pages site.
 *
 * Reads marketplace.json and each plugin.json, then copies the static
 * website files and a generated data.json into website/dist/ for
 * deployment via GitHub Pages.
 */

import { readFileSync, writeFileSync, mkdirSync, cpSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(__dirname, "dist");

// Clean and create dist
mkdirSync(dist, { recursive: true });

// Read marketplace
const marketplace = JSON.parse(
  readFileSync(join(root, ".github/plugin/marketplace.json"), "utf-8")
);

// Enrich each plugin with skill details from plugin.json
const plugins = marketplace.plugins.map((plugin) => {
  const pluginDir = join(root, "plugins", plugin.source);
  const pluginJsonPath = join(pluginDir, "plugin.json");

  let skills = [];
  let keywords = [];

  if (existsSync(pluginJsonPath)) {
    const pluginJson = JSON.parse(readFileSync(pluginJsonPath, "utf-8"));
    keywords = pluginJson.keywords || [];

    skills = (pluginJson.skills || []).map((skillPath) => {
      const skillName = skillPath.replace("./skills/", "");
      const skillMdPath = join(pluginDir, "skills", skillName, "SKILL.md");
      let description = "";

      if (existsSync(skillMdPath)) {
        const content = readFileSync(skillMdPath, "utf-8");
        // Extract description from YAML frontmatter
        const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
        if (fmMatch) {
          const descMatch = fmMatch[1].match(
            /description:\s*>-?\s*\n([\s\S]*?)(?=\n\w|\n---)/
          );
          if (descMatch) {
            description = descMatch[1].trim().replace(/\n\s*/g, " ");
          } else {
            const inlineMatch = fmMatch[1].match(
              /description:\s*["']?(.+?)["']?\s*$/m
            );
            if (inlineMatch) {
              description = inlineMatch[1].trim();
            }
          }
        }
      }

      return { name: skillName, description };
    });
  }

  return {
    name: plugin.name,
    description: plugin.description,
    version: plugin.version,
    keywords,
    skills,
  };
});

// Build data object
const data = {
  name: marketplace.name,
  description: marketplace.metadata.description,
  version: marketplace.metadata.version,
  owner: marketplace.owner,
  plugins,
  generatedAt: new Date().toISOString(),
};

// Write data.json
writeFileSync(join(dist, "data.json"), JSON.stringify(data, null, 2));

// Copy static assets
for (const file of ["index.html", "styles.css"]) {
  cpSync(join(__dirname, file), join(dist, file));
}

const totalSkills = plugins.reduce((sum, p) => sum + p.skills.length, 0);
console.log(
  `Built site: ${plugins.length} plugins, ${totalSkills} skills → website/dist/`
);

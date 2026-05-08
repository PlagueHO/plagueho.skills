#!/usr/bin/env node
/**
 * Build script for the plagueho.skills GitHub Pages site.
 *
 * Reads marketplace.json and each plugin.json, then writes a
 * data.json into website/public/data/ for use by the Astro build.
 * Run this before `astro build`.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dataDir = join(__dirname, "public", "data");

// Ensure output directory exists
mkdirSync(dataDir, { recursive: true });

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
writeFileSync(join(dataDir, "data.json"), JSON.stringify(data, null, 2));

const totalSkills = plugins.reduce((sum, p) => sum + p.skills.length, 0);
console.log(
  `Generated data: ${plugins.length} plugins, ${totalSkills} skills → website/public/data/data.json`
);

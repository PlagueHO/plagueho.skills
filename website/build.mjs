#!/usr/bin/env node
/**
 * Build script for the plagueho.skills GitHub Pages site.
 *
 * Reads marketplace.json and each plugin.json, then writes a
 * data.json into website/public/data/ for use by the Astro build.
 * Run this before `astro build`.
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
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

/**
 * Parse all top-level frontmatter fields from a SKILL.md or agent.md file.
 * Handles block scalars (>- / >), lists, and one level of nested objects.
 */
function parseFrontmatterFields(content) {
  const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!fmMatch) return {};

  const lines = fmMatch[1].split("\n");
  const result = {};
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const topMatch = line.match(/^([a-zA-Z][a-zA-Z0-9-]*):\s*(.*)/);
    if (!topMatch) { i++; continue; }

    const key = topMatch[1];
    const rest = topMatch[2].trim();

    if (rest === ">-" || rest === ">") {
      // Block scalar — collect indented continuation lines
      const parts = [];
      i++;
      while (i < lines.length && (lines[i].startsWith("  ") || lines[i].trim() === "")) {
        const trimmed = lines[i].trim();
        if (trimmed !== "") parts.push(trimmed);
        i++;
      }
      result[key] = parts.join(" ");
    } else if (rest === "") {
      // Could be a list or a nested object
      i++;
      if (i < lines.length && /^  - /.test(lines[i])) {
        const items = [];
        while (i < lines.length && /^  - /.test(lines[i])) {
          items.push(lines[i].replace(/^  - /, "").trim());
          i++;
        }
        result[key] = items;
      } else if (i < lines.length && /^  [a-zA-Z]/.test(lines[i])) {
        const obj = {};
        while (i < lines.length && /^  ([a-zA-Z][a-zA-Z0-9-]*):\s*(.*)/.test(lines[i])) {
          const nm = lines[i].match(/^  ([a-zA-Z][a-zA-Z0-9-]*):\s*(.*)/);
          if (nm) obj[nm[1]] = nm[2].trim().replace(/^["']|["']$/g, "");
          i++;
        }
        result[key] = obj;
      }
      // else: empty value — skip
    } else {
      result[key] = rest.replace(/^["']|["']$/g, "");
      i++;
    }
  }

  return result;
}

/**
 * Parse a single skill or agent entry, returning enriched metadata.
 * @param {string} skillOrAgentPath - path from plugin.json (e.g. "./skills/my-skill")
 * @param {string} pluginDir        - absolute path to the plugin directory
 * @param {string} pluginSource     - plugin source folder name (for GitHub URL)
 * @param {"skill"|"agent"} type
 */
function parseSkillOrAgent(skillOrAgentPath, pluginDir, pluginSource, type) {
  const dirName = type === "skill" ? "skills" : "agents";
  const defaultExt = ".agent.md";
  const normalized = skillOrAgentPath.replace(`./${dirName}/`, "");

  const itemName = type === "agent"
    ? normalized.replace(/\.agent\.md$/i, "")
    : normalized;

  const filePath = type === "skill"
    ? join(pluginDir, dirName, itemName, "SKILL.md")
    : join(pluginDir, dirName, itemName.endsWith(".agent.md") ? itemName : `${itemName}${defaultExt}`);

  let description = "";
  let metadata = null;
  let compatibility = null;
  let argumentHint = null;
  let userInvocable = null;
  let tools = null;
  let subAgents = null;

  if (existsSync(filePath)) {
    const content = readFileSync(filePath, "utf-8");
    const fm = parseFrontmatterFields(content);
    description = fm.description ?? "";
    metadata = fm.metadata ?? null;
    compatibility = fm.compatibility ?? null;
    argumentHint = fm["argument-hint"] ?? null;
    userInvocable = fm["user-invocable"] ?? null;
    if (type === "agent") {
      tools = fm.tools ?? null;
      subAgents = fm.agents ?? null;
    }
  }

  // Collect scripts and reference/asset files for skills
  let scripts = [];
  let assets = [];
  if (type === "skill") {
    const skillDir = join(pluginDir, "skills", itemName);
    const scriptsDir = join(skillDir, "scripts");
    const refsDir = join(skillDir, "references");
    const assetsDir = join(skillDir, "assets");

    if (existsSync(scriptsDir)) {
      scripts = readdirSync(scriptsDir).filter((f) => !f.startsWith(".")).sort();
    }
    for (const dir of [refsDir, assetsDir]) {
      if (existsSync(dir)) {
        assets.push(...readdirSync(dir).filter((f) => !f.startsWith(".")).sort());
      }
    }
  }

  const githubBase = "https://github.com/PlagueHO/plagueho.skills";
  const githubUrl = type === "skill"
    ? `${githubBase}/tree/main/plugins/${pluginSource}/skills/${itemName}`
    : `${githubBase}/blob/main/plugins/${pluginSource}/agents/${itemName}.agent.md`;

  const result = {
    name: itemName,
    description,
    metadata,
    compatibility,
    userInvocable,
    githubUrl,
  };

  if (type === "skill") {
    result.argumentHint = argumentHint;
    result.scripts = scripts;
    result.assets = assets;
  } else {
    result.tools = tools;
    result.subAgents = subAgents;
  }

  return result;
}

function discoverAgentsFromFolder(pluginDir) {
  const agentsDir = join(pluginDir, "agents");
  if (!existsSync(agentsDir)) {
    return [];
  }

  return readdirSync(agentsDir)
    .filter((entry) => entry.toLowerCase().endsWith(".agent.md"))
    .map((entry) => `./agents/${entry}`);
}

// Enrich each plugin with skill and agent details from plugin.json
const plugins = marketplace.plugins.map((plugin) => {
  const pluginDir = join(root, "plugins", plugin.source);
  const pluginJsonPath = join(pluginDir, "plugin.json");

  let skills = [];
  let agents = [];
  let keywords = [];

  if (existsSync(pluginJsonPath)) {
    const pluginJson = JSON.parse(readFileSync(pluginJsonPath, "utf-8"));
    keywords = pluginJson.keywords || [];

    skills = (pluginJson.skills || []).map((skillPath) =>
      parseSkillOrAgent(skillPath, pluginDir, plugin.source, "skill")
    );

    const declaredAgents = pluginJson.agents || [];
    const fallbackAgents = declaredAgents.length > 0
      ? []
      : discoverAgentsFromFolder(pluginDir);

    agents = [...declaredAgents, ...fallbackAgents].map((agentPath) =>
      parseSkillOrAgent(agentPath, pluginDir, plugin.source, "agent")
    );
  }

  return {
    name: plugin.name,
    description: plugin.description,
    version: plugin.version,
    keywords,
    skills,
    agents,
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
const totalAgents = plugins.reduce((sum, p) => sum + (p.agents?.length ?? 0), 0);
console.log(
  `Generated data: ${plugins.length} plugins, ${totalSkills} skills, ${totalAgents} agents -> website/public/data/data.json`
);

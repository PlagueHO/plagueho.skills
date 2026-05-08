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

function parseFrontmatterDescription(content) {
  const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    return "";
  }

  const descMatch = fmMatch[1].match(
    /description:\s*>-?\s*\n([\s\S]*?)(?=\n\w|\n---)/
  );
  if (descMatch) {
    return descMatch[1].trim().replace(/\n\s*/g, " ");
  }

  const inlineMatch = fmMatch[1].match(
    /description:\s*["']?(.+?)["']?\s*$/m
  );
  return inlineMatch ? inlineMatch[1].trim() : "";
}

function parseSkillOrAgent(skillOrAgentPath, pluginDir, type) {
  const dirName = type === "skill" ? "skills" : "agents";
  const defaultExt = type === "skill" ? "/SKILL.md" : ".agent.md";
  const normalized = skillOrAgentPath.replace(`./${dirName}/`, "");

  const itemName = type === "agent"
    ? normalized.replace(/\.agent\.md$/i, "")
    : normalized;

  const filePath = type === "skill"
    ? join(pluginDir, dirName, itemName, "SKILL.md")
    : join(pluginDir, dirName, itemName.endsWith(".agent.md") ? itemName : `${itemName}${defaultExt}`);

  let description = "";
  if (existsSync(filePath)) {
    const content = readFileSync(filePath, "utf-8");
    description = parseFrontmatterDescription(content);
  }

  return { name: itemName, description };
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
      parseSkillOrAgent(skillPath, pluginDir, "skill")
    );

    const declaredAgents = pluginJson.agents || [];
    const fallbackAgents = declaredAgents.length > 0
      ? []
      : discoverAgentsFromFolder(pluginDir);

    agents = [...declaredAgents, ...fallbackAgents].map((agentPath) =>
      parseSkillOrAgent(agentPath, pluginDir, "agent")
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

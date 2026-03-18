#!/usr/bin/env bash
# update-marketplace-from-plugins.sh
#
# Build marketplace.json from individual plugin.json files.
#
# Scans every plugins/<name>/plugin.json file and aggregates them into
# the root .github/plugin/marketplace.json. The marketplace envelope
# (name, metadata, owner) is preserved; the plugins array is rebuilt
# from the individual plugin.json files sorted by name.
#
# Usage:
#   ./update-marketplace-from-plugins.sh [--repo-root <path>]
#
# Requires: jq

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT=""

# ---------------------------------------------------------------------------
# Parse arguments
# ---------------------------------------------------------------------------

while [[ $# -gt 0 ]]; do
    case "$1" in
        --repo-root) REPO_ROOT="$2"; shift 2 ;;
        *)
            echo "Unknown option: $1" >&2
            exit 1
            ;;
    esac
done

if [[ -z "$REPO_ROOT" ]]; then
    REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
fi

MARKETPLACE_PATH="$REPO_ROOT/.github/plugin/marketplace.json"
PLUGINS_DIR="$REPO_ROOT/plugins"

if ! command -v jq &>/dev/null; then
    echo "Error: jq is required but not installed." >&2
    exit 1
fi

if [[ ! -f "$MARKETPLACE_PATH" ]]; then
    echo "Error: marketplace.json not found at: $MARKETPLACE_PATH" >&2
    exit 1
fi

if [[ ! -d "$PLUGINS_DIR" ]]; then
    echo "Error: plugins directory not found at: $PLUGINS_DIR" >&2
    exit 1
fi

# ---------------------------------------------------------------------------
# Discover plugin.json files
# ---------------------------------------------------------------------------

plugin_json_files=()
while IFS= read -r -d '' f; do
    plugin_json_files+=("$f")
done < <(find "$PLUGINS_DIR" -maxdepth 2 -name 'plugin.json' -print0 | sort -z)

if [[ ${#plugin_json_files[@]} -eq 0 ]]; then
    echo "Warning: No plugin.json files found under $PLUGINS_DIR"
    exit 0
fi

echo "Found ${#plugin_json_files[@]} plugin.json file(s)."

# ---------------------------------------------------------------------------
# Build the plugins array
# ---------------------------------------------------------------------------

plugins_json="[]"

for file in "${plugin_json_files[@]}"; do
    # Derive plugin directory name from path
    # e.g., plugins/azure-infrastructure/plugin.json -> azure-infrastructure
    relative="${file#"$PLUGINS_DIR/"}"
    plugin_dir_name="${relative%%/*}"

    plugin_data="$(cat "$file")"

    # Build the marketplace entry — source is just the directory name
    entry="$(echo "$plugin_data" | jq --arg source "$plugin_dir_name" '{
        name: .name,
        source: $source,
        description: .description,
        version: .version
    }')"

    plugin_name="$(echo "$plugin_data" | jq -r '.name')"
    echo "  Added: $plugin_name ($plugin_dir_name)"

    plugins_json="$(echo "$plugins_json" | jq --argjson e "$entry" '. + [$e]')"
done

# Sort plugins by name
plugins_json="$(echo "$plugins_json" | jq 'sort_by(.name)')"

# ---------------------------------------------------------------------------
# Write updated marketplace.json
# ---------------------------------------------------------------------------

# Read envelope and replace plugins array
jq --argjson plugins "$plugins_json" '.plugins = $plugins' "$MARKETPLACE_PATH" > "${MARKETPLACE_PATH}.tmp"
mv "${MARKETPLACE_PATH}.tmp" "$MARKETPLACE_PATH"

count="$(echo "$plugins_json" | jq 'length')"
echo ""
echo "Marketplace updated with $count plugin(s) at: $MARKETPLACE_PATH"

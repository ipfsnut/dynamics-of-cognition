#!/bin/bash
# scripts/fetch-vault.sh
# 
# Fetches vault content for build. Works in two modes:
#
# LOCAL DEV:
#   Set VAULT_PATH in .env to point to your local vault folder
#   Example: VAULT_PATH=~/Documents/dynamics-of-cognition-vault/vault
#
# NETLIFY/CI:
#   Set VAULT_GITHUB_TOKEN and VAULT_REPO in Netlify environment
#   The script will clone the private repo at build time

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TEMP_VAULT="$PROJECT_ROOT/.vault-temp"
OUTPUT_DIR="$PROJECT_ROOT/src/assets"
PUBLIC_DIR="$PROJECT_ROOT/public"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}  Dynamics of Cognition — Vault Fetch${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo ""

# Create output directories if they don't exist
mkdir -p "$PROJECT_ROOT/src/assets"
mkdir -p "$PROJECT_ROOT/src/data"

# Load .env if it exists (for local dev)
if [ -f "$PROJECT_ROOT/.env" ]; then
  echo -e "${YELLOW}Loading .env file...${NC}"
  export $(cat "$PROJECT_ROOT/.env" | grep -v '^#' | xargs)
fi

# Expand tilde in VAULT_PATH
if [ -n "$VAULT_PATH" ]; then
  VAULT_PATH="${VAULT_PATH/#\~/$HOME}"
fi

# Determine vault source
if [ -n "$VAULT_PATH" ]; then
  # Local development mode
  echo -e "${GREEN}Mode: Local vault${NC}"
  echo "Using vault at: $VAULT_PATH"
  
  if [ ! -d "$VAULT_PATH" ]; then
    echo -e "${RED}Error: VAULT_PATH does not exist: $VAULT_PATH${NC}"
    exit 1
  fi
  
  if [ ! -f "$VAULT_PATH/canonical/00-introduction.md" ]; then
    echo -e "${RED}Error: Vault structure invalid. Missing canonical/00-introduction.md${NC}"
    exit 1
  fi
  
  VAULT_SOURCE="$VAULT_PATH"
  
elif [ -n "$VAULT_GITHUB_TOKEN" ] && [ -n "$VAULT_REPO" ]; then
  # CI/Netlify mode - clone private repo
  echo -e "${GREEN}Mode: GitHub clone${NC}"
  echo "Cloning from: $VAULT_REPO"
  
  # Clean up any previous temp vault
  rm -rf "$TEMP_VAULT"
  
  # Clone using token
  git clone --depth 1 \
    "https://${VAULT_GITHUB_TOKEN}@github.com/${VAULT_REPO}.git" \
    "$TEMP_VAULT" 2>/dev/null
  
  # Check if vault folder exists inside repo (might be repo root or subfolder)
  if [ -d "$TEMP_VAULT/vault" ]; then
    VAULT_SOURCE="$TEMP_VAULT/vault"
  elif [ -f "$TEMP_VAULT/canonical/00-introduction.md" ]; then
    VAULT_SOURCE="$TEMP_VAULT"
  else
    echo -e "${RED}Error: Could not find vault structure in cloned repo${NC}"
    exit 1
  fi
  
else
  echo -e "${RED}Error: No vault source configured.${NC}"
  echo ""
  echo "For local development, create .env with:"
  echo "  VAULT_PATH=/path/to/your/vault"
  echo ""
  echo "For CI/Netlify, set environment variables:"
  echo "  VAULT_GITHUB_TOKEN=ghp_xxxxxxxxxxxx"
  echo "  VAULT_REPO=username/dynamics-of-cognition-vault"
  exit 1
fi

echo ""
echo -e "${YELLOW}Compiling canonical/ into paper.md...${NC}"

# Compile canonical files into single paper.md
PAPER_OUTPUT="$OUTPUT_DIR/paper.md"

# Create a temp file for processing
TEMP_PAPER=$(mktemp)

# Start with the title
echo "# Dynamics of Cognition" > "$TEMP_PAPER"
echo "" >> "$TEMP_PAPER"

# Get introduction content (skip the title and nav links)
if [ -f "$VAULT_SOURCE/canonical/00-introduction.md" ]; then
  # Extract just the intro paragraphs (between title and "## Paper Structure")
  # Use sed to remove the last line (the ---) - compatible with macOS
  sed -n '/^The question of what constitutes/,/^---$/p' "$VAULT_SOURCE/canonical/00-introduction.md" | sed '$ d' >> "$TEMP_PAPER"
  echo "" >> "$TEMP_PAPER"
  echo "---" >> "$TEMP_PAPER"
  echo "" >> "$TEMP_PAPER"
fi

# Append each section in order
for i in 01 02 03 04 05 06 07 08 09 10 11 12; do
  SECTION_FILE=$(ls "$VAULT_SOURCE/canonical/${i}-"*.md 2>/dev/null | head -1)
  if [ -f "$SECTION_FILE" ]; then
    FILENAME=$(basename "$SECTION_FILE")
    echo "  Adding: $FILENAME"
    
    # Convert section title to Roman numerals for paper format
    case $i in
      01) NUMERAL="I" ;;
      02) NUMERAL="II" ;;
      03) NUMERAL="III" ;;
      04) NUMERAL="IV" ;;
      05) NUMERAL="V" ;;
      06) NUMERAL="VI" ;;
      07) NUMERAL="VII" ;;
      08) NUMERAL="VIII" ;;
      09) NUMERAL="IX" ;;
      10) NUMERAL="X" ;;
      11) NUMERAL="XI" ;;
      12) NUMERAL="XII" ;;
    esac
    
    # Get the title from the file (first # line)
    TITLE=$(grep -m1 "^# " "$SECTION_FILE" | sed 's/^# //')
    
    # Write section header
    echo "## $NUMERAL. $TITLE" >> "$TEMP_PAPER"
    echo "" >> "$TEMP_PAPER"
    
    # Get content: skip title line, blockquote subtitle, and navigation footer
    # This extracts everything between the subtitle and the "---" before "See also"
    awk '
      /^>/ { next }  # Skip blockquote subtitle
      /^# / { next }  # Skip title
      /^---$/ { if (seen_content) exit; next }  # Stop at footer separator
      /^\*\*See also/ { exit }  # Stop at see also
      /^\*\*Previous/ { exit }  # Stop at navigation
      NF { seen_content = 1 }  # Mark that we have seen content
      seen_content { print }  # Print content lines
    ' "$SECTION_FILE" >> "$TEMP_PAPER"
    
    echo "" >> "$TEMP_PAPER"
    echo "---" >> "$TEMP_PAPER"
    echo "" >> "$TEMP_PAPER"
  fi
done

# Add references from bibliography
if [ -f "$VAULT_SOURCE/meta/bibliography.md" ]; then
  echo "  Adding: bibliography.md"
  echo "## References" >> "$TEMP_PAPER"
  echo "" >> "$TEMP_PAPER"
  # Get references (skip any header lines), add blank line between each
  # APA style: alphabetical, no numbers, hanging indent handled by CSS
  grep -E "^[A-Z]" "$VAULT_SOURCE/meta/bibliography.md" | grep -v "^References for" | while IFS= read -r line; do
    echo "$line" >> "$TEMP_PAPER"
    echo "" >> "$TEMP_PAPER"
  done
fi

# Strip wiki-links: [[target|display]] -> display, [[target]] -> target
echo ""
echo -e "${YELLOW}Cleaning wiki-links...${NC}"
sed -E 's/\[\[([^]|]+)\|([^]]+)\]\]/\2/g; s/\[\[([^]]+)\]\]/\1/g' "$TEMP_PAPER" > "$PAPER_OUTPUT"
rm "$TEMP_PAPER"



# Generate vault manifest for graph visualization
echo ""
echo -e "${YELLOW}Generating vault manifest for graph visualization...${NC}"

# Update the buildVaultManifest script to use the vault source
if command -v node >/dev/null 2>&1; then
  # Set vault path for the manifest generator
  export VAULT_SOURCE_FOR_MANIFEST="$VAULT_SOURCE"
  node "$PROJECT_ROOT/scripts/buildVaultManifest.js"
else
  echo "  Warning: Node.js not found, skipping manifest generation"
fi

echo ""
echo -e "${GREEN}✓ Vault content ready${NC}"
echo "  Paper compiled to: src/assets/paper.md"
echo "  Graph manifest: src/data/vault-manifest.json"

# Clean up temp vault if we cloned it
if [ -d "$TEMP_VAULT" ]; then
  rm -rf "$TEMP_VAULT"
fi

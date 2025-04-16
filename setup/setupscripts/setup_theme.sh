#!/bin/bash

################################################################################
# 🎨 Theme Switcher (No Node.js)
# Updates both Light & Dark theme sections in your Tailwind CSS file
# Supports: Solid + Gradient, variable-based naming (e.g. --primary-sky)
################################################################################

set -e

echo ""
echo "🎨 Launching Theme Selection CLI..."

# === Setup paths (relative to script) ===
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
CSS_FILE="$ROOT_DIR/src/app/index.css"
BACKUP_FILE="${CSS_FILE}.bak"

if [[ ! -f "$CSS_FILE" ]]; then
  echo "❌ index.css not found at: $CSS_FILE"
  exit 1
fi

# === Define theme options ===
SOLID_THEMES=(blue slate gray zinc neutral stone red orange amber yellow lime green emerald teal cyan sky indigo violet purple fuchsia pink rose)
GRADIENT_THEMES=(deep-purple blood-orange hotpink-purple green-blue deep-blue purple-pink blue-green)

echo ""
echo "💡 Choose Theme Type:"
echo "1) Solid"
echo "2) Gradient"
read -rp "#? " THEME_TYPE

if [[ "$THEME_TYPE" != "1" && "$THEME_TYPE" != "2" ]]; then
  echo "❌ Invalid theme type."
  exit 1
fi

# === Present theme color options ===
THEME_LIST=("${SOLID_THEMES[@]}")
[[ "$THEME_TYPE" == "2" ]] && THEME_LIST=("${GRADIENT_THEMES[@]}")

echo ""
echo "🎨 Select Theme:"
for i in "${!THEME_LIST[@]}"; do
  printf "%2d) %s\n" $((i + 1)) "${THEME_LIST[$i]}"
done

read -rp "#? " COLOR_INDEX
COLOR="${THEME_LIST[$((COLOR_INDEX - 1))]}"

if [[ -z "$COLOR" ]]; then
  echo "❌ Invalid theme color selected."
  exit 1
fi

echo "🔁 Selected: $COLOR ($( [[ $THEME_TYPE == 1 ]] && echo "Solid" || echo "Gradient" ))"
echo "🛠️  Updating $CSS_FILE..."

# === Create backup ===
cp "$CSS_FILE" "$BACKUP_FILE"
echo "📁 Backup saved at: $BACKUP_FILE"

# === OS-specific sed compatibility ===
unameOut="$(uname -s)"
case "${unameOut}" in
    Darwin*)  SED_IN_PLACE=("sed" "-i" "") ;;
    Linux*)   SED_IN_PLACE=("sed" "-i") ;;
    MINGW*|MSYS*) SED_IN_PLACE=("sed" "-i") ;;
    *) echo "❌ Unsupported OS: $unameOut"; exit 1 ;;
esac

# === Update logic: Light + Dark mode ===
update_theme_block() {
  local mode="$1"
  local prefix="--${mode}-"
  local section=""

  [[ "$mode" == "light" ]] && section="LIGHT MODE" || section="DARK MODE"

  echo "🔧 Updating $section variables..."

  "${SED_IN_PLACE[@]}" -E "
    s|--selected-primary: var\(--[a-zA-Z0-9\-]*\);|--selected-primary: var(--primary-${COLOR});|g;
    s|--selected-secondary: var\(--[a-zA-Z0-9\-]*\);|--selected-secondary: var(--secondary-${COLOR});|g;
    s|--selected-primary-hover: var\(--[a-zA-Z0-9\-]*\);|--selected-primary-hover: var(--primary-${COLOR}-hover);|g;
    s|--selected-primary-active: var\(--[a-zA-Z0-9\-]*\);|--selected-primary-active: var(--primary-${COLOR}-active);|g;
    s|--selected-primary-foreground: var\(--[a-zA-Z0-9\-]*\);|--selected-primary-foreground: var(--primary-${COLOR}-foreground);|g;
    s|--bg-main-theme: var\(--[a-zA-Z0-9\-]*\);|--bg-main-theme: var(--primary-hex-${COLOR});|g;
  " "$CSS_FILE"
}

# === Run updates for both root and dark mode blocks ===
update_theme_block "light"
update_theme_block "dark"

echo ""
echo "✅ Theme successfully applied: $COLOR"

# === Post-notes ===
cat <<EOF

📁 Theme updated in:
   ➤ src/app/index.css

🛠️ What was updated:
   - Light + Dark Mode variables:
     • --selected-primary, --selected-secondary
     • --selected-primary-hover, --active, --foreground
     • --bg-main-theme

📌 You can now:
   • Use the new theme in Tailwind classes (e.g. \`bg-primary\`)
   • Customize further inside \`index.css\`
   • Re-run this script to switch themes at any time!

🎉 Done!
EOF

#!/usr/bin/env bash
#
# scaffold-client.sh — Example client delivery wrapper around new-web-site.sh.
#
# Usage:
#   bash scripts/scaffold-client.sh <kebab-name> [--preset saas|agency]
#
# Example:
#   bash scripts/scaffold-client.sh client-acme --preset saas
#
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: scaffold-client.sh <kebab-name> [--preset saas|agency]"
  exit 1
fi

NAME="$1"
shift
SCRIPT="$HOME/Projects/scripts/new-web-site.sh"

"$SCRIPT" "$NAME" "$@"

TARGET="$HOME/Projects/$NAME"
echo ""
echo "✓ Client scaffold: $TARGET"
echo "  Next: move_agent_to_root $TARGET"
echo "  Edit content/site.json for client copy"
echo "  npm run quick-start && npm run dev"
echo "  Ship: docs/CLIENT-SITE.md"

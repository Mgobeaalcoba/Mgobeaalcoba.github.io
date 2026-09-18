#!/bin/bash
# Bloquea ediciones a AGENTS.md (a cualquier nivel del repo) sin aprobación explícita.
FILE=$(jq -r '.tool_input.file_path')
if [[ "$FILE" == *"AGENTS.md"* ]]; then
  jq -n '{hookSpecificOutput:{
    hookEventName:"PreToolUse",
    permissionDecision:"deny",
    permissionDecisionReason:
    "AGENTS.md requiere aprobación humana explícita. Pedile aprobación a Mariano."}}'
fi

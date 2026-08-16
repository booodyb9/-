#!/bin/bash
REPO_DIR="/tmp/last_project"
for file in "$REPO_DIR"/*; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    # Find the corresponding file in the current directory
    target=$(find . -name "$filename" | grep -v "$REPO_DIR" | head -n 1)
    if [ -n "$target" ]; then
      echo "Copying $filename to $target"
      cp "$file" "$target"
    else
      echo "Warning: $filename not found in current workspace."
    fi
  fi
done

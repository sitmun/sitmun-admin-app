#!/bin/bash

# Script to fix imports in model files

# Base directory
TARGET_DIR="src/app/domain"

# List of features
features=(
  "territory"
  "user"
  "task"
  "service"
  "cartography"
  "application"
  "role"
  "connection"
  "translation"
  "tree"
  "dashboard"
  "capabilities"
  "configuration"
  "getInfo"
  "map"
  "codelist"
)

# Fix imports in model files
for feature in "${features[@]}"; do
  echo "Fixing imports for $feature models..."
  
  # Process each model file
  for file in "$TARGET_DIR/$feature/models"/*.ts; do
    if [ -f "$file" ]; then
      # Replace imports from the same feature
      sed -i '' "s|import { \(.*\) } from '\.\./\(.*\)\.model'|import { \1 } from '\./\2\.model'|g" "$file"
      
      # Replace imports from other features
      for other_feature in "${features[@]}"; do
        if [ "$feature" != "$other_feature" ]; then
          sed -i '' "s|import { \(.*\) } from '\.\./\.\./\($other_feature\)/\(.*\)\.model'|import { \1 } from '\@app/domain/\2/models/\3\.model'|g" "$file"
        fi
      done
    fi
  done
done

echo "Model imports fixed!" 
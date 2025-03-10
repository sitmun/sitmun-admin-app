#!/bin/bash

# Script to fix imports in service files

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

# Fix imports in service files
for feature in "${features[@]}"; do
  echo "Fixing imports for $feature services..."
  
  # Process each service file
  for file in "$TARGET_DIR/$feature/services"/*.ts; do
    if [ -f "$file" ]; then
      # Replace model imports from the same feature
      sed -i '' "s|import { \(.*\) } from '\./\(.*\)\.model'|import { \1 } from '\.\./models/\2\.model'|g" "$file"
      
      # Replace service imports from the same feature
      sed -i '' "s|import { \(.*\) } from '\./\(.*\)\.service'|import { \1 } from '\./\2\.service'|g" "$file"
      
      # Replace imports from other features
      for other_feature in "${features[@]}"; do
        if [ "$feature" != "$other_feature" ]; then
          # Replace model imports from other features
          sed -i '' "s|import { \(.*\) } from '\.\./\($other_feature\)/\(.*\)\.model'|import { \1 } from '\@app/domain/\2/models/\3\.model'|g" "$file"
          
          # Replace service imports from other features
          sed -i '' "s|import { \(.*\) } from '\.\./\($other_feature\)/\(.*\)\.service'|import { \1 } from '\@app/domain/\2/services/\3\.service'|g" "$file"
        fi
      done
    fi
  done
done

echo "Service imports fixed!" 
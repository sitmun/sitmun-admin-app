#!/bin/bash

# Script to fix cross-feature imports in model files

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

# Fix cross-feature imports in model files
for feature in "${features[@]}"; do
  echo "Fixing cross-feature imports for $feature models..."
  
  # Process each model file
  for file in "$TARGET_DIR/$feature/models"/*.ts; do
    if [ -f "$file" ]; then
      # Fix imports from other features
      for other_feature in "${features[@]}"; do
        if [ "$feature" != "$other_feature" ]; then
          # Replace imports like: import { Territory } from './territory/territory.model';
          # With: import { Territory } from '@app/domain/territory/models/territory.model';
          sed -i '' "s|import { \(.*\) } from '\./\($other_feature\)/\(.*\)\.model'|import { \1 } from '@app/domain/\2/models/\3.model'|g" "$file"
          sed -i '' "s|import { \(.*\) } from '\.\./\($other_feature\)/\(.*\)\.model'|import { \1 } from '@app/domain/\2/models/\3.model'|g" "$file"
        fi
      done
    fi
  done
done

# Fix cross-feature imports in service files
for feature in "${features[@]}"; do
  echo "Fixing cross-feature imports for $feature services..."
  
  # Process each service file
  for file in "$TARGET_DIR/$feature/services"/*.ts; do
    if [ -f "$file" ]; then
      # Fix imports from other features
      for other_feature in "${features[@]}"; do
        if [ "$feature" != "$other_feature" ]; then
          # Replace imports like: import { Territory } from '../territory/territory.model';
          # With: import { Territory } from '@app/domain/territory/models/territory.model';
          sed -i '' "s|import { \(.*\) } from '\.\./\($other_feature\)/\(.*\)\.model'|import { \1 } from '@app/domain/\2/models/\3.model'|g" "$file"
          sed -i '' "s|import { \(.*\) } from '\.\./\.\./\($other_feature\)/\(.*\)\.model'|import { \1 } from '@app/domain/\2/models/\3.model'|g" "$file"
          
          # Replace service imports
          sed -i '' "s|import { \(.*\) } from '\.\./\($other_feature\)/\(.*\)\.service'|import { \1 } from '@app/domain/\2/services/\3.service'|g" "$file"
          sed -i '' "s|import { \(.*\) } from '\.\./\.\./\($other_feature\)/\(.*\)\.service'|import { \1 } from '@app/domain/\2/services/\3.service'|g" "$file"
        fi
      done
    fi
  done
done

echo "Cross-feature imports fixed!" 
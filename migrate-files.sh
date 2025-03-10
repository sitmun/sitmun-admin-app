#!/bin/bash

# Script to migrate files from frontend-core to domain module

# Base directories
SOURCE_DIR="src/app/frontend-core/src/lib"
TARGET_DIR="src/app/domain"

# Function to migrate models
migrate_models() {
  feature=$1
  echo "Migrating models for $feature..."
  
  # Create models directory if it doesn't exist
  mkdir -p "$TARGET_DIR/$feature/models"
  
  # Find all model files and copy them
  find "$SOURCE_DIR/$feature" -name "*.model.ts" -exec cp {} "$TARGET_DIR/$feature/models/" \;
  
  # Update imports in model files
  for file in "$TARGET_DIR/$feature/models"/*.ts; do
    # Replace relative imports with new structure
    sed -i '' "s|import { .* } from '.\/|import { \1 } from '\.\/|g" "$file"
    sed -i '' "s|import { .* } from '\.\.|import { \1 } from '\.\./\.\.|g" "$file"
  done
}

# Function to migrate services
migrate_services() {
  feature=$1
  echo "Migrating services for $feature..."
  
  # Create services directory if it doesn't exist
  mkdir -p "$TARGET_DIR/$feature/services"
  
  # Find all service files and copy them
  find "$SOURCE_DIR/$feature" -name "*.service.ts" -not -name "*.spec.ts" -exec cp {} "$TARGET_DIR/$feature/services/" \;
  
  # Update imports in service files
  for file in "$TARGET_DIR/$feature/services"/*.ts; do
    # Replace model imports with new structure
    sed -i '' "s|import { .* } from '.\/\(.*\)\.model'|import { \1 } from '\.\.\/models\/\1\.model'|g" "$file"
  done
}

# List of features to migrate
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

# Migrate each feature
for feature in "${features[@]}"; do
  migrate_models "$feature"
  migrate_services "$feature"
done

echo "Migration completed!" 
#!/bin/bash

# Script to fix hyphenated imports in service files

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

# Fix hyphenated imports in service files
for feature in "${features[@]}"; do
  echo "Fixing hyphenated imports for $feature services..."
  
  # Process each service file
  for file in "$TARGET_DIR/$feature/services"/*.ts; do
    if [ -f "$file" ]; then
      # Fix hyphenated imports
      # Example: import { task-type } from '../models/task-type.model'; -> import { TaskType } from '../models/task-type.model';
      
      # Get the base name of the file without extension
      base_name=$(basename "$file" .service.ts)
      
      # Convert hyphenated names to camel case
      camel_case=""
      IFS='-' read -ra PARTS <<< "$base_name"
      for part in "${PARTS[@]}"; do
        camel_case+="$(tr '[:lower:]' '[:upper:]' <<< ${part:0:1})${part:1}"
      done
      
      # Fix the import statement
      sed -i '' "s|import { $base_name } from '../models/$base_name.model'|import { $camel_case } from '../models/$base_name.model'|g" "$file"
      sed -i '' "s|import { ${base_name}-type } from '../models/${base_name}-type.model'|import { ${camel_case}Type } from '../models/${base_name}-type.model'|g" "$file"
      sed -i '' "s|import { ${base_name}-group } from '../models/${base_name}-group.model'|import { ${camel_case}Group } from '../models/${base_name}-group.model'|g" "$file"
      sed -i '' "s|import { ${base_name}-parameter } from '../models/${base_name}-parameter.model'|import { ${camel_case}Parameter } from '../models/${base_name}-parameter.model'|g" "$file"
      sed -i '' "s|import { ${base_name}-availability } from '../models/${base_name}-availability.model'|import { ${camel_case}Availability } from '../models/${base_name}-availability.model'|g" "$file"
      sed -i '' "s|import { ${base_name}-ui } from '../models/${base_name}-ui.model'|import { ${camel_case}UI } from '../models/${base_name}-ui.model'|g" "$file"
      sed -i '' "s|import { ${base_name}-group-type } from '../models/${base_name}-group-type.model'|import { ${camel_case}GroupType } from '../models/${base_name}-group-type.model'|g" "$file"
      sed -i '' "s|import { ${base_name}-configuration } from '../models/${base_name}-configuration.model'|import { ${camel_case}Configuration } from '../models/${base_name}-configuration.model'|g" "$file"
      sed -i '' "s|import { ${base_name}-position } from '../models/${base_name}-position.model'|import { ${camel_case}Position } from '../models/${base_name}-position.model'|g" "$file"
      sed -i '' "s|import { ${base_name}-node } from '../models/${base_name}-node.model'|import { ${camel_case}Node } from '../models/${base_name}-node.model'|g" "$file"
      
      # Fix the class references
      sed -i '' "s|extends RestService<${base_name}>|extends RestService<${camel_case}>|g" "$file"
      sed -i '' "s|extends RestService<${base_name}Type>|extends RestService<${camel_case}Type>|g" "$file"
      sed -i '' "s|extends RestService<${base_name}Group>|extends RestService<${camel_case}Group>|g" "$file"
      sed -i '' "s|extends RestService<${base_name}Parameter>|extends RestService<${camel_case}Parameter>|g" "$file"
      sed -i '' "s|extends RestService<${base_name}Availability>|extends RestService<${camel_case}Availability>|g" "$file"
      sed -i '' "s|extends RestService<${base_name}UI>|extends RestService<${camel_case}UI>|g" "$file"
      sed -i '' "s|extends RestService<${base_name}GroupType>|extends RestService<${camel_case}GroupType>|g" "$file"
      sed -i '' "s|extends RestService<${base_name}Configuration>|extends RestService<${camel_case}Configuration>|g" "$file"
      sed -i '' "s|extends RestService<${base_name}Position>|extends RestService<${camel_case}Position>|g" "$file"
      sed -i '' "s|extends RestService<${base_name}Node>|extends RestService<${camel_case}Node>|g" "$file"
      
      # Fix the constructor
      sed -i '' "s|super(${base_name},|super(${camel_case},|g" "$file"
      sed -i '' "s|super(${base_name}Type,|super(${camel_case}Type,|g" "$file"
      sed -i '' "s|super(${base_name}Group,|super(${camel_case}Group,|g" "$file"
      sed -i '' "s|super(${base_name}Parameter,|super(${camel_case}Parameter,|g" "$file"
      sed -i '' "s|super(${base_name}Availability,|super(${camel_case}Availability,|g" "$file"
      sed -i '' "s|super(${base_name}UI,|super(${camel_case}UI,|g" "$file"
      sed -i '' "s|super(${base_name}GroupType,|super(${camel_case}GroupType,|g" "$file"
      sed -i '' "s|super(${base_name}Configuration,|super(${camel_case}Configuration,|g" "$file"
      sed -i '' "s|super(${base_name}Position,|super(${camel_case}Position,|g" "$file"
      sed -i '' "s|super(${base_name}Node,|super(${camel_case}Node,|g" "$file"
      
      # Fix the method parameters
      sed -i '' "s|remove(item: ${base_name})|remove(item: ${camel_case})|g" "$file"
      sed -i '' "s|remove(item: ${base_name}Type)|remove(item: ${camel_case}Type)|g" "$file"
      sed -i '' "s|remove(item: ${base_name}Group)|remove(item: ${camel_case}Group)|g" "$file"
      sed -i '' "s|remove(item: ${base_name}Parameter)|remove(item: ${camel_case}Parameter)|g" "$file"
      sed -i '' "s|remove(item: ${base_name}Availability)|remove(item: ${camel_case}Availability)|g" "$file"
      sed -i '' "s|remove(item: ${base_name}UI)|remove(item: ${camel_case}UI)|g" "$file"
      sed -i '' "s|remove(item: ${base_name}GroupType)|remove(item: ${camel_case}GroupType)|g" "$file"
      sed -i '' "s|remove(item: ${base_name}Configuration)|remove(item: ${camel_case}Configuration)|g" "$file"
      sed -i '' "s|remove(item: ${base_name}Position)|remove(item: ${camel_case}Position)|g" "$file"
      sed -i '' "s|remove(item: ${base_name}Node)|remove(item: ${camel_case}Node)|g" "$file"
      
      sed -i '' "s|save(item: ${base_name})|save(item: ${camel_case})|g" "$file"
      sed -i '' "s|save(item: ${base_name}Type)|save(item: ${camel_case}Type)|g" "$file"
      sed -i '' "s|save(item: ${base_name}Group)|save(item: ${camel_case}Group)|g" "$file"
      sed -i '' "s|save(item: ${base_name}Parameter)|save(item: ${camel_case}Parameter)|g" "$file"
      sed -i '' "s|save(item: ${base_name}Availability)|save(item: ${camel_case}Availability)|g" "$file"
      sed -i '' "s|save(item: ${base_name}UI)|save(item: ${camel_case}UI)|g" "$file"
      sed -i '' "s|save(item: ${base_name}GroupType)|save(item: ${camel_case}GroupType)|g" "$file"
      sed -i '' "s|save(item: ${base_name}Configuration)|save(item: ${camel_case}Configuration)|g" "$file"
      sed -i '' "s|save(item: ${base_name}Position)|save(item: ${camel_case}Position)|g" "$file"
      sed -i '' "s|save(item: ${base_name}Node)|save(item: ${camel_case}Node)|g" "$file"
    fi
  done
done

echo "Hyphenated imports fixed!" 
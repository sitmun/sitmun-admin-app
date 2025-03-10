#!/bin/bash

# Script to update import references from frontend-core to domain

echo "Updating import references..."

# Find all TypeScript files that import from frontend-core
grep -r "from '@app/frontend-core" src/app --include="*.ts" | grep -v "src/app/frontend-core" | cut -d':' -f1 | sort -u > files_to_update.txt

# Count the number of files to update
file_count=$(wc -l < files_to_update.txt)
echo "Found $file_count files to update"

# Update each file
while read -r file; do
  echo "Updating $file"
  sed -i '' "s|from '@app/frontend-core/src/lib/public_api'|from '@app/domain'|g" "$file"
done < files_to_update.txt

# Clean up
rm files_to_update.txt

echo "Import references updated!" 
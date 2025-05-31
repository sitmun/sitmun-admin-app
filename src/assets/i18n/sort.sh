#!/bin/bash

# Define language files to sort
LANG_FILES=("ca.json" "en.json" "es.json" "fr.json" "oc-aranes.json")

# Sort each language file
for file in "${LANG_FILES[@]}"; do
  echo "Sorting $file..."
  jq -S 'to_entries | sort_by(.key) | from_entries' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
done


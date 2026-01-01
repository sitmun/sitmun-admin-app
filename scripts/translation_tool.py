#!/usr/bin/env python3
"""
Translation Management Tool for SITMUN Admin App

This tool replaces sort.sh and provides translation key validation:
- Sorts translation JSON files alphabetically
- Detects missing keys across language files
- Finds unused translation keys in the codebase
"""

import argparse
import json
import os
import re
import sys
from collections import defaultdict
from fnmatch import fnmatch
from pathlib import Path
from typing import Dict, List, Set, Tuple


# Translation files to process
TRANSLATION_FILES = ["ca.json", "en.json", "es.json", "fr.json", "oc-aranes.json"]


def get_script_dir() -> Path:
    """Get the directory where this script is located."""
    return Path(__file__).parent.absolute()


def get_project_root() -> Path:
    """Get the project root directory (sitmun-admin-app)."""
    script_dir = get_script_dir()
    return script_dir.parent


def get_i18n_dir() -> Path:
    """Get the i18n directory path."""
    project_root = get_project_root()
    return project_root / "src" / "assets" / "i18n"


def get_src_dir() -> Path:
    """Get the src directory path."""
    project_root = get_project_root()
    return project_root / "src"


def sort_translation_files(i18n_dir: Path, verbose: bool = False) -> bool:
    """
    Sort all translation JSON files alphabetically by key.
    
    Args:
        i18n_dir: Path to the i18n directory
        verbose: Whether to print verbose output
        
    Returns:
        True if all files were sorted successfully, False otherwise
    """
    success = True
    for filename in TRANSLATION_FILES:
        filepath = i18n_dir / filename
        if not filepath.exists():
            if verbose:
                print(f"Warning: {filename} not found, skipping...")
            continue
            
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Sort keys alphabetically
            sorted_data = dict(sorted(data.items()))
            
            # Write back with proper formatting (2 spaces indent)
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(sorted_data, f, ensure_ascii=False, indent=2)
                f.write('\n')  # Add trailing newline
            
            if verbose:
                print(f"✓ Sorted {filename}")
        except json.JSONDecodeError as e:
            print(f"Error: Failed to parse {filename}: {e}", file=sys.stderr)
            success = False
        except Exception as e:
            print(f"Error: Failed to sort {filename}: {e}", file=sys.stderr)
            success = False
    
    return success


def load_translation_files(i18n_dir: Path) -> Dict[str, Dict[str, str]]:
    """
    Load all translation JSON files into memory.
    
    Args:
        i18n_dir: Path to the i18n directory
        
    Returns:
        Dictionary mapping language codes to their translation dictionaries
    """
    translations = {}
    for filename in TRANSLATION_FILES:
        filepath = i18n_dir / filename
        if not filepath.exists():
            continue
            
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                # Extract language code from filename (e.g., "ca.json" -> "ca")
                lang_code = filename.replace('.json', '')
                translations[lang_code] = data
        except json.JSONDecodeError as e:
            print(f"Warning: Failed to parse {filename}: {e}", file=sys.stderr)
        except Exception as e:
            print(f"Warning: Failed to load {filename}: {e}", file=sys.stderr)
    
    return translations


def detect_missing_keys(translations: Dict[str, Dict[str, str]]) -> Dict[str, Dict[str, List[str]]]:
    """
    Detect keys that are missing across language files.
    
    Args:
        translations: Dictionary mapping language codes to translation dictionaries
        
    Returns:
        Dictionary mapping language codes to dictionaries of missing keys by source language
    """
    # Get all unique keys from all languages
    all_keys = set()
    for lang_data in translations.values():
        all_keys.update(lang_data.keys())
    
    missing_keys = {}
    for lang_code in translations.keys():
        missing_keys[lang_code] = {}
        lang_keys = set(translations[lang_code].keys())
        
        for other_lang, other_keys in translations.items():
            if other_lang == lang_code:
                continue
            missing = other_keys.keys() - lang_keys
            if missing:
                missing_keys[lang_code][other_lang] = sorted(missing)
    
    return missing_keys


def get_false_positive_patterns() -> Set[str]:
    """
    Get patterns for known false positives that look like translation keys
    but are actually database column identifiers, code list IDs, etc.
    
    Returns:
        Set of patterns to exclude
    """
    false_positives = {
        # Database column identifiers from config.translationColumns
        'Cartography.description',
        'Territory.name',
        'Service.description',
        'Tree.name',
        'Tree.description',
        'TreeNode.name',
        'TreeNode.description',
        # Hardcoded strings
        'Loading...',
        # Code list identifiers (common patterns)
        'application.type',
        'applicationParameter.type',
        'cartographyParameter.type',
        'cartographyParameter.format',
        'cartographyFilter.type',
        'cartographyFilter.valueType',
        'cartographyPermission.type',
        # Constants/configuration values
        'btnLabel.call',
        'btnLabel.link',
        'btnLabel.point',
        'btnLabel.price',
        'btnLabel.schedule',
        # Additional false positives
        'class.loading',  # CSS class binding
        'data.message',  # Property access
        'data.showAction',  # Property access
        'data.showDetailsButton',  # Property access
        'databaseConnection.driver',  # Code list identifier
        'editTask.fieldType',  # Code list identifier
        'entity.service.singular',  # Comment example only
        'language.default',  # Configuration parameter name
        'legendURL.height',  # Column identifier
        'legendURL.onlineResource',  # Column identifier
        'legendURL.width',  # Column identifier
        # More code list identifiers
        'nodeMapping.town',  # Code list identifier
        'queryTask.fieldType',  # Code list identifier
        'queryTask.parameterType',  # Code list identifier
        'queryTask.scope',  # Code list identifier
        'service.authenticationMode',  # Code list identifier
        'taskEntity.jsonParamType',  # Code list identifier
        'territory.scope',  # Code list identifier
        'treenode.folder.type',  # Code list identifier
        'treenode.leaf.type',  # Code list identifier
        'treenode.viewmode',  # Code list identifier
        # Property paths and configuration
        'properties.scope',  # Property path
        'territory.id',  # Property key
        'this.locators',  # Configuration property name
    }
    return false_positives


def is_false_positive(key: str) -> bool:
    """
    Check if a key is a known false positive.
    
    Args:
        key: Translation key to check
        
    Returns:
        True if the key is a known false positive, False otherwise
    """
    false_positives = get_false_positive_patterns()
    
    # Exact match
    if key in false_positives:
        return True
    
    # Pattern matches for code list identifiers (common pattern: entity.property.type)
    if re.match(r'^[a-zA-Z]+\.(type|format|valueType)$', key):
        return True
    
    # Pattern matches for code list identifiers with scope, fieldType, parameterType, etc.
    if re.match(r'^[a-zA-Z]+\.(scope|fieldType|parameterType|authenticationMode|jsonParamType|viewmode)$', key):
        return True
    
    # Pattern matches for treenode code list identifiers
    if re.match(r'^treenode\.(folder|leaf)\.type$', key):
        return True
    
    # Pattern matches for nodeMapping code list identifiers
    if key.startswith('nodeMapping.'):
        return True
    
    # Pattern matches for btnLabel.* constants
    if key.startswith('btnLabel.'):
        return True
    
    # Pattern matches for CSS class bindings (class.xxx)
    if key.startswith('class.'):
        return True
    
    # Pattern matches for property access (data.xxx, config.xxx, properties.xxx, etc.)
    if re.match(r'^(data|config|options|params|settings|properties|this)\.', key):
        return True
    
    # Pattern matches for property keys (territory.id, etc.)
    if re.match(r'^[a-zA-Z]+\.(id|name|value)$', key) and len(key.split('.')) == 2:
        return True
    
    # Pattern matches for file paths (component.html, component.scss, etc.)
    if re.match(r'.*\.(html|scss|css|ts|js|json|png|jpg|svg|gif|ico)$', key):
        return True
    
    # Pattern matches for column identifiers (xxx.yyy where yyy is a property name)
    # Common patterns: legendURL.height, legendURL.width, etc.
    if re.match(r'^[a-zA-Z]+\.(height|width|format|onlineResource|driver)$', key):
        return True
    
    # Pattern matches for configuration parameter names (language.default, etc.)
    if re.match(r'^[a-zA-Z]+\.(default|name|value|type)$', key) and len(key.split('.')) == 2:
        return True
    
    return False


def scan_codebase_for_keys(src_dir: Path) -> Set[str]:
    """
    Scan TypeScript and HTML files for translation keys.
    
    Args:
        src_dir: Path to the src directory
        
    Returns:
        Set of translation keys found in the codebase
    """
    found_keys = set()
    
    # Patterns for TypeScript files
    ts_patterns = [
        # translateService.instant('key') or translateService.instant("key")
        r"translateService\.(instant|get|stream)\s*\(\s*['\"]([^'\"]+)['\"]",
        # this.translate.instant('key')
        r"this\.translate\.(instant|get|stream)\s*\(\s*['\"]([^'\"]+)['\"]",
        # translate.instant('key') (without this)
        r"translate\.(instant|get|stream)\s*\(\s*['\"]([^'\"]+)['\"]",
        # safeInstant('key') or safeInstant("key")
        r"safeInstant\s*\(\s*['\"]([^'\"]+)['\"]",
        # Function call arguments: function('key') or function("key") - translation key pattern
        r"\([^)]*['\"]([a-zA-Z][a-zA-Z0-9._-]*(?:\.[a-zA-Z0-9._-]+)+)['\"]",
        # Assignment patterns: variable = 'key' or variable = "key" (looks like translation key)
        r"=\s*['\"]([a-zA-Z][a-zA-Z0-9._-]*(?:\.[a-zA-Z0-9._-]+)+)['\"]",
        # Default parameter: function(param = 'key')
        r"=\s*['\"]([a-zA-Z][a-zA-Z0-9._-]*(?:\.[a-zA-Z0-9._-]+)+)['\"]",
        # Return statement: return 'key'
        r"return\s+['\"]([a-zA-Z][a-zA-Z0-9._-]*(?:\.[a-zA-Z0-9._-]+)+)['\"]",
        # Logical OR: || 'key'
        r"\|\|\s*['\"]([a-zA-Z][a-zA-Z0-9._-]*(?:\.[a-zA-Z0-9._-]+)+)['\"]",
        # Object property: key: 'translation.key'
        r":\s*['\"]([a-zA-Z][a-zA-Z0-9._-]*(?:\.[a-zA-Z0-9._-]+)+)['\"]",
    ]
    
    # Patterns for HTML files
    html_patterns = [
        # {{ 'key' | translate }} or {{ "key" | translate }}
        r"\{\{\s*['\"]([^'\"]+)['\"]\s*\|\s*translate\s*\}\}",
        # [attr]="'key' | translate" or [attr]='"key" | translate'
        r"\[[^\]]+\]=\s*['\"]([^'\"]+)['\"]\s*\|\s*translate",
        # matTooltip="{{ 'key' | translate }}"
        r"matTooltip=\s*['\"]\{\{\s*['\"]([^'\"]+)['\"]\s*\|\s*translate\s*\}\}['\"]",
    ]
    
    # Scan TypeScript files
    for ts_file in src_dir.rglob("*.ts"):
        try:
            with open(ts_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Check for config.translationColumns usage - exclude those keys
                translation_columns_match = re.search(r'translationColumns\s*:\s*\{([^}]+)\}', content, re.DOTALL)
                if translation_columns_match:
                    # Extract column identifiers from translationColumns
                    columns_content = translation_columns_match.group(1)
                    column_keys = re.findall(r"['\"]([^'\"]+)['\"]\s*:", columns_content)
                    for col_key in column_keys:
                        if is_false_positive(col_key):
                            continue  # Skip known false positives
                
                # Check for initCodeLists usage - exclude code list identifiers
                init_code_lists_matches = re.finditer(r'initCodeLists\s*\(\s*\[([^\]]+)\]', content)
                for match in init_code_lists_matches:
                    code_list_content = match.group(1)
                    code_list_keys = re.findall(r"['\"]([^'\"]+)['\"]", code_list_content)
                    for cl_key in code_list_keys:
                        if is_false_positive(cl_key):
                            continue  # Skip known false positives
                
                # Exclude CSS class bindings (@HostBinding('class.xxx'))
                host_binding_matches = re.finditer(r"@HostBinding\s*\(\s*['\"]class\.([^'\"]+)['\"]", content)
                for match in host_binding_matches:
                    class_name = 'class.' + match.group(1)
                    if class_name in found_keys:
                        found_keys.discard(class_name)
                
                # Exclude file paths (templateUrl, styleUrls)
                file_path_matches = re.finditer(r"(templateUrl|styleUrls)\s*[:=]\s*['\"]([^'\"]+\.(html|scss|css|ts))['\"]", content)
                for match in file_path_matches:
                    file_path = match.group(2)
                    if file_path in found_keys:
                        found_keys.discard(file_path)
                
                # Exclude column identifiers (getEditableColumnDef, etc. with column names as second param)
                column_def_matches = re.finditer(r"get(Editable|NonEditable|Boolean)ColumnDef\s*\([^,]+,\s*['\"]([^'\"]+)['\"]", content)
                for match in column_def_matches:
                    col_name = match.group(2)
                    if is_false_positive(col_name) and col_name in found_keys:
                        found_keys.discard(col_name)
                
                for pattern in ts_patterns:
                    matches = re.finditer(pattern, content)
                    for match in matches:
                        # Extract key from capture groups (prefer group 2, fallback to group 1)
                        if match.groups():
                            key = match.group(2) if len(match.groups()) > 1 and match.group(2) else match.group(1)
                            if key and not is_false_positive(key):  # Only add if valid and not a false positive
                                found_keys.add(key)
        except Exception as e:
            print(f"Warning: Failed to process {ts_file}: {e}", file=sys.stderr)
    
    # Scan HTML files
    for html_file in src_dir.rglob("*.html"):
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
                for pattern in html_patterns:
                    matches = re.finditer(pattern, content)
                    for match in matches:
                        key = match.group(1)
                        if not is_false_positive(key):  # Filter out false positives
                            found_keys.add(key)
        except Exception as e:
            print(f"Warning: Failed to read {html_file}: {e}", file=sys.stderr)
    
    return found_keys


def load_ignored_keys(ignore_file: Path = None, ignore_keys_arg: str = None) -> Set[str]:
    """
    Load ignored keys from file or command-line argument.
    
    Args:
        ignore_file: Path to ignore file (text file, one key per line)
        ignore_keys_arg: Comma-separated list of keys to ignore
        
    Returns:
        Set of ignored key patterns
    """
    ignored = set()
    
    # Load from command-line argument
    if ignore_keys_arg:
        for key in ignore_keys_arg.split(','):
            key = key.strip()
            if key:
                ignored.add(key)
    
    # Load from file
    if ignore_file and ignore_file.exists():
        try:
            with open(ignore_file, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    # Skip empty lines and comments
                    if line and not line.startswith('#'):
                        ignored.add(line)
        except Exception as e:
            print(f"Warning: Failed to read ignore file {ignore_file}: {e}", file=sys.stderr)
    elif not ignore_file:
        # Try default ignore file
        default_ignore_file = get_script_dir() / ".translation-ignore.txt"
        if default_ignore_file.exists():
            try:
                with open(default_ignore_file, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#'):
                            ignored.add(line)
            except Exception as e:
                print(f"Warning: Failed to read default ignore file: {e}", file=sys.stderr)
    
    return ignored


def is_key_ignored(key: str, ignored_patterns: Set[str]) -> bool:
    """
    Check if a key matches any ignored pattern.
    
    Args:
        key: Translation key to check
        ignored_patterns: Set of ignored patterns (supports wildcards)
        
    Returns:
        True if the key should be ignored, False otherwise
    """
    for pattern in ignored_patterns:
        if fnmatch(key, pattern):
            return True
    return False


def detect_hardcoded_strings(src_dir: Path) -> List[Tuple[str, str, int]]:
    """
    Detect hardcoded strings that should potentially be translated.
    
    Args:
        src_dir: Path to the src directory
        
    Returns:
        List of tuples (file_path, string, line_number) for potential hardcoded strings
    """
    hardcoded_strings = []
    
    # Patterns to exclude (technical strings, not user-facing)
    def should_exclude_string(s: str) -> bool:
        """Check if a string should be excluded from hardcoded string detection."""
        # Too short
        if len(s) < 3:
            return True
        
        # URLs
        if re.match(r'^https?://', s) or re.match(r'^[a-z]+://', s):
            return True
        
        # Constants (ALL_CAPS)
        if re.match(r'^[A-Z_][A-Z0-9_]*$', s):
            return True
        
        # Single word identifiers
        if re.match(r'^[a-z][a-z0-9-]*$', s) and len(s) < 15:
            return True
        
        # PascalCase (likely class/type names)
        if re.match(r'^[A-Z][a-zA-Z0-9]*$', s) and not ' ' in s:
            return True
        
        # camelCase (likely variable names)
        if re.match(r'^[a-z]+[A-Z]', s) and not ' ' in s:
            return True
        
        # Numbers only
        if re.match(r'^\d+$', s):
            return True
        
        # File names/extensions
        if re.match(r'^[\w-]+\.(js|ts|html|css|json|png|jpg|svg|gif|ico)$', s):
            return True
        
        # Email addresses
        if '@' in s and re.match(r'^[\w.-]+@[\w.-]+$', s):
            return True
        
        # Hex colors
        if re.match(r'^#[\da-fA-F]{3,6}$', s):
            return True
        
        # Only brackets/braces
        if re.match(r'^[<>{}[\]]+$', s):
            return True
        
        # Code-like patterns (contains operators, brackets, etc.)
        if re.search(r'[{}[\];=<>]', s) and len(s) < 50:
            return True
        
        # Already looks like a translation key
        if re.match(r'^[a-zA-Z][a-zA-Z0-9._-]*(?:\.[a-zA-Z0-9._-]+)+$', s):
            return True
        
        return False
    
    # Specific contexts where strings are likely user-facing
    user_facing_patterns = [
        # textContent, innerHTML, innerText assignments
        (r'textContent\s*=\s*["\']([^"\']{3,100})["\']', 'textContent'),
        (r'innerHTML\s*=\s*["\']([^"\']{3,100})["\']', 'innerHTML'),
        (r'innerText\s*=\s*["\']([^"\']{3,100})["\']', 'innerText'),
        # Loading overlay messages
        (r'loadingService\.show\s*\(\s*\{[^}]*message\s*:\s*["\']([^"\']{3,100})["\']', 'loading message'),
        (r'message\s*:\s*["\']([^"\']{3,100})["\']', 'message property'),
        # Error messages
        (r'error\s*:\s*["\']([^"\']{3,100})["\']', 'error property'),
        # Snackbar/dialog messages
        (r'snackBar\.open\s*\(\s*["\']([^"\']{3,100})["\']', 'snackBar.open'),
        (r'dialog\.open\s*\([^)]*["\']([^"\']{3,100})["\']', 'dialog.open'),
    ]
    
    # Scan TypeScript files (skip test files for now)
    for ts_file in src_dir.rglob("*.ts"):
        # Skip test files
        if '.spec.ts' in str(ts_file):
            continue
            
        try:
            with open(ts_file, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.split('\n')
                
                # Check user-facing contexts
                for pattern, context in user_facing_patterns:
                    matches = re.finditer(pattern, content)
                    for match in matches:
                        string_value = match.group(1)
                        
                        # Skip if should be excluded
                        if should_exclude_string(string_value):
                            continue
                        
                        # Must contain spaces or be a sentence (starts with capital, ends with punctuation)
                        has_spaces = ' ' in string_value
                        is_sentence = string_value[0].isupper() and (string_value[-1] in '.!?' or len(string_value) > 10)
                        
                        if has_spaces or is_sentence:
                            # Find line number
                            line_num = content[:match.start()].count('\n') + 1
                            # Truncate long strings for display
                            display_string = string_value[:80] + '...' if len(string_value) > 80 else string_value
                            hardcoded_strings.append((str(ts_file.relative_to(src_dir.parent)), display_string, line_num))
        except Exception as e:
            print(f"Warning: Failed to process {ts_file}: {e}", file=sys.stderr)
    
    # Remove duplicates and sort
    seen = set()
    unique_strings = []
    for file_path, string_val, line_num in hardcoded_strings:
        key = (file_path, string_val, line_num)
        if key not in seen:
            seen.add(key)
            unique_strings.append((file_path, string_val, line_num))
    
    return sorted(unique_strings, key=lambda x: (x[0], x[2]))


def find_unused_keys(
    translations: Dict[str, Dict[str, str]],
    code_keys: Set[str],
    ignored_patterns: Set[str]
) -> Tuple[List[str], List[str], int]:
    """
    Find unused translation keys and keys used in code but missing from JSON.
    
    Args:
        translations: Dictionary mapping language codes to translation dictionaries
        code_keys: Set of keys found in the codebase
        ignored_patterns: Set of ignored key patterns
        
    Returns:
        Tuple of (unused_keys, missing_keys, ignored_count)
    """
    # Get all keys from all translation files
    all_translation_keys = set()
    for lang_data in translations.values():
        all_translation_keys.update(lang_data.keys())
    
    # Find unused keys (in JSON but not in code, excluding ignored)
    unused_keys = []
    ignored_count = 0
    for key in all_translation_keys:
        if is_key_ignored(key, ignored_patterns):
            ignored_count += 1
        elif key not in code_keys:
            unused_keys.append(key)
    
    unused_keys.sort()
    
    # Find keys used in code but missing from JSON
    missing_keys = sorted(code_keys - all_translation_keys)
    
    return unused_keys, missing_keys, ignored_count


def print_missing_keys_report(missing_keys: Dict[str, Dict[str, List[str]]], verbose: bool = False):
    """Print a report of missing keys across language files."""
    print("\n" + "=" * 80)
    print("MISSING KEYS REPORT")
    print("=" * 80)
    
    total_missing = 0
    for lang_code, missing_by_lang in missing_keys.items():
        if not missing_by_lang:
            continue
        
        lang_missing_count = sum(len(keys) for keys in missing_by_lang.values())
        if lang_missing_count > 0:
            total_missing += lang_missing_count
            print(f"\n{lang_code.upper()}.json is missing {lang_missing_count} key(s):")
            for source_lang, keys in missing_by_lang.items():
                if keys:
                    print(f"  Missing from {source_lang.upper()}.json ({len(keys)} key(s)):")
                    if verbose:
                        for key in keys:
                            print(f"    - {key}")
                    else:
                        # Show first 5 keys
                        for key in keys[:5]:
                            print(f"    - {key}")
                        if len(keys) > 5:
                            print(f"    ... and {len(keys) - 5} more")
    
    if total_missing == 0:
        print("\n✓ All translation files have the same keys!")
    else:
        print(f"\nTotal missing keys: {total_missing}")
    
    print()


def print_hardcoded_strings_report(hardcoded_strings: List[Tuple[str, str, int]], verbose: bool = False):
    """Print a report of hardcoded strings that might need translation."""
    print("\n" + "=" * 80)
    print("HARDCODED STRINGS REPORT")
    print("=" * 80)
    
    if hardcoded_strings:
        print(f"\nFound {len(hardcoded_strings)} potential hardcoded string(s) that might need translation:")
        if verbose:
            for file_path, string_val, line_num in hardcoded_strings:
                print(f"  {file_path}:{line_num}")
                print(f"    \"{string_val}\"")
        else:
            # Group by file
            files_dict = {}
            for file_path, string_val, line_num in hardcoded_strings:
                if file_path not in files_dict:
                    files_dict[file_path] = []
                files_dict[file_path].append((string_val, line_num))
            
            # Show first 10 files
            for i, (file_path, strings) in enumerate(list(files_dict.items())[:10]):
                print(f"\n  {file_path}:")
                for string_val, line_num in strings[:5]:  # First 5 per file
                    print(f"    Line {line_num}: \"{string_val}\"")
                if len(strings) > 5:
                    print(f"    ... and {len(strings) - 5} more in this file")
            
            if len(files_dict) > 10:
                print(f"\n  ... and {len(files_dict) - 10} more file(s)")
    else:
        print("\n✓ No hardcoded strings found that need translation!")
    
    print()


def print_unused_keys_report(
    unused_keys: List[str],
    missing_keys: List[str],
    ignored_count: int,
    verbose: bool = False
):
    """Print a report of unused and missing translation keys."""
    print("\n" + "=" * 80)
    print("UNUSED KEYS REPORT")
    print("=" * 80)
    
    if unused_keys:
        print(f"\nFound {len(unused_keys)} unused translation key(s):")
        if verbose:
            for key in unused_keys:
                print(f"  - {key}")
        else:
            # Show first 20 keys
            for key in unused_keys[:20]:
                print(f"  - {key}")
            if len(unused_keys) > 20:
                print(f"  ... and {len(unused_keys) - 20} more")
    else:
        print("\n✓ No unused translation keys found!")
    
    if missing_keys:
        print(f"\nFound {len(missing_keys)} key(s) used in code but missing from translation files:")
        if verbose:
            for key in missing_keys:
                print(f"  - {key}")
        else:
            # Show first 20 keys
            for key in missing_keys[:20]:
                print(f"  - {key}")
            if len(missing_keys) > 20:
                print(f"  ... and {len(missing_keys) - 20} more")
    else:
        print("\n✓ All keys used in code are present in translation files!")
    
    if ignored_count > 0:
        print(f"\nNote: {ignored_count} key(s) were ignored (not reported as unused)")
    
    print()


def main():
    """Main entry point for the translation tool."""
    parser = argparse.ArgumentParser(
        description="Translation management tool for SITMUN Admin App",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Run all operations (sort, check keys, find unused)
  python translation_tool.py
  
  # Skip sorting
  python translation_tool.py --no-sort
  
  # Use custom ignore file
  python translation_tool.py --ignore-file custom-ignore.txt
  
  # Ignore specific keys
  python translation_tool.py --ignore-keys "error.*,legacy.key"
        """
    )
    
    parser.add_argument(
        '--no-sort',
        action='store_true',
        help='Skip sorting translation files'
    )
    
    parser.add_argument(
        '--output',
        choices=['text', 'json'],
        default='text',
        help='Output format (default: text)'
    )
    
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Show detailed output'
    )
    
    parser.add_argument(
        '--ignore-file',
        type=Path,
        help='Path to text file containing ignored keys (one per line, supports wildcards)'
    )
    
    parser.add_argument(
        '--ignore-keys',
        type=str,
        help='Comma-separated list of keys to ignore (alternative to ignore file)'
    )
    
    parser.add_argument(
        '--check-hardcoded',
        action='store_true',
        help='Also check for hardcoded strings that might need translation'
    )
    
    args = parser.parse_args()
    
    # Get paths
    i18n_dir = get_i18n_dir()
    src_dir = get_src_dir()
    
    if not i18n_dir.exists():
        print(f"Error: i18n directory not found: {i18n_dir}", file=sys.stderr)
        sys.exit(1)
    
    if not src_dir.exists():
        print(f"Error: src directory not found: {src_dir}", file=sys.stderr)
        sys.exit(1)
    
    # Sort translation files
    if not args.no_sort:
        print("Sorting translation files...")
        if sort_translation_files(i18n_dir, args.verbose):
            print("✓ All translation files sorted successfully")
        else:
            print("⚠ Some errors occurred while sorting files", file=sys.stderr)
    
    # Load translation files
    print("\nLoading translation files...")
    translations = load_translation_files(i18n_dir)
    if not translations:
        print("Error: No translation files found!", file=sys.stderr)
        sys.exit(1)
    
    print(f"✓ Loaded {len(translations)} translation file(s)")
    
    # Detect missing keys
    print("\nDetecting missing keys...")
    missing_keys = detect_missing_keys(translations)
    print_missing_keys_report(missing_keys, args.verbose)
    
    # Scan codebase for keys
    print("Scanning codebase for translation keys...")
    code_keys = scan_codebase_for_keys(src_dir)
    print(f"✓ Found {len(code_keys)} unique translation key(s) in codebase")
    
    # Load ignored keys
    ignored_patterns = load_ignored_keys(args.ignore_file, args.ignore_keys)
    if ignored_patterns:
        print(f"✓ Loaded {len(ignored_patterns)} ignored key pattern(s)")
    
    # Find unused keys
    print("\nFinding unused translation keys...")
    unused_keys, missing_in_json, ignored_count = find_unused_keys(
        translations, code_keys, ignored_patterns
    )
    
    print_unused_keys_report(unused_keys, missing_in_json, ignored_count, args.verbose)
    
    # Check for hardcoded strings if requested
    if args.check_hardcoded:
        print("Scanning for hardcoded strings...")
        hardcoded_strings = detect_hardcoded_strings(src_dir)
        print_hardcoded_strings_report(hardcoded_strings, args.verbose)
    
    # Exit with error code if there are issues
    if unused_keys or missing_in_json:
        sys.exit(1)
    else:
        sys.exit(0)


if __name__ == '__main__':
    main()


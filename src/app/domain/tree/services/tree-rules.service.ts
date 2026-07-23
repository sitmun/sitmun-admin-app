import { Injectable } from '@angular/core';

import { config } from '@config';

import type { CodeList } from '../../codelist/models/codelist.model';

interface TreeTypeNodeConfig {
  allowedChildren?: string[];
  icon?: string;
  iconFont?: string;
  appearanceLabelKey?: string;
  showAppearancePanelWhenParentIs?: string[];
  capabilities?: Record<string, boolean>;
  [key: string]: unknown;
}

interface TreeTypeConfig {
  allowedRootTypes?: string[];
  capabilities?: Record<string, boolean>;
  nodeTypes?: Record<string, TreeTypeNodeConfig>;
}

/**
 * Typed tree rule helpers shared by tree form, tree nodes, and data-tree widgets.
 */
@Injectable({
  providedIn: 'root',
})
export class TreeRulesService {

  /** Whether a tree type exposes an optional capability (e.g. radioFolders on cartography trees). */
  supportsTreeCapability(treeType: string, capability: string): boolean {
    const capabilities = this.getTreeTypeConfig(treeType)?.capabilities;
    return capabilities?.[capability] === true;
  }

  /** Whether a node type within a tree type exposes an optional capability (e.g. radio on folder nodes). */
  supportsNodeCapability(treeType: string, nodeType: string, capability: string): boolean {
    const caps = this.getNodeTypesConfig(treeType)?.[nodeType]?.capabilities;
    return caps?.[capability] === true;
  }

  /** Allowed node types for root level of a tree type. */
  getAllowedRootTypes(treeType: string): string[] {
    const c = this.getTreeTypeConfig(treeType);
    return c?.allowedRootTypes ? [...c.allowedRootTypes] : [];
  }

  /** Whether this node type can have children (container). */
  canNodeTypeHaveChildren(treeType: string, nodeType: string | null): boolean {
    if (!treeType || !nodeType) {
      return false;
    }
    const allowed = this.getNodeTypesConfig(treeType)?.[nodeType]?.allowedChildren;
    return Array.isArray(allowed) && allowed.length > 0;
  }

  /** All node types for a tree type (keys of nodeTypes). */
  getNodeTypesForTree(treeType: string): string[] {
    const nodeTypes = this.getNodeTypesConfig(treeType);
    return nodeTypes ? Object.keys(nodeTypes) : [];
  }

  /** Allowed child node types for a parent type. */
  getAllowedChildrenForNodeType(treeType: string, parentNodeType: string): string[] {
    const allowed = this.getNodeTypesConfig(treeType)?.[parentNodeType]?.allowedChildren;
    return Array.isArray(allowed) ? [...allowed] : [];
  }

  /** Panel visibility for a node type. */
  getNodePanelConfig(treeType: string, nodeType: string | null, panelName: string): boolean {
    if (!treeType || !nodeType) {
      return false;
    }
    const nodeTypes = this.getNodeTypesConfig(treeType);
    return Boolean(nodeTypes?.[nodeType]?.[panelName]);
  }

  /** Parent types for which appearance panel is shown (optional). */
  getShowAppearancePanelWhenParentIs(treeType: string, nodeType: string | null): string[] | undefined {
    if (!treeType || !nodeType) {
      return undefined;
    }
    const value = this.getNodeTypesConfig(treeType)?.[nodeType]?.showAppearancePanelWhenParentIs;
    return Array.isArray(value) ? value : undefined;
  }

  /** Appearance field label kind: custom image or Material icon. */
  getNodeTypeAppearanceLabelKey(treeType: string, nodeType: string | null): 'image' | 'icon' {
    if (!treeType || !nodeType) {
      return 'icon';
    }
    const key = this.getNodeTypesConfig(treeType)?.[nodeType]?.appearanceLabelKey;
    return key === 'image' ? 'image' : 'icon';
  }

  /** First candidate that appears in available codelist (by value). */
  pickFirstAllowedFromCodeList(candidates: string[], available: CodeList[]): string | null {
    const values = new Set(available.map((entry) => entry.value));
    for (const candidate of candidates) {
      if (values.has(candidate)) {
        return candidate;
      }
    }
    return available.length ? available[0].value : null;
  }

  /** Default container type from config rules, constrained by available codelist. */
  getDefaultContainerTypeFromRules(treeType: string, available: CodeList[]): string | null {
    if (!treeType || !available?.length) {
      return null;
    }
    const candidates = this.getNodeTypesForTree(treeType)
      .filter((nodeType) => this.canNodeTypeHaveChildren(treeType, nodeType));
    return this.pickFirstAllowedFromCodeList(candidates, available);
  }

  /** Default leaf type from config rules, constrained by available codelist. */
  getDefaultLeafTypeFromRules(treeType: string, available: CodeList[]): string | null {
    if (!treeType || !available?.length) {
      return null;
    }
    const candidates = this.getNodeTypesForTree(treeType)
      .filter((nodeType) => !this.canNodeTypeHaveChildren(treeType, nodeType));
    return this.pickFirstAllowedFromCodeList(candidates, available);
  }

  /** Icon for a node type from config; fallback by container vs leaf. */
  getNodeTypeIcon(treeType: string, nodeType: string | null): string {
    if (!nodeType) {
      return 'description';
    }
    const icon = this.getNodeTypesConfig(treeType)?.[nodeType]?.icon;
    if (icon != null && icon !== '') {
      return icon;
    }
    return this.canNodeTypeHaveChildren(treeType, nodeType) ? 'folder' : 'description';
  }

  /** Icon font for a node type from config; undefined for default. */
  getNodeTypeIconFont(treeType: string, nodeType: string | null): string | undefined {
    if (!treeType || !nodeType) {
      return undefined;
    }
    return this.getNodeTypesConfig(treeType)?.[nodeType]?.iconFont;
  }

  private getTreeTypeConfig(treeType: string): TreeTypeConfig | undefined {
    return config.treeTypeNodeTypes?.[treeType as keyof typeof config.treeTypeNodeTypes] as TreeTypeConfig | undefined;
  }

  private getNodeTypesConfig(treeType: string): TreeTypeConfig['nodeTypes'] | undefined {
    return this.getTreeTypeConfig(treeType)?.nodeTypes;
  }
}

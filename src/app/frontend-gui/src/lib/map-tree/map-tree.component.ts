import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, Output,ElementRef, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Observable, of as observableOf } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import * as xmlJs from 'xml2js';
import * as jp from 'jsonpath';

export class TreeFlatNode {
  constructor(
    public name: string,
    public path: string,
    public level: number,
    public expandable: boolean,
  ) {}
}

export class TreeNode {
  constructor(
    public name: string,
    public path: string,
    public children: TreeNode[],
  ) {}
}

/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'app-map-tree',
  templateUrl: 'map-tree.component.html',
  styleUrls: ['map-tree.component.scss']
})
export class MapTreeComponent {
  @Output() emitNode: EventEmitter<any>;
  @Input() eventCreateTreeSubscription: Observable <any> ;
  @Input() loadDataButton: Observable <any> ;
  private _eventCreateTreeSubscription: any;
  treeControl: FlatTreeControl<TreeFlatNode>;
  treeFlattener: MatTreeFlattener<TreeNode, TreeFlatNode>;
  dataSource: MatTreeFlatDataSource<TreeNode, TreeFlatNode>;
  // expansion model tracks expansion state
  expansionModel = new SelectionModel<string>(true);
  dragging = false;
  expandTimeout: any;
  expandDelay = 1000;
  validateDrop = false;
  treeData: any;

  @Input() getAll: () => Observable<any>;
  @Input() allNewElements: any;
  @ViewChild('emptyItem') emptyItem: ElementRef;

    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<TreeFlatNode, TreeNode>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap = new Map<TreeNode, TreeFlatNode>();


  constructor() {
    this.emitNode = new EventEmitter();
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<TreeFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    }

  ngOnInit() {
   this.getElements();
  }

  getElements(): void {
    this.getAll()
    .subscribe((inputText) => {
      this.parseInput(inputText);
    });
  }


  transformer = (node: TreeNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.name === node.name
      ? existingNode
      : new TreeFlatNode(node.name, node.path, level, (node.children && node.children.length > 0));

    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;

  }
  private _getLevel = (node: TreeFlatNode) => node.level;
  private _isExpandable = (node: TreeFlatNode) => node.expandable;
  private _getChildren = (node: TreeNode): Observable<TreeNode[]> => observableOf(node.children);
  hasChild = (_: number, _nodeData: TreeFlatNode) => _nodeData.expandable;

  parseInput(inputText) {
    try {
      if (inputText) {
        let parsedData;
        if (this.isJson(inputText)) {
          parsedData = JSON.parse(inputText);
          this.processData(null, parsedData);
        } else {
          xmlJs.parseString(inputText, this.processData);
        }
      }
    } catch (error) {
      alert('Error al procesar el JSON/XML. Verifique el formato.');
    }
  }

  processData(error, parsedData) {
    const treeData = this.convertToTree(parsedData, 'Root', parsedData).children;
    this.dataSource.data = treeData;
    this.treeControl.expandAll();
  }

  isJson(text: string): boolean {
    try {
      JSON.parse(text);
      return true;
    } catch (e) {
      return false;
    }
  }

  convertToTree(obj: any, name: string, origData, path = ''): TreeNode {
    let result = null;
    if (typeof obj !== 'object' || obj === null) {
      const newPath = jp.stringify(jp.paths(origData, '$..'.concat(name))[0]);
      result = { name: `${name}`, path: `${newPath}`, children: [] };
    } else if (Array.isArray(obj)) {
      result = {
        name,
        path,
        children: obj.map((item, index) =>
          this.convertToTree(item, `${name}[${index}]`, origData, `${path}/${name}[pos]`)
        )
      };
    } else {
      result = {
        name,
        path,
        children: Object.entries(obj).map(([key, value]) =>
          this.convertToTree(value, key, origData, `${path}/${key}`)
        )
      };
    }
    return result;
  }

  onNodeClick(node) {
    this.emitNode.emit(node);
  }

}



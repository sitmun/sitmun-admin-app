import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {Observable, of} from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import jsonpath from 'jsonpath';

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
export class MapTreeComponent implements OnInit {
  @Output() emitNode: EventEmitter<any>;
  @Input() eventCreateTreeSubscription: Observable <any> ;
  @Input() loadDataButton: Observable <any> ;
  treeControl: FlatTreeControl<TreeFlatNode>;
  treeFlattener: MatTreeFlattener<TreeNode, TreeFlatNode>;
  dataSource: MatTreeFlatDataSource<TreeNode, TreeFlatNode>;
  treeDataType = 'json';

  @Input() getAll: () => Observable<any>;
  @Input() allNewElements: any;
  @ViewChild('emptyItem') emptyItem: ElementRef;

  /** Map from flat node to nested node. This helps us find the nested node to be modified */
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
    .subscribe((parsedData) => {
      this.treeDataType = parsedData.dataType;
      this.processData(parsedData.data);
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

  processData(parsedData) {
    this.dataSource.data = this.convertToTree(parsedData, 'Root', parsedData).children;
    this.treeControl.expandAll();
  }
  hasChild = (_: number, _nodeData: TreeFlatNode) => _nodeData.expandable;

  convertToTree(obj: any, name: string, origData, path = ''): TreeNode {
    let result: TreeNode;
    if (typeof obj !== 'object' || obj === null) {
      let newPath = path;
      if (this.treeDataType === 'json') {
        const p: Array<Array<string | number>> = jsonpath.paths(
          origData,
          `$..${name.replace('[pos]', '[0]')}`
        );
        newPath = jsonpath.stringify(p[0]).replaceAll('[0]', '[pos]');
      } else if (this.treeDataType === 'xml') {
        newPath = path.replace('@/', '@');
      }
      result = { name: `${name}`, path: `${newPath}`, children: [] };
    } else if (Array.isArray(obj)) {
      result = {
        name,
        path,
        children: obj.map((item) =>
          this.convertToTree(item, `${name}[pos]`, origData, `${path}[pos]`)
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

  private _getChildren = (node: TreeNode): Observable<TreeNode[]> => of(node.children);

  onNodeClick(node) {
    this.emitNode.emit(node);
  }

}

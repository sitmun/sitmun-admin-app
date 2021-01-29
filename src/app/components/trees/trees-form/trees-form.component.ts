import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TreeService, TreeNodeService, CartographyService, Tree, TreeNode, Cartography } from '@sitmun/frontend-core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable, of, Subject } from 'rxjs';
import { DialogMessageComponent } from 'dist/sitmun-frontend-gui/';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-trees-form',
  templateUrl: './trees-form.component.html',
  styleUrls: ['./trees-form.component.scss']
})
export class TreesFormComponent implements OnInit {

  themeGrid: any = environment.agGridTheme;
  treeID: number = -1;
  treeForm: FormGroup;
  treeNodeForm: FormGroup;
  idFictitiousCounter=-1;
  treeToEdit: Tree;
  dataLoaded: Boolean = false;
  currentNodeIsFolder: Boolean;
  newElement: Boolean = false;
  sendNodeUpdated: Subject<any> = new Subject <any>();
  getAllElementsNodes: Subject<boolean> = new Subject <boolean>();
  createNodeEvent: Subject<boolean> = new Subject <boolean>();
  getAllElementsEventCartographies: Subject<boolean> = new Subject <boolean>();
  columnDefsCartographies: any[];
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private treeService: TreeService,
    private treeNodeService: TreeNodeService,
    private cartographyService: CartographyService,
    private http: HttpClient,
    public utils: UtilsService,
    public dialog: MatDialog,
  ) {
   
    this.initializeTreesForm();
    this.initializeTreesNodeForm();
  }



  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.treeID = +params.id;
      if (this.treeID !== -1) {
        console.log(this.treeID);

        this.treeService.get(this.treeID).subscribe(
          resp => {
            console.log(resp);
            this.treeToEdit = resp;
            this.treeForm.setValue({
              id: this.treeID,
              name: this.treeToEdit.name,
              _links: this.treeToEdit._links
            });

            this.dataLoaded = true;
          },
          error => {

          }
        );
      }
    });


    this.columnDefsCartographies = [
      {
        headerName: '',
        checkboxSelection: true,
        headerCheckboxSelection: false,
        editable: false,
        filter: false,
        minWidth: 45,
        maxWidth: 45,
        lockPosition: true
      },
      { headerName: 'Id', field: 'id', editable: false },
      { headerName: this.utils.getTranslate('treesEntity.name'), field: 'name', editable: false },
    ];

  }

  initializeTreesForm(): void {
    this.treeForm = new FormGroup({
      id: new FormControl(null, []),
      name: new FormControl(null, [Validators.required]),
      _links: new FormControl(null, [])
    })
  }

  initializeTreesNodeForm(): void {
    this.treeNodeForm = new FormGroup({
      id: new FormControl(null, []),
      name: new FormControl(null, [Validators.required]),
      tooltip: new FormControl(null, []),
      cartography: new FormControl(null, []),
      radio: new FormControl(null, []),
      active: new FormControl(null, []),
      _links: new FormControl(null, []),
      children: new FormControl(null, []),
      parent: new FormControl(null, []),
      isFolder: new FormControl(null, []),
      type: new FormControl(null, []),
      status: new FormControl(null, []),


    })
  }

  getAllCartographies = (): Observable<any> => {

   return this.cartographyService.getAll();

  }

  getAllTreeNodes= (): Observable<any> => {
      var urlReq = `${this.treeForm.value._links.allNodes.href}`
      if (this.treeForm.value._links.allNodes.templated) {
        var url = new URL(urlReq.split("{")[0]);
        url.searchParams.append("projection", "view")
        urlReq = url.toString();
      }
      return (this.http.get(urlReq))
        .pipe(map(data => data['_embedded']['tree-nodes']));

  }

  nodeReceived(node)
  {
    this.newElement=false;
    let currentType;
    if (node.isFolder)
    {
      this.currentNodeIsFolder = true;
      currentType='folder'
    }
    else
    {
      this.currentNodeIsFolder = false;
      currentType='node'
    }
    console.log(node);
    this.treeNodeForm.patchValue({
      id: node.id,
      name: node.name,
      tooltip: node.tooltip,
      radio: node.radio,
      active: node.active,
      _links: node._links,
      children: node.children,
      parent: node.parent,
      isFolder: node.isFolder,
      status: "Modified",
      type:currentType
    })
  }

  createNode(parent)
  {
    this.treeNodeForm.reset();
    this.newElement=true;
    this.currentNodeIsFolder=false
    console.log(parent);
    this.treeNodeForm.patchValue({
      parent: parent.id,
      isFolder: false,
      children: [],
      status: "Pending creation"
    })

  }

  createFolder(parent)
  {
    this.treeNodeForm.reset();
    this.newElement=true;
    this.currentNodeIsFolder=true
    this.treeNodeForm.patchValue({
      parent: parent.id,
      isFolder: true,
      children: [],
      status: "Pending creation"
    })

  }



  
  onSaveButtonClicked(){ 
    this.getAllElementsNodes.next(true);
  }

  updateNode(){
    console.log(this.treeNodeForm.value);
    this.sendNodeUpdated.next(this.treeNodeForm.value)
  }

  onSaveFormButtonClicked(){
    if(!this.currentNodeIsFolder) {this.getAllElementsEventCartographies.next(this.treeNodeForm.value)}
    else { this.updateTreeLeft(null) }
    
  }

  updateAllTrees(treesToUpdate: any[])
  {
    console.log(treesToUpdate);
    treesToUpdate.forEach(tree => {

      if(tree.status)
      {
        var treeNodeObj: TreeNode=new TreeNode();
     
        treeNodeObj.name= tree.name;
        treeNodeObj.tooltip= tree.tooltip;
        treeNodeObj.order= tree.order;
        treeNodeObj.active= tree.active;
        treeNodeObj.cartography= tree.cartography;
        treeNodeObj.tree= this.treeToEdit;
        treeNodeObj._links= tree._links;

        if(tree.status !== "Deleted")
        {

          let currentParent;
          if(tree.parent !== null) {
            currentParent= treesToUpdate.find(element => element.id === tree.parent ); 
            currentParent.tree=this.treeToEdit;
          }
          else { currentParent=null;}
          
          if (currentParent !== undefined)
          {

            treeNodeObj.parent= currentParent;
            console.log(treeNodeObj)

            if(treeNodeObj._links)
            {
              treeNodeObj._links.cartography.href=treeNodeObj._links.cartography.href.split("{")[0];
              treeNodeObj._links.parent.href=treeNodeObj._links.parent.href.split("{")[0];
              treeNodeObj._links.treeNode.href=treeNodeObj._links.treeNode.href.split("{")[0];
              treeNodeObj.tree._links.allNodes.href=treeNodeObj.tree._links.allNodes.href.split("{")[0];
            }
      
            console.log(treeNodeObj)
            this.treeNodeService.save(treeNodeObj).subscribe(
              result => {
                console.log(result);
              },
              error => {
                console.log(error);
              }
            )
          }


        }
        else {
          console.log(tree);
          this.treeNodeService.remove(treeNodeObj).subscribe(
            result => {
              console.log(result);
            },
            error => {
              console.log(error);
            }
          )
        }

      }


    });
  }

  

  getAllNodes(data: TreeNode[])
  {
    console.log(data);
    this.treeService.save( this.treeForm.value)
    .subscribe(resp => {
      this.treeToEdit=resp;
      this.updateAllTrees(data);
    },
    error=>{
      console.log(error);
    });

    
  }

  getSelectedRowsCartographies(data: any[] )
  {
    if(data.length<=0 && !this.currentNodeIsFolder)
     {
      const dialogRef = this.dialog.open(DialogMessageComponent);
      dialogRef.componentInstance.title=this.utils.getTranslate("Error");
      dialogRef.componentInstance.message=this.utils.getTranslate("cartographyNonSelectedMessage");
       dialogRef.afterClosed().subscribe();
     }
    else {
      this.updateTreeLeft(data[0])
    }

  }

  updateTreeLeft(cartography)
  {
    this.treeNodeForm.patchValue({
      cartography: cartography
    })
  
    if(this.newElement) {
      this.treeNodeForm.patchValue({
        id: this.idFictitiousCounter
      })
      console.log(this.treeNodeForm.value);
      this.idFictitiousCounter--;
      this.createNodeEvent.next(this.treeNodeForm.value);
    }
    else{ 
      this.updateNode() 
    }

    console.log(this.treeNodeForm.value);
    this.newElement=false;
    this.currentNodeIsFolder=undefined;
    this.treeNodeForm.reset();
  }
}


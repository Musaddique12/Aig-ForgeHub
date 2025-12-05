import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RfqItemsService } from '../../../Services/rfq-items-service';
import { ItemService } from '../../../Services/Items';  // ITEM SERVICE FOR DROPDOWN

@Component({
  selector: 'app-rfq-items',
  standalone:true,
  imports:[CommonModule,FormsModule],
  templateUrl:'./rfq-items.html',
  styleUrls:['./rfq-items.scss']
})
export class RfqItems implements OnInit {

  constructor(
    private route:ActivatedRoute,
    private rfqItemService:RfqItemsService,
    private itemService:ItemService,
    private cd:ChangeDetectorRef
  ){}

  rfqId:string="";

  // Item dropdown list
  itemList:any[]=[];

  // ADD ITEM FORM
  newItem = {
    rfqId:"",
    itemId:"",
    itemNo:"",
    itemName:"",
    description:"",
    quantity:1,
    uom:"",
    specifications:"",
    estimatedPrice:0,
    requiredDeliveryDate:"",
    indentLineNo:""
  };

  // EDIT MODE
  editModeId:string|null=null;
  editItem:any={};

  items:any[]=[];
  totalItems:number=0;

  query={
    rfqId:"",
    pageNumber:1,
    pageSize:10
    // searcAny
  }

  ngOnInit(){
    this.rfqId = this.route.snapshot.params['id'];
    this.query.rfqId = this.rfqId;
    this.newItem.rfqId = this.rfqId;

    this.getItems();
    this.loadItemDropdown();
  }

  // GET ITEMS OF RFQ
  getItems(){
    this.rfqItemService.rfqItemsByRfqId(this.query).subscribe((res:any)=>{
      this.items = res?.data?.items ?? [];
      this.totalItems = res?.data?.totalCount ?? 0;
      this.cd.detectChanges();
    });
  }

  // LOAD ALL ITEMS FOR DROPDOWN
  loadItemDropdown(){
    this.itemService.getFiltered({}).subscribe((res:any)=>{
      this.itemList = res.data.items;
    });
  }

  // WHEN SELECT ITEM FROM DROPDOWN
  onItemSelect(id:any){
    const sel = this.itemList.find(x=>x.id == id);
    if(sel){
      this.newItem.itemId = sel.id;
      this.newItem.itemName = sel.name;
      this.newItem.itemNo = sel.itemCode;
      this.newItem.uom = sel.uom;
      this.newItem.specifications = sel.specifications;
      this.newItem.description = sel.description;
    }
  }

  // ADD ITEM TO RFQ
  addItem(){
    this.rfqItemService.addRfqItems(this.newItem).subscribe(()=>{
      alert("Item Added");
      this.getItems();
    })
  }

  // EDIT
  startEdit(i:any){
    this.editModeId = i.id;
    this.editItem = {...i};
  }

  saveEdit(){
    this.rfqItemService.updateRfqItem(this.editModeId!,this.editItem).subscribe(()=>{
      alert("Item Updated");
      this.editModeId=null;
      this.getItems();
    })
  }

  cancelEdit(){ this.editModeId=null; }

  deleteItem(id:string){
    if(confirm("Delete Item?")){
      this.rfqItemService.deleteRfqItem(id).subscribe(()=>{
        alert("Deleted");
        this.getItems();
      })
    }
  }

  prev(){ if(this.query.pageNumber>1){ this.query.pageNumber--; this.getItems(); } }
  next(){ this.query.pageNumber++; this.getItems(); }
}

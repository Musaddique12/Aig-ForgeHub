import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RfqItemsService } from '../../../Services/rfq-items-service';
import { ItemService } from '../../../Services/Items';  // ITEM SERVICE FOR DROPDOWN

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-rfq-items',
  standalone:true,
  imports:[  CommonModule,FormsModule,
  MatCardModule,MatFormFieldModule,MatInputModule,
  MatSelectModule,MatButtonModule,MatPaginatorModule,
    RouterModule  // ⭐ required for routerLink / navigate buttons

],
  templateUrl:'./rfq-items.html',
  styleUrls:['./rfq-items.scss']
})
export class RfqItems implements OnInit {

  constructor(
    private route:ActivatedRoute,
    private rfqItemService:RfqItemsService,
    private itemService:ItemService,
    private cd:ChangeDetectorRef,
     public router: Router

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
      perPiecePrice:0,       // ⭐ added
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
    pageSize:10,
    searchAny:""
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
      this.updateRfqTotal(); // caliimg here it better because when we go to item and add that then we cam back and when we came it oage get refresh so it iwll get update aautomatically 
      this.cd.detectChanges();
      console.log("loading items " ,  this.query.searchAny)
    });
  }

  
  // LOAD ALL ITEMS FOR DROPDOWN for foreng key
  loadItemDropdown(){
    this.itemService.getFiltered({}).subscribe((res:any)=>{
      this.itemList = res.data.items;
            this.fetching_Uom();  

    });
  }

  //fethcing Uom dropdown 
  uom: any[] = [];
fetching_Uom() {
    if (!this.itemList) return;
console.log(this.itemList)
    for (let item of this.itemList) {
      if (!this.uom.includes(item.uom)) {
        this.uom.push(item.uom);
      }
    }
    console.log(this.uom)
     this.cd.detectChanges();
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
      this.updateRfqTotal();
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
      this.updateRfqTotal();
    })
  }

  cancelEdit(){ this.editModeId=null; }

  deleteItem(id:string){
    if(confirm("Delete Item?")){
      this.rfqItemService.deleteRfqItem(id).subscribe(()=>{
        alert("Deleted");
        this.getItems();
        this.updateRfqTotal();
      })
    }
  }

  prev(){ if(this.query.pageNumber>1){ this.query.pageNumber--; this.getItems(); } }
  next(){ this.query.pageNumber++; this.getItems(); }


  // Paginator method 
  onPageChange(event: any) {   // if you want you can replace `any` with PageEvent
  this.query.pageNumber = event.pageIndex + 1;  
  this.query.pageSize = event.pageSize;
  this.getItems();           // reload list
}


//calculating total of the rfq item 
calculateTotal() {
  if(this.newItem.quantity && this.newItem.perPiecePrice){
    this.newItem.estimatedPrice = Number(this.newItem.quantity) * Number(this.newItem.perPiecePrice);
  }
}

updateRfqTotal() {
  console.log("ENtrign in the update rfq total method")
  let total = 0;

  this.items.forEach((x:any)=>{
      console.log("ENtrign in the update rfq total method loop")

    total += Number(x.estimatedPrice ?? 0);
  });
  console.log("existing in the update rfq total method loop")

  // Call RFQ Update API
  this.rfqItemService.updateRfqTotal(this.rfqId,total).subscribe({
    next:()=> console.log("RFQ total updated:", total),
    error:(err)=> console.log("Total update failed",err)
  })
}

}

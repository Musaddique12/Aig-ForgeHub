import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { RfqItemsService } from '../../../Services/rfq-items-service';
import { ItemService } from '../../../Services/Items';  // ⭐ For fetching item master details

@Component({
  selector: 'app-rfq-item-edit',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatFormFieldModule,
    MatInputModule, MatSelectModule,
    MatButtonModule, MatSnackBarModule,
    MatProgressBarModule
  ],
  templateUrl: './rfq-item-edit.html',
  styleUrl: './rfq-item-edit.scss',
})
export class RfqItemEdit implements OnInit {

  id:any;
  loading:boolean=false;
  editMode:boolean=false;

item : any = {
  itemName: "",
  description: "",
  quantity: 0,
  uom: "",
  perPiecePrice: 0,
  estimatedPrice: 0,
  requiredDeliveryDate: "",
  specifications: "",
  indentLineNo: ""
};

customUom:any;
  uom: any[] = [];


itemId : any;
  itemDetails:any = null;   // ⭐ For Item Master info display

  constructor(
    private route:ActivatedRoute,
    private service:RfqItemsService,
    private itemService:ItemService,   // ⭐ added
    private snack:MatSnackBar,
    public router:Router,              // ⭐ For Edit Item Master button
    private cd:ChangeDetectorRef
  ){}

  ngOnInit(){
    this.id = this.route.snapshot.paramMap.get("id");
    this.loadItem();

  }

  // Load RFQ-Item details first
  loadItem(){
    // this.loading=true;
    this.service.rfqItemById(this.id).subscribe((res:any)=>{
      this.item = res.data;
      console.log(res.data)
      this.loading=false;

      this.loadItemDetails(res.data.itemId); // ⭐ load master item info
           this.fetching_Uom();

      this.cd.detectChanges();
    },err=>{
      this.loading=false;
    })
  }

  // Fetch master item details (Only View)
  loadItemDetails(id:any) {
    if(!id) return;

    this.itemService.getItemById(id).subscribe((res:any)=>{
      this.itemDetails = res.data;
      this.cd.detectChanges();
    });
  }


  fetching_Uom() {
  this.itemService.getFiltered({}).subscribe((res:any)=>{
    const list = res.data.items;
    this.uom = [...new Set(list.map((x:any) => x.uom))];  // Unique UOMs
  });
}


  updateItem(){
     if (this.item.uom === 'custom' && this.customUom.trim() !== '') {
    this.item.uom = this.customUom;
  }
  this.item.estimatedPrice = this.item.quantity * this.item.perPiecePrice;
  
  console.log(this.item)
  this.service.updateRfqItem(this.id,this.item).subscribe({
    next:()=>{
      this.loading=false;
      this.editMode=false;
      console.log(this.item)
      this.snack.open("RFQ Item Updated ✔","Close",{duration:2500});
      this.cd.detectChanges();
    },
    error:(err)=>{
      console.log(err);
      this.loading=false;
      this.snack.open("Update Failed ❌","Close",{duration:2500});
    }
  })
}

}

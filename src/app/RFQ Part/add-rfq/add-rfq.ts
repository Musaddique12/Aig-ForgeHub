import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { RfqSerVice } from '../../../Services/RfqSerVice';
import { RfqItemsService } from '../../../Services/rfq-items-service';
import { RfqVendorService } from '../../../Services/rfq-vendor-service';
import { ItemService } from '../../../Services/Items';  // ITEM SERVICE

@Component({
  selector: 'app-add-rfq',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatStepperModule, MatInputModule, MatButtonModule
  ],
  templateUrl: './add-rfq.html',
  styleUrls:['./add-rfq.scss']
})
export class AddRfq implements OnInit {

  constructor(
    private fb:FormBuilder,
    private rfqService:RfqSerVice,
    private rfqItemsService:RfqItemsService,
    private rfqVendorService:RfqVendorService,
    private itemService: ItemService,
    private cd:ChangeDetectorRef
  ){}

  rfqId:any = null;           
  itemsList:any[] = [];       

  rfqForm!: FormGroup;
  itemForm!: FormGroup;
  vendorForm!: FormGroup;

  ngOnInit() {

    // ------------------ STEP1 RFQ ------------------
    this.rfqForm = this.fb.group({
      rfqNumber:[''],
      title:[''],
      description:[''],
      status:['draft'],
      submissionDeadline:[''],
      factoryCode:[''],
      currencyJson:[''],
      totalEstimatedValue:[0]
    });

    // ------------------ STEP2 Items ------------------
    this.itemForm = this.fb.group({
      itemId:[''],
      itemNo:[''],
      itemName:[''],
      description:[''],
      quantity:[0],
      uom:[''],
      specifications:[''],
      estimatedPrice:[0],
      requiredDeliveryDate:[''],    // <-- DateOnly format
      indentLineNo:['']
    });

    // ------------------ STEP3 Vendor ------------------
    this.vendorForm = this.fb.group({
      vendorId:[''],
      status:['Invited'],
      isAllowedAfterDeadline:[true],
      allowedUntil:[''],
      allowedBy:[null]
    });

    this.loadItems();
  }

  // 🔽 Load items for dropdown
  loadItems(){
    this.itemService.getFiltered({}).subscribe((res:any)=>{
      this.itemsList = res.data.items;
      this.getItems();
    }
  )
  }

    uom: any[] = [];
  data: any;
  query = {}
  getItems() {
    this.itemService.getFiltered(this.query).subscribe({
      next: (res: any) => {
        this.data = res.data.items
        console.log(this.data);
        this.fetching_Uom()
      },
      error: (err) => {
        console.log("Error", err);
       alert("Failed");
      }
    })
  }

  fetching_Uom() {
    if (!this.data) return;

    for (let item of this.data) {
      if (!this.uom.includes(item.uom)) {
        console.log(item.uom)
        this.uom.push(item.uom);
      }
    }
    console.log(this.uom)
     this.cd.detectChanges();
  }

  // 🔽 STEP1: Save RFQ
  saveRfq(){
    let body = {...this.rfqForm.value};

    Object.keys(body).forEach(k => { if(body[k]===""||body[k]==undefined) body[k]=null });

    if(body.submissionDeadline){
      body.submissionDeadline = new Date(body.submissionDeadline).toISOString();
    }

    body.totalEstimatedValue = Number(body.totalEstimatedValue);

    this.rfqService.addRfq(body).subscribe({
      next:(res:any)=>{
        alert("RFQ Created Successfully");
        this.rfqId = res?.data?.id;
      },
      error:(err)=>console.log("RFQ ERR:",err.error.errors)
    })
  }

  // 🔽 When Item selected - autofill fields
  onItemSelect(event:any){
    const id = event.target.value;

    this.itemForm.patchValue({ itemId:id });

    const selected = this.itemsList.find(x=>x.id===id);

    if(selected){
      this.itemForm.patchValue({
        itemName:selected.name,
        uom:selected.uom,
        description:selected.description
      });
    }
  }

  

  // 🔽 STEP2: Add RFQ Item
  addItem(){
    if(!this.rfqId) return alert("Create RFQ first!");

    let body = {...this.itemForm.value, rfqId:this.rfqId};

    Object.keys(body).forEach(k => { if(body[k]===""||body[k]==undefined) body[k]=null });

    body.quantity = Number(body.quantity);
    body.estimatedPrice = Number(body.estimatedPrice);

    // RequiredDeliveryDate must stay as YYYY-MM-DD

    this.rfqItemsService.addRfqItems(body).subscribe({
      next:(res)=>{ alert("Item Added"); },
      error:(err)=>console.log("ITEM ERR:",err.error.errors)
    })
  }

  // 🔽 STEP3: Add Vendor
  addVendor(){
    if(!this.rfqId) return alert("Create RFQ first!");

    let body = {...this.vendorForm.value, rfqId:this.rfqId};

    Object.keys(body).forEach(k => { if(body[k]===""||body[k]==undefined) body[k]=null });

    if(body.allowedUntil){
      body.allowedUntil = new Date(body.allowedUntil).toISOString();
    }

    this.rfqVendorService.addRfqVendors(body).subscribe({
      next:(res)=>alert("Vendor Added"),
      error:(err)=>console.log("VENDOR ERR:",err.error.errors)
    })
  }
}

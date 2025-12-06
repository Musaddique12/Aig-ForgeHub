import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RfqSerVice } from '../../../Services/RfqSerVice';
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";


@Component({
  selector:'app-edit-rfq',
  standalone:true,
 imports:[
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatStepperModule,
  MatButtonModule,
  ReactiveFormsModule,
  CommonModule
],
  templateUrl:'./edit-rfq.html',
  styleUrls:['./edit-rfq.scss']
})
export class EditRfq implements OnInit {

  rfqForm:any;
  rfqId:string="";

  constructor(
    private fb:FormBuilder,
    private route:ActivatedRoute,
    private rfqService:RfqSerVice,
    public router:Router
  ){
    // initialize here (constructor executes before ngOnInit)
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
  }

  ngOnInit(){
    this.rfqId = this.route.snapshot.params['id'];
    this.loadRfqDetails();
  }

  loadRfqDetails(){
    this.rfqService.rfqById(this.rfqId).subscribe((res:any)=>{
      this.rfqForm.patchValue(res.data);
      console.log("Editing RFQ:",res.data);
    });
  }

  updateRfq(){
    this.rfqService.updateRfq(this.rfqId,this.rfqForm.value).subscribe(()=>{
      alert("RFQ Updated Successfully");
      this.router.navigate(['/rfq-details',this.rfqId]);
    });
  }
}

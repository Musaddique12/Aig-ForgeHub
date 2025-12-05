import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RfqSerVice } from '../../../Services/RfqSerVice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rfq',
  imports: [CommonModule , FormsModule],
  templateUrl: './rfq.html',
  styleUrl: './rfq.scss',
})
export class Rfq {
items:any[]=[];
  query={
    RfqNumber:"",
    Title:"",
    Status:"",
    FactoryCode:"",
    CreatedBy:"",
    ApprovedBy:"",
    PageNumber:1,
    PageSize:5
  }
  constructor(private cd:ChangeDetectorRef, private services:RfqSerVice){}
  

  ngOnInit(){
    this.getData();
  }
  
  getData(){
    this.services.getRfq(this.query).subscribe({
      next:(res:any)=>{
        this.items = res.data.items
        console.log("RFQ DATA : ",res);
        this.cd.detectChanges();
      }
      ,error:(err)=>console.log(err)
    })
  }
  nextPage(){
    this.query.PageNumber = (this.query.PageNumber || 1) + 1;
    this.getData();
  }
  previousPage(){
    if(this.query.PageNumber && this.query.PageNumber > 1){
      this.query.PageNumber = this.query.PageNumber - 1;
      this.getData();
    }
  }
}
 
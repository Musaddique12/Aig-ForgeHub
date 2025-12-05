import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RfqSerVice } from '../../../Services/RfqSerVice';

@Component({
  selector:'app-show-rfq',
  standalone:true,
  imports:[CommonModule, FormsModule],
  templateUrl:'./show-rfq.html',
  styleUrls:['./show-rfq.scss']
})
export class ShowRfq implements OnInit{

  constructor(private rfqService:RfqSerVice, private router:Router , private cd:ChangeDetectorRef){}

  rfqs:any[]=[];
  query = { pageNumber:1, pageSize:20, title:"", status:"", factoryCode:"", SearchAny:"" }
  totalVendors:any=0;

  ngOnInit(){
    this.loadRfqs();
  }

  loadRfqs(){
    this.rfqService.getRfq(this.query).subscribe((res:any)=>{
      this.rfqs = res?.data?.items ?? res?.data ?? [];
      this.totalVendors = res?.data?.totalCount;
      console.log("RFQ List:",this.rfqs);
      this.cd.detectChanges();
    })
  }

  view(id:string){
    this.router.navigate(['/rfq-details',id]);  // page 2
  }

  edit(id:string){
    this.router.navigate(['/edit-rfq',id]);     // page 3 later
  }

  delete(id:string){
    if(confirm("Delete this RFQ?")){
      this.rfqService.deleteRfq(id).subscribe(()=>{
        alert("Deleted Successfully");
        this.loadRfqs();
      });
    }
  }

  prev(){
  if(this.query.pageNumber > 1){
    this.query.pageNumber--;
    this.loadRfqs();
  }
}
 next(){
  let totalPages = Math.ceil(this.totalVendors / this.query.pageSize);
  if(this.query.pageNumber < totalPages){
    this.query.pageNumber++;
    this.loadRfqs();
  }
}
}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { RfqSerVice } from '../../../Services/RfqSerVice';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector:'app-show-rfq',
  standalone:true,
  imports:[ CommonModule,
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatTableModule,
  MatButtonModule,
  MatIconModule,
  MatPaginatorModule,
  RouterModule,        // ✅ REQUIRED FOR routerLink
],
  templateUrl:'./show-rfq.html',
  styleUrls:['./show-rfq.scss']
})
export class ShowRfq implements OnInit{

  constructor(private rfqService:RfqSerVice, private router:Router , private cd:ChangeDetectorRef){}

// for setting the layout method in the html toggle between card to table
  viewMode:'card'|'table' = 'card';  
  displayedColumns:string[]=['rfqNumber','title','status','factoryCode','actions'];


  rfqs:any[]=[];
  query = { pageNumber:1, pageSize:20, title:"", status:"", factoryCode:"", SearchAny:"" }
  totalRfqs:any=0;

  ngOnInit(){
    this.loadRfqs();
  }

  loadRfqs(){
    this.rfqService.getRfq(this.query).subscribe((res:any)=>{
      this.rfqs = res?.data?.items ?? res?.data ?? [];
      this.totalRfqs = res?.data?.totalCount;
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
  let totalPages = Math.ceil(this.totalRfqs / this.query.pageSize);
  if(this.query.pageNumber < totalPages){
    this.query.pageNumber++;
    this.loadRfqs();
  }
}



// Materal built in pagination fiuntion 

onPageChange(event: PageEvent){
    this.query.pageNumber = event.pageIndex + 1;
    this.query.pageSize = event.pageSize;
    this.loadRfqs();
  }
}

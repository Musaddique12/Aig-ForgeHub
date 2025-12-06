import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RfqSerVice } from '../../../Services/RfqSerVice';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-rfq-details',
  standalone: true,
  imports:[CommonModule,  MatCardModule,
    MatButtonModule,  ],
  templateUrl: './rfq-details.html',
  styleUrls:['./rfq-details.scss']
})
export class RfqDetails implements OnInit {

  constructor(
    private route:ActivatedRoute,
    private rfqService:RfqSerVice,
    private router:Router,
    private cd:ChangeDetectorRef
  ){}

  rfqId:string = "";
  rfq:any = {};

  ngOnInit(){
    this.rfqId = this.route.snapshot.params['id'];
    this.loadRfq();
  }

  loadRfq(){
    this.rfqService.rfqById(this.rfqId).subscribe((res:any)=>{
      this.rfq = res.data;
      console.log("RFQ Details:",this.rfq);
      this.cd.detectChanges();
    });
  }

  goToItems(){
    this.router.navigate(['/rfq-items',this.rfqId]);
  }

  goToVendors(){
    this.router.navigate(['/rfq-vendors',this.rfqId]);
  }

  editRfq(){
    this.router.navigate(['/edit-rfq',this.rfqId]); // later page
  }

}

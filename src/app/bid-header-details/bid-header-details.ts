import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { VendorBidService } from '../../Services/VendorBidService ';
import { RfqSerVice } from '../../Services/RfqSerVice';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bid-header-details',
  standalone: true,
  imports: [CommonModule, MatCardModule ,  MatDividerModule,
  MatIconModule],
  templateUrl: './bid-header-details.html',
  styleUrls: ['./bid-header-details.scss']
})
export class BidHeaderDetails implements OnInit {

  headerId = "";
  header: any = null;

  constructor(private route: ActivatedRoute, private service: VendorBidService , private cd : ChangeDetectorRef) {}

  ngOnInit() {
    this.headerId = this.route.snapshot.params['id'];
    this.loadHeader();
  }

  loadHeader() {
    this.service.getBidHeaderById(this.headerId).subscribe((res: any) => {
      this.header = res;
      this.cd.detectChanges();
    });
  }

}

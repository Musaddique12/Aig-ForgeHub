import { ChangeDetectorRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { RfqSerVice } from '../../Services/RfqSerVice';
import { VendorBidService } from '../../Services/VendorBidService ';
import { error } from 'console';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Stats } from 'fs';


@Component({
  selector: 'app-rfq-bid-versions',
  standalone: true,
  imports: [
   CommonModule,
  MatCardModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatButtonModule
  ],
  templateUrl: './rfq-bid-versions.html',
  styleUrls: ['./rfq-bid-versions.scss']
})
export class RfqBidVersions implements OnInit, AfterViewInit {

  rfqId = "";
  rfq: any;
  versions: any[] = [];


  constructor(
    private route: ActivatedRoute,
    private service: VendorBidService,
    private rfqService: RfqSerVice,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}


  versionsData = new MatTableDataSource<any>();
totalVersions = 0;

displayedColumns = [
  'vendorName',
  'version',
  'offeredPrice',
  'negotiatedPrice',
  'discount',
  'freight',
  'landedCost',
  'modifiedAt',
    'status',
  'actions',
];


  ngOnInit() {
    this.rfqId = this.route.snapshot.params['rfqId'];
  }

  ngAfterViewInit() {
      this.loadRfq();
      this.loadVersions();
  }

  loadVersions() {
    this.service.getVersionsByRfq(this.rfqId).subscribe((res: any) => {
      console.log(res);
      this.versions = res.map((v: any) => ({
        id:v.id,
        bidHeaderId: v.bidHeaderId,
        vendorName: v.vendorName ?? 'Unknown Vendor',
        version: v.version,
        offeredPrice: v.offeredPrice,
        negotiatedPrice: v.negotiatedPrice,
        discount: v.negotiatedDiscountPercentage,
        freight: v.negotiatedFreightCharges,
        landedCost: v.negotiatedNetLandedCost,
        modifiedAt: v.lastModifiedDateTime,
        status:v.status
      }));
       this.totalVersions = this.versions.length;
    this.versionsData.data = this.versions;
    console.log(this.versionsData.data)
        const lowest = Math.min(...this.versions.map(v => v.landedCost));

    // 🔥 Add a flag to mark lowest bid
    this.versions = this.versions.map(v => ({
      ...v,
      isLowest: v.landedCost === lowest
    }));

    this.totalVersions = this.versions.length;
    this.versionsData.data = this.versions;
    
      this.cd.detectChanges(); // safe now
    });
  }

  onPageChange(event: any) {
  const start = event.pageIndex * event.pageSize;
  const end = start + event.pageSize;
  this.versionsData.data = this.versions.slice(start, end);
}


  loadRfq() {
    this.rfqService.rfqById(this.rfqId).subscribe((res: any) => {
      this.rfq = res.data;
      console.log(this.rfq);
      this.cd.detectChanges(); // safe now
    });
  }

  viewBidDetails(headerId: string) {
    this.router.navigate(['/bid-header', headerId]);
  }

acceptBid(row: any) {
  if (!confirm("Accept version " + row.version + "?")) return;

  // 1. Close the RFQ
  this.rfq.status = "closed";
  this.rfqService.updateRfq(this.rfqId, this.rfq).subscribe();

  // 2. Update SELECTED version to "accepted"
  this.service.getVersionById(row.id).subscribe((selectedVersion: any) => {

    selectedVersion.status = "accepted";

    this.service.UpdateVersion(row.id, selectedVersion).subscribe({
      next: () => {
        
        // 3. Reject all other versions
        this.rejectAllOthers(row.id);

      },
      error: err => console.error("Accept update error:", err)
    });

  });
}


rejectAllOthers(acceptedId: string) {

  this.versions.forEach(v => {

    if (v.id !== acceptedId) {

      this.service.getVersionById(v.id).subscribe((fullVersion: any) => {

        fullVersion.status = "rejected";

        this.service.UpdateVersion(v.id, fullVersion).subscribe({
          next: () => console.log("Rejected:", v.id),
          error: err => console.error("Reject error:", err)
        });

      });

    }

  });

  // Reload table after all updates finish
  setTimeout(() => this.loadVersions(), 500);
}

 rejectBid(row: any) {
  if (!confirm("Bid Rejected for Version " + row.version)) return;

  this.service.getVersionById(row.id).subscribe((fullVersion: any) => {

    fullVersion.status = "rejected";

    this.service.UpdateVersion(row.id, fullVersion).subscribe({
      next: () => this.loadVersions(),
      error: err => console.log("Error rejecting bid:", err)
    });

  });
}

}

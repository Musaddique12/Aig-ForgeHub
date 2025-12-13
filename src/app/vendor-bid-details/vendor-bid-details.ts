import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VendorBidService } from '../../Services/VendorBidService ';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-vendor-bid-details',
  templateUrl: './vendor-bid-details.html',
  styleUrls: ['./vendor-bid-details.scss'],
  imports:[CommonModule, MatCardModule ,    MatPaginatorModule // <-- ADD THIS
,MatTableModule , MatDividerModule ,     MatFormFieldModule,  // <-- REQUIRED
    MatInputModule,       // <-- REQUIRED
    MatIconModule ]
})
export class VendorBidDetails implements OnInit {

  dataSource = new MatTableDataSource<any>([]);
@ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
  'version',
  'offeredPrice',
  'negotiatedPrice',
  'discount',
  'freight',
  'landed'
];

  rfqId = "";
  vendorId = "";

  header: any = null;       // selected details from VendorBidHeader
  versions: any[] = [];     // list of bid versions

  constructor(
    private route: ActivatedRoute,
    private service: VendorBidService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.rfqId = this.route.snapshot.params['rfqId'];
    this.vendorId = this.route.snapshot.params['vendorId'];
console.log("hellow enterinf inti")
    this.loadHeader();
  }

  loadHeader() {
    this.service.getBidHeader(this.rfqId, this.vendorId).subscribe((res: any) => {
      
      if (!res || res.length === 0) {
        alert("No Bid Found for this Vendor!");
        return;
      }
      console.log(res)
      const h = res[0];   // Usually returns a single object

      // selecting only important fields
      this.header = {
        id: h.id,
        vendorName: h.vendorName,
        bidNo: h.bidNo,
        bidDate: h.bidDate,
        expiryDate: h.expiryDate,
        status: h.status,
        contactPerson: h.contactPerson,
        mobileNo: h.mobileNo
      };
      this.cd.detectChanges();

      this.loadVersions(h.id);
    });
  }

 loadVersions(headerId: string) {
  this.service.getBidVersions(headerId).subscribe((res: any) => {
    
    this.versions = res.map((v: any) => ({
      version: v.version,
      offeredPrice: v.offeredPrice,
      negotiatedPrice: v.negotiatedPrice,
      negotiatedDiscountPercentage: v.negotiatedDiscountPercentage,
      negotiatedFreightCharges: v.negotiatedFreightCharges,
      negotiatedNetLandedCost: v.negotiatedNetLandedCost
    }));

    // Set table data
    this.dataSource.data = this.versions;

    // Attach paginator
    this.dataSource.paginator = this.paginator;

    this.dataSource.filterPredicate = (data: any, filter: string) => {
  return Object.values(data)
    .join(' ')
    .toLowerCase()
    .includes(filter);
};


    this.cd.detectChanges();

  });
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  // Reset to first page if filtering
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

}

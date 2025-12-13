import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RfqVendorService } from '../../../Services/rfq-vendor-service';

import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-rfq-vendors',
  standalone: true,
 imports: [
  CommonModule,
  FormsModule,

  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatPaginatorModule
],
  templateUrl: './rfq-vandors.html',
  styleUrls: ['./rfq-vandors.scss']
})
export class RfqVendors implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private service: RfqVendorService,
    private cd: ChangeDetectorRef,
      private router: Router         // ✅ added

  ) { }

  rfqId: string = "";
  vendors: any[] = [];
  totalVendors: number = 0;
  pagenumber:number =1;
  pageSize : number = 10;
  status:any = null;

  //---------------- Form for add new vendor ----------------
  newVendor = {
    rfqId: "",
    vendorId: "",
    status: "Invited",
    isAllowedAfterDeadline: true,
    allowedUntil: "",
    allowedBy: null
  }

  //---------------- edit mode ----------------
  editModeId: string | null = null;
  editVendor: any = {};

  //---------------- Dummy Vendor List (Dropdown) ----------------
  sampleVendors = [
    { id: "427A92CB-A7F4-4633-98C0-41536D0A04FA", name: "Vendor A" },
    { id: "721B0000-7E22-4BA0-864D-4270BB461162", name: "Vendor B" },
    { id: "93330235-E241-4138-B144-5706773F706A", name: "Vendor C" },
  ];

  ngOnInit() {
    this.rfqId = this.route.snapshot.params['id'];
    this.newVendor.rfqId = this.rfqId;
    this.loadVendors();
  }

  loadVendors() {
    this.service.getRfqVendors({ rfqId: this.rfqId , PageNumber : this.pagenumber, PageSize: this.pageSize , Status:this.status }).subscribe((res: any) => {
      this.vendors = res?.data?.items ?? [];
      this.totalVendors = res?.data?.totalCount ?? 0;
      console.log("VENDORS =>", this.vendors);
      this.cd.detectChanges();
    });
  }

  addVendor() {
    if (!this.newVendor.allowedUntil) {
      this.newVendor.allowedUntil = null as any;
    }
    this.service.addRfqVendors(this.newVendor).subscribe(() => {
      alert("Vendor Added");
      this.loadVendors();
    });
  }

  startEdit(v: any) {
    this.editModeId = v.id;
    this.editVendor = { ...v };   // copy data to form
  }

  saveEdit() {
    this.service.updateRfqVendor(this.editModeId!, this.editVendor).subscribe(() => {
      alert("Vendor Updated");
      this.editModeId = null;
      this.loadVendors();
    });
  }

  cancelEdit() {
    this.editModeId = null;
  }

  deleteVendor(id: string) {
    if (confirm("Remove vendor?")) {
      this.service.deleteRfqVendor(id).subscribe(() => {
        alert("Vendor Deleted");
        this.loadVendors();
      });
    }
  }

prev(){
  if(this.pagenumber > 1){
    this.pagenumber--;
    this.loadVendors();
  }
}
 next(){
  let totalPages = Math.ceil(this.totalVendors / this.pageSize);
  if(this.pagenumber < totalPages){
    this.pagenumber++;
    this.loadVendors();
  }
}

onPageChange(event: PageEvent) {
  this.pagenumber = event.pageIndex + 1;
  this.pageSize = event.pageSize;
  this.loadVendors();
}


goToBidDetails(vendorId: string) {
  this.router.navigate([
    '/rfq',
    this.rfqId,
    'vendor',
    vendorId,
    'bids'
  ]);
}


}

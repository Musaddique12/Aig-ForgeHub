import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorBidService {

  api = "https://localhost:7172/api";

  constructor(private http: HttpClient) { }

  // Get Bid Header by RFQ + Vendor
  getBidHeader(rfqId: string, vendorId: string): Observable<any> {
    return this.http.get(`${this.api}/VendorBidHeader/rfqAndVendor`, {
      params: { rfqId, vendorId }
    });
  }

  // Get all Versions for a bid header
  getBidVersions(headerId: string): Observable<any> {
    return this.http.get(`${this.api}/VendorBidVersion/header/${headerId}`);
  }

  getVersionsByRfq(rfqId: string) {
  return this.http.get(`${this.api}/VendorBidVersion/rfq/${rfqId}`);
}

getBidHeaderById(headerId: string) {
  return this.http.get(`${this.api}/VendorBidHeader/${headerId}`);
}

DeleteVerion(id: string) {
  return this.http.delete(`${this.api}/VendorBidVersion/delete/${id}`);
}

UpdateVersion(id: string,data:any) {
  return this.http.put(`${this.api}/VendorBidVersion/update/${id}`,data);
}

getVersionById(id: string) {
  return this.http.get(`${this.api}/VendorBidVersion/${id}`);
}

}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RfqVendorService {
  url = "https://localhost:7097/api/RfqVendor";

  constructor(private http:HttpClient){}
  getRfqVendors(query:any){
    
    let params = new HttpParams();

    Object.keys(query).forEach((key)=>{
      if(query[key] !== null && query[key] !== undefined){
        params = params.set(key , query[key]);
      }
    })

    return this.http.get(`${this.url}/rfq` , {params});
  }

    addRfqVendors(data:any){
    return this.http.post(`${this.url}/add`,data)
  }

  rfqVendorById(id:any){
     return this.http.get(`${this.url}/${id}`,)
  }

  deleteRfqVendor(id:string){
  return this.http.delete(`${this.url}/delete/${id}`);
}
updateRfqVendor(id:any,data:any){
  return this.http.put(`${this.url}/update/${id}`,data);
}



}

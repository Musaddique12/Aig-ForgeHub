import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RfqSerVice {
  url = "https://localhost:7097/api/Rfq";

  constructor(private http:HttpClient){}

  getRfq(query:any){
    let params = new HttpParams();

    Object.keys(query).forEach((key)=>{
      if(query[key] !== null && query[key] !== "" && query[key] !== undefined){
        params = params.set(key,query[key]);
      }
    })
    return this.http.get(`${this.url}/all` , {params : params});
  }
    addRfq(data:any){
    return this.http.post(`${this.url}/add`,data)
  }

   rfqById(id:any){
     return this.http.get(`${this.url}/${id}`,)
  }

  deleteRfq(id:string){
  return this.http.delete(`https://localhost:7097/api/Rfq/delete/${id}`);
}

updateRfq(id:string,data:any){
  return this.http.put(`https://localhost:7097/api/Rfq/update/${id}`,data);
}


}

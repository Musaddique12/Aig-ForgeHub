import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RfqItemsService {
  url = "https://localhost:7097/api/RfqItem";

  constructor(private http: HttpClient) {}


  rfqItemsByRfqId(query:any){
     let params = new HttpParams();
    Object.keys(query).forEach((key)=>{
      if(query[key] !== null && query[key] !== undefined){
        params = params.set(key , query[key]);
      }
    })
    return this.http.get(`${this.url}/rfq`,{params})
  }

  addRfqItems(data:any){
    return this.http.post(`${this.url}/add`,data)
  }

   rfqItemById(id:any){
     return this.http.get(`${this.url}/${id}`,)
  }

  deleteRfqItem(id:string){
  return this.http.delete(`${this.url}/delete/${id}`);
}
updateRfqItem(id: string, data: any) {
  return this.http.put(`${this.url}/update/${id}`, data);
}

}


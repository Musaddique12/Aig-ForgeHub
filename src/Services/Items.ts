import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private http:HttpClient){  }
  url="https://localhost:7097/api/Item";

  
   getFiltered(query: any) {
    let params = new HttpParams();

    Object.keys(query).forEach((key) => {
      if (query[key] !== null && query[key] !== "" && query[key] !== undefined) {
        params = params.set(key, query[key]);
      }
    });

    return this.http.get(`${this.url}/all`, { params });
  }

   addItem(data:any){
    return this.http.post(`${this.url}/add`, data);
  }

  updateItem(id:string , data:any){
  return this.http.put(`${this.url}/update/${id}`, data);
}

getItemById(id:string){
  return this.http.get(`${this.url}/${id}`);
}


}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ItemService } from '../../../Services/Items';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-api',
  imports: [CommonModule, FormsModule] ,
  templateUrl: './Items.html',
  styleUrl: './Items.scss',
})

export class ShowItems implements OnInit {
    
query = {
  name: "",
  itemCode: "",
  uom: "",
  SearchAny:"",
  isActive: null,
  isSyncedFromExternalApi: null,
  pageNumber: 1,
  pageSize: 20
};

items: any[] = [];
totalItems : any =0;

constructor(private testService: ItemService , private cd: ChangeDetectorRef , private router:Router , private http : HttpClient) {}

ngOnInit() {
  this.getItems();
}

getItems() {
  this.testService.getFiltered(this.query).subscribe({
    next: (res: any) => {
      this.items = res.data.items;       // <-- array
      this.query.pageNumber = res.data.pageNumber;
      this.totalItems = res.data.totalCount;
      console.log(res);
      this.cd.detectChanges();
    },
    error: (err) => console.log(err)
  });
}

next(){
    let totalPages = Math.ceil(this.totalItems / this.query.pageSize);
  if(this.query.pageNumber < totalPages){
 
    this.query.pageNumber = this.query.pageNumber + 1;
    this.getItems();
  }
}

previous(){
  if(this.query.pageNumber > 1){
    this.query.pageNumber = this.query.pageNumber - 1;
    this.getItems();
  }
}

update(id:any){
this.router.navigate(["/updateItems",id]);
}

Delete(id:any){
  this.http.delete(`https://localhost:7097/api/Item/delete/${id}`).subscribe({
    next:()=>{
      alert("Item Deleted Successfully");
      this.getItems();          // refresh list after delete (optional)
    },
    error:(err)=>{
      console.error(err);
      alert("Delete failed");
    }
  });
}

}

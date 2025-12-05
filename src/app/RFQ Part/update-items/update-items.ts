import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../../../Services/Items';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-items',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-items.html',
  styleUrls: ['./update-items.scss'],
})
export class UpdateItems implements OnInit {

  id:any;
  item:any = {
    name:'',
    description:'',
    categoryJson:'',
    uom:'',
    specifications:'',
    toleranceJson:'',
    isActive:true
  };

  constructor(private route:ActivatedRoute, private service:ItemService , private cd:ChangeDetectorRef) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getItems();
    this.loadItem();
  }

  loadItem(){
    this.service.getItemById(this.id).subscribe((res:any)=>{
      this.item = res.data;          // adjust if response shape = res
      console.log("Loaded:", this.item);
    });
  }

  update(){
    this.service.updateItem(this.id, this.item).subscribe({
      next:(res)=>{
        console.log("Updated Successfully", res);
        alert("Item updated successfully");
      },
      error:(err)=>{
        console.log(err);
        alert("Failed to update");
      }
    })
  }


  uom: any[] = [];
  data: any;
  query = {}
  getItems() {
    this.service.getFiltered(this.query).subscribe({
      next: (res: any) => {
        this.data = res.data.items
        console.log(this.data);
        this.fetching_Uom()
      },
      error: (err) => {
        console.log("Error", err);
       alert("Failed");
      }
    })
  }

  fetching_Uom() {
    if (!this.data) return;

    for (let item of this.data) {
      if (!this.uom.includes(item.uom)) {
        console.log(item.uom)
        this.uom.push(item.uom);
      }
    }
    console.log(this.uom)
     this.cd.detectChanges();
  }

}

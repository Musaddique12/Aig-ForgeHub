import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../../Services/Items';

@Component({
  selector: 'app-add-items',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-items.html',
  styleUrls: ['./add-items.scss'],
})
export class AddItems implements OnInit {

  item: any = {
    itemCode: '',
    name: '',
    description: '',
    categoryJson: '',
    uom: '',
    specifications: '',
    toleranceJson: '',
    isActive: true
  };

  uom: any[] = [];
  data: any;
  query = {}

  constructor(private service: ItemService , private cd:ChangeDetectorRef) { }

    ngOnInit() {
    this.getItems();
  }

  submit() {
    this.service.addItem(this.item).subscribe({
      next: (res) => {
        console.log("Item Added Successfully", res);
        alert("Added Successfully");
      },
      error: (err) => {
        console.log("Error", err);
        alert("Failed");
      }
    })
  }

  
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

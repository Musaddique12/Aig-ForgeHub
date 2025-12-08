import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../../Services/Items';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-items',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],  templateUrl: './add-items.html',
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

customUom:any;
  uom: any[] = [];
  data: any;
  query = {}

  constructor(private service: ItemService , private cd:ChangeDetectorRef) { }

    ngOnInit() {
    this.getItems();
  }

  submit() {
     // If custom is selected replace final UOM with entered text
     console.log("Original Selected:", this.item.uom);
  console.log("Custom Entered:", this.customUom);
  
  if (this.item.uom === 'custom' && this.customUom.trim() !== '') {
    this.item.uom = this.customUom;
  }
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

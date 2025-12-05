import { Component } from '@angular/core';
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
export class AddItems {

  item:any = {
    itemCode: '',
    name: '',
    description: '',
    categoryJson: '',
    uom: '',
    specifications: '',
    toleranceJson: '',
    isActive: true
  };

  constructor(private service: ItemService) {}

  submit(){
    this.service.addItem(this.item).subscribe({
      next:(res)=>{
        console.log("Item Added Successfully", res);
        alert("Added Successfully");
      },
      error:(err)=>{
        console.log("Error", err);
        alert("Failed");
      }
    })
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-second',
  imports: [FormsModule],
  templateUrl: './second.html',
  styleUrl: './second.scss',
})
export class Second {
selectedColor:any;

chengerClr(colval:any){
  this.selectedColor = colval;
}

res:any;
firstNumber : any;
seconNumber : any;
add(){
  this.res = this.firstNumber + this.seconNumber;
}


v=false;
}



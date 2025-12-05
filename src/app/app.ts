import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLink } from '@angular/router';
import { First } from "./RFQ Part/first/first";
import { Second } from './RFQ Part/second/second';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
 name="Musa";
 age = "12";
 arr=["WHite", "Black", "Red"];
 obj={name:"Musa", age:12}
 arrobj=[{name:"Musa", age:12}, {name:"Ali", age:14}];


 changeName(){
  this.name="ali";
 }
}

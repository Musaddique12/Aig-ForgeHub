import { Routes } from '@angular/router';

import { First } from './RFQ Part/first/first';
import { ShowItems } from './RFQ Part/Items/Items';
import { Rfq } from './RFQ Part/rfq/rfq';
import { RfqItems } from './RFQ Part/rfq-items/rfq-items';
import { AddItems } from './RFQ Part/add-items/add-items';
import { UpdateItems } from './RFQ Part/update-items/update-items';
import { AddRfq } from './RFQ Part/add-rfq/add-rfq';
import { ShowRfq } from './RFQ Part/show-rfq/show-rfq';
import { RfqDetails } from './RFQ Part/rfq-details/rfq-details';
import { RfqVendors } from './RFQ Part/rfq-vandors/rfq-vandors';
import { RfqItemEdit } from './RFQ Part/rfq-item-edit/rfq-item-edit';

export const routes: Routes = [
    {path:'',redirectTo:'showRfq',pathMatch:'full'},
    {path:'ShowItem',component:ShowItems},
    {path:'addItems',component:AddItems},
  { path: 'updateItems/:id', component: UpdateItems },  // <-- add this
    // {path:'rfq',component:Rfq},
    {path:'rfqItems',component:RfqItems},
    {path:'addRfq',component:AddRfq},
    {path:'showRfq',component:ShowRfq},
    { path: "rfq-item/:id", component: RfqItemEdit },
    { path:"rfq-details/:id", loadComponent:()=>import('./RFQ Part/rfq-details/rfq-details').then(m=>m.RfqDetails) },
{ path:"rfq-items/:id", loadComponent:()=>import('./RFQ Part/rfq-items/rfq-items').then(m=>m.RfqItems) },     // Next
{ path:"rfq-vendors/:id", loadComponent:()=>import('./RFQ Part/rfq-vandors/rfq-vandors').then(m=>m.RfqVendors) }, // Next
{ path:"edit-rfq/:id", loadComponent:()=>import('./RFQ Part/edit-rfq/edit-rfq').then(m=>m.EditRfq) },

];

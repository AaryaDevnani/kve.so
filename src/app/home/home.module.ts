import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { HomePage } from "./home.page";

import { HomePageRoutingModule } from "./home-routing.module";

import { NgxQRCodeModule } from "ngx-qrcode2";
import { from } from "rxjs";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    NgxQRCodeModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}

import { Component } from "@angular/core";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { SMS } from "@ionic-native/sms/ngx";
import { WifiWizard2 } from "@ionic-native/wifi-wizard-2/ngx";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  scannedCode = null;
  htmlVariable: any = "";
  ssid: any = "";
  pw: any = "";
  wifiArr: any = "";
  phone: any = "";
  mphone: any = "";
  message: any = "";
  algorithm: any = "";
  emailAdd: any = "";
  mailTo: any = "";
  email: any = "";
  emailSub: any = "";
  emailBody: any = "";
  emailArr: any = "";
  eventArr: any = "";
  eventName: any = "";
  eventDesc: any = "";
  constructor(
    private barcodeScanner: BarcodeScanner,
    private callNumber: CallNumber,
    private sms: SMS,
    private wifiWizard: WifiWizard2
  ) {}

  scanCode() {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.scannedCode = barcodeData.text;
      this.checkForURL(this.scannedCode);
    });
  }
  ngAfterViewInit() {
    this.scanCode();
  }

  checkForURL(str2) {
    if (str2.includes("http")) {
      this.htmlVariable =
        "<a href='" + this.scannedCode + "'>" + this.scannedCode + "</a>";
    } else if (str2.includes("tel:")) {
      //phone no.
      this.phone = this.scannedCode.slice(4);

      this.htmlVariable =
        "<a href=tel:'" + this.phone + "'>" + this.phone + "</a>";
      /* this.htmlVariable = "<div>" + this.phone + "</div>"
            this.callNumber.callNumber(this.phone, false);
         */
    } else if (str2.includes("SMSTO:") || str2.includes("smsto")) {
      //message
      this.mphone = this.scannedCode.slice(6, 16);
      this.message = this.scannedCode.slice(17);
      var options = { android: { intent: "INTENT" } };

      this.htmlVariable =
        "<a>" + this.mphone + "</a>" + "<div>" + this.message + "</div>";
      this.sms.send(this.mphone, this.message, options);
    } else if (str2.includes("WIFI")) {
      //wifi
      this.wifiArr = this.scannedCode.trim().split(";");
      this.ssid = this.wifiArr[1];
      this.pw = this.wifiArr[2];
      this.algorithm = this.wifiArr[0];

      this.htmlVariable =
        "<div>" + this.ssid + "</div>" + "<div>" + this.pw + "</div>";
      this.wifiWizard.connect(
        this.ssid.slice(2),
        false,
        this.pw.slice(2),
        this.algorithm.slice(7)
      );
    } else if (str2.includes("mailto:")) {
      //email
      this.emailArr = this.scannedCode.trim().split("?");
      this.mailTo = this.emailArr[0];
      this.emailAdd = this.mailTo.slice(7);
      this.email = this.emailArr[1];
      this.emailSub = this.email.trim().split("&")[0];
      this.emailBody = this.email.trim().split("&")[1];

      this.htmlVariable =
        "<a href='" +
        this.scannedCode +
        "'>" +
        this.emailAdd +
        "</a>" +
        "<div>" +
        this.emailSub +
        "</div>" +
        "<div>" +
        this.emailBody +
        "</div>";
    } else if (str2.includes("VEVENT")) {
      this.eventArr = this.scannedCode.trim().split(":");
      this.eventName = this.eventArr[2].slice(0, -12);
      this.eventDesc = this.eventArr[3].slice(0, -9);

      this.htmlVariable =
        "<div>" +
        this.eventName +
        "</div>" +
        "<div>" +
        this.eventDesc +
        "</div>";
    } else {
      this.htmlVariable = "<div>" + this.scannedCode + "</div>";
    }
  }
}

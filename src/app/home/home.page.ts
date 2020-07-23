import { Component } from "@angular/core";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { SMS } from "@ionic-native/sms/ngx";
import { WifiWizard2 } from "@ionic-native/wifi-wizard-2/ngx";
import { Calendar } from "@ionic-native/calendar/ngx";
import {
  Contacts,
  Contact,
  ContactField,
  ContactName,
} from "@ionic-native/contacts/ngx";

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
  eventLoc: any = "";
  eventStartArr: any = "";
  eventEndArr: any = "";
  eventSDate: any = "";
  eventEDate: any = "";
  eventSTime: any = "";
  eventETime: any = "";
  eventSY: any = "";
  eventSM: any = "";
  eventSD: any = "";
  eventEY: any = "";
  eventEM: any = "";
  eventED: any = "";
  eventSH: any = "";
  eventSMin: any = "";
  eventSS: any = "";
  eventEH: any = "";
  eventEMin: any = "";
  eventES: any = "";
  eventStart: any = "";
  eventEnd: any = "";
  VCD: any = "";
  ver: any = "";
  street: any = "";
  city: any = "";
  country: any = "";
  state: any = "";
  pincode: any = "";
  fullName: string = "";
  adr: string = "";
  tel: string = "";
  name: string = "";
  contactAdr: object;
  vCardDetected: boolean = false;
  vEventDetected: boolean = false;
  constructor(
    private barcodeScanner: BarcodeScanner,
    private callNumber: CallNumber,
    private sms: SMS,
    private wifiWizard: WifiWizard2,
    private calendar: Calendar,
    private contacts: Contacts
  ) {}

  private parse_vcard(input: string) {
    var Re1 = /^(version|fn|n|tel|title|organization|adr):(.+)$/i;
    var Re2 = /^([^:;]+);([^:]+):(.+)$/;
    var ReKey = /item\d{1,2}\./;
    var fields = {};

    input.split(/\r\n|\r|\n/).forEach(function (line) {
      var results, key;

      if (Re1.test(line)) {
        results = line.match(Re1);
        key = results[1].toLowerCase();
        fields[key] = results[2];
      } else if (Re2.test(line)) {
        results = line.match(Re2);
        key = results[1].replace(ReKey, "").toLowerCase();

        var meta = {};
        results[2]
          .split(";")
          .map(function (p, i) {
            var match = p.match(/([a-z]+)=(.*)/i);
            if (match) {
              return [match[1], match[2]];
            } else {
              return ["TYPE" + (i === 0 ? "" : i), p];
            }
          })
          .forEach(function (p) {
            meta[p[0]] = p[1];
          });

        if (!fields[key]) fields[key] = [];

        fields[key].push({
          meta: meta,
          value: results[3].split(";"),
        });
      }
    });

    return fields;
  }

  scanCode() {
    this.barcodeScanner.scan().then((barcodeData) => {
      this.scannedCode = barcodeData.text;
      this.checkForURL(this.scannedCode);
    });
  }
  ngAfterViewInit() {
    this.scanCode();
  }
  addContact() {
    this.VCD = this.parse_vcard(this.scannedCode);
    this.ver = this.VCD.version;
    this.adr = this.VCD.adr.trim().split(";");
    this.street = this.adr[2];
    this.city = this.adr[3];
    this.state = this.adr[4];
    this.pincode = this.adr[5];
    this.country = this.adr[6];
    this.adr =
      this.street +
      "," +
      this.city +
      "," +
      this.state +
      "," +
      this.pincode +
      "," +
      this.country;

    if (this.ver >= 2 && this.ver < 3) {
      this.fullName = this.VCD.fn;
      this.email = this.VCD.email[0].value;
      var addresses = [];
      addresses[0] = this.street;
      addresses[1].locality = this.city;
      addresses[2].region = this.state;
      addresses[3].postalCode = this.pincode;
      addresses[4].country = this.country;

      this.tel = this.VCD.tel[0].value;
      let contact: Contact = this.contacts.create();
      contact.name = new ContactName(null, this.fullName);
      contact.phoneNumbers = [
        new ContactField("mobile", this.tel.toString(), true),
      ];
      contact.emails = [new ContactField("home", this.email.toString(), true)];
      contact.addresses = addresses;
      contact.save().then(
        () => alert("Contact saved!"),
        (error: any) => alert("Error saving contact.")
      );
    } else if (this.ver >= 3) {
      this.fullName = this.VCD.n;
      this.email = this.VCD.email[0].value;
      this.tel = this.VCD.tel;
      let contact: Contact = this.contacts.create();
      contact.name = new ContactName(null, this.fullName);
      contact.phoneNumbers = [
        new ContactField("mobile", this.tel.toString(), true),
      ];
      contact.emails = [new ContactField("home", this.email.toString(), true)];
      contact.addresses = addresses;
      contact.save().then(
        () => alert("Contact saved!"),
        (error: any) => alert("Error saving contact.")
      );
    }
  }
  addToCal() {
    this.vEventDetected = true;
    this.eventArr = this.scannedCode.trim().split(":");
    this.eventName = this.eventArr[2].slice(0, -12);
    this.eventDesc = this.eventArr[3].slice(0, -9);
    this.eventLoc = this.eventArr[4].slice(0, -8);
    this.eventStartArr = this.eventArr[5].slice(0, -7);
    this.eventEndArr = this.eventArr[6].slice(0, -5);
    this.eventSDate = this.eventStartArr.trim().split("T")[0];
    this.eventEDate = this.eventEndArr.trim().split("T")[0];
    this.eventSTime = this.eventStartArr.trim().split("T")[1];
    this.eventETime = this.eventEndArr.trim().split("T")[1];
    this.eventSY = this.eventSDate.slice(0, -4);
    this.eventSM = this.eventSDate.slice(4, 6) - 1;
    this.eventSD = this.eventSDate.slice(6);
    this.eventEY = this.eventEDate.slice(0, -4);
    this.eventEM = this.eventEDate.slice(4, 6) - 1;
    this.eventED = this.eventEDate.slice(6);
    this.eventSH = this.eventSTime.slice(0, -4);
    this.eventSMin = this.eventSTime.slice(2, 4);
    this.eventSS = this.eventSTime.slice(4);
    this.eventEH = this.eventETime.slice(0, -4);
    this.eventEMin = this.eventETime.slice(2, 4);
    this.eventES = this.eventETime.slice(4);
    this.eventStart = new Date(
      this.eventSY,
      this.eventSM,
      this.eventSD,
      this.eventSH,
      this.eventSMin,
      this.eventSS
    ); // beware: month 0 = january, 11 = december
    this.eventEnd = new Date(
      this.eventEY,
      this.eventEM,
      this.eventED,
      this.eventEH,
      this.eventEMin,
      this.eventES
    );

    this.calendar
      .createEvent(
        this.eventName,
        this.eventLoc,
        this.eventDesc,
        this.eventStart,
        this.eventEnd
      )
      .then(
        () => alert("Event saved!"),
        (error: any) => console.error("Error saving event.", error)
      );
  }

  checkForURL(str2) {
    if (str2.includes("BEGIN:VCARD")) {
      this.VCD = this.parse_vcard(this.scannedCode);

      this.email = this.VCD.email[0].value;
      this.adr = this.VCD.adr.trim().split(";");
      this.street = this.adr[2];
      this.city = this.adr[3];
      this.state = this.adr[4];
      this.pincode = this.adr[5];
      this.country = this.adr[6];
      this.adr =
        this.street +
        "," +
        this.city +
        "," +
        this.state +
        "," +
        this.pincode +
        "," +
        this.country;
      this.vCardDetected = true;
      this.vEventDetected = false;
      if (str2.includes("VERSION:2")) {
        this.fullName = this.VCD.fn;
        this.tel = this.VCD.tel[0].value;
        this.htmlVariable =
          "<div>" +
          this.fullName +
          "</div>" +
          "<div>" +
          this.email +
          "</div>" +
          "<div>" +
          this.tel +
          "</div>" +
          "<div>" +
          this.adr +
          "</div>";
      } else if (str2.includes("VERSION:3")) {
        this.fullName = this.VCD.n;
        this.tel = this.VCD.tel;
        this.htmlVariable =
          "<div>" +
          this.fullName +
          "</div>" +
          "<div>" +
          this.email +
          "</div>" +
          "<div>" +
          this.tel +
          "</div>" +
          "<div>" +
          this.adr +
          "</div>";
      }

      //this.htmlVariable = "<div>" + JSON.stringify(this.VCD) + "</div>";
    } else if (str2.includes("tel:")) {
      //phone no.
      this.vCardDetected = false;
      this.vEventDetected = false;
      this.phone = this.scannedCode.slice(4);

      this.htmlVariable =
        "<a href=tel:" + this.phone + ">" + this.phone + "</a>";
      /* this.htmlVariable = "<div>" + this.phone + "</div>"
            this.callNumber.callNumber(this.phone, false);
    */
    } else if (str2.includes("SMSTO:") || str2.includes("smsto")) {
      //message
      this.vCardDetected = false;
      this.vEventDetected = false;
      if (str2.includes("smsto:+91") || str2.includes("SMSTO:+91")) {
        this.mphone = this.scannedCode.slice(6, 19);
        this.message = this.scannedCode.slice(20);
      } else {
        this.mphone = this.scannedCode.slice(6, 16);
        this.message = this.scannedCode.slice(17);
      }

      var options = { android: { intent: "INTENT" } };

      this.htmlVariable =
        "<a>" + this.mphone + "</a>" + "<div>" + this.message + "</div>";
      this.sms.send(this.mphone, this.message, options);
    } else if (str2.includes("WIFI")) {
      this.vEventDetected = false;
      this.vCardDetected = false;
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
      this.vCardDetected = false;
      this.vEventDetected = false;
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
      this.vCardDetected = false;
      this.vEventDetected = true;
      this.eventArr = this.scannedCode.trim().split(":");
      this.eventName = this.eventArr[2].slice(0, -12);
      this.eventDesc = this.eventArr[3].slice(0, -9);
      this.eventLoc = this.eventArr[4].slice(0, -8);
      this.eventStartArr = this.eventArr[5].slice(0, -7);
      this.eventEndArr = this.eventArr[6].slice(0, -5);
      this.eventSDate = this.eventStartArr.trim().split("T")[0];
      this.eventEDate = this.eventEndArr.trim().split("T")[0];
      this.eventSTime = this.eventStartArr.trim().split("T")[1];
      this.eventETime = this.eventEndArr.trim().split("T")[1];
      this.eventSY = this.eventSDate.slice(0, -4);
      this.eventSM = this.eventSDate.slice(4, 6) - 1;
      this.eventSD = this.eventSDate.slice(6);
      this.eventEY = this.eventEDate.slice(0, -4);
      this.eventEM = this.eventEDate.slice(4, 6) - 1;
      this.eventED = this.eventEDate.slice(6);
      this.eventSH = this.eventSTime.slice(0, -4);
      this.eventSMin = this.eventSTime.slice(2, 4);
      this.eventSS = this.eventSTime.slice(4);
      this.eventEH = this.eventETime.slice(0, -4);
      this.eventEMin = this.eventETime.slice(2, 4);
      this.eventES = this.eventETime.slice(4);
      this.eventStart = new Date(
        this.eventSY,
        this.eventSM,
        this.eventSD,
        this.eventSH,
        this.eventSMin,
        this.eventSS
      ); // beware: month 0 = january, 11 = december
      this.eventEnd = new Date(
        this.eventEY,
        this.eventEM,
        this.eventED,
        this.eventEH,
        this.eventEMin,
        this.eventES
      );

      this.htmlVariable =
        "<div>" +
        this.eventName +
        "</div>" +
        "<div>" +
        this.eventDesc +
        "</div>" +
        "<div>" +
        this.eventLoc +
        "</div>" +
        "<div>" +
        this.eventStart +
        "  To  " +
        this.eventEnd +
        "</div>";
    } else if (str2.includes("http") || str2.includes("www")) {
      this.vCardDetected = false;
      this.vEventDetected = false;
      this.htmlVariable =
        "<a href='" + this.scannedCode + "'>" + this.scannedCode + "</a>";
    } else {
      this.vCardDetected = false;
      this.vEventDetected = false;
      this.htmlVariable = "<div>" + this.scannedCode + "</div>";
    }
  }
}

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AlertController, ModalController } from 'ionic-angular';
import {ModalContentPage} from '../pages/products/product-modal';
import { PantryListService } from './pantry-list';
import {Item} from '../pages/products/item/item';
import { BarcodeScanner } from 'ionic-native';
import * as Enums from './ordering-helper';
import 'rxjs/add/operator/map';

@Injectable()
export class ProductHelper {

  isReverse: boolean;
  filter: Enums.Filter;
  sort: Enums.Sort;

  constructor(public http: Http, public alertCtrl: AlertController, public modalCtrl: ModalController, public pantryService: PantryListService) {
    //TODO: Save this as app config and load on start
    this.filter = Enums.Filter.All;
    this.sort = Enums.Sort.None;
  }

  public openManualSearch(): void {
    let prompt = this.alertCtrl.create({
      title: 'Manual Search',
      message: "Type in the name of the item or type of item you are looking for",
      inputs: [
        {
          name: 'name',
          placeholder: 'Product Name'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel manual search');
          }
        },
        {
          text: 'Search',
          handler: data => {
            this.pantryService.searchName(data.name).subscribe(js => {
              //Display modal so the user can picj between the results
              let modal = this.modalCtrl.create(ModalContentPage, { products: js.products });

              modal.onDidDismiss(data => {
                if (data) {
                  this.pantryService.getProductFromID(data.id).subscribe(js => {
                    this.pantryService.addItem(new Item(js));
                  },
                    error => {
                      console.log("Subscribing failed modal dismiss and get product info from id");
                    });
                }
              });

              modal.present();
            }, error => {
              console.log("Subscribing failed after manual search");
            });
          }
        }
      ]
    });
    prompt.present();
  }

  private upcSearchFail(): void {
    let prompt = this.alertCtrl.create({
      title: 'UPC Search Failed',
      message: "Could not find item from upc given. Would you like to search by typing in an item name?",
      buttons: [
        {
          text: 'No',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: data => {
            this.openManualSearch();
          }
        }
      ]
    });
    prompt.present();
  }

  public openBarcodeScanner(): void {
    BarcodeScanner.scan().then((barcodeData) => {
      this.pantryService.searchUPC(barcodeData.text).subscribe(js => {
        if (!(js.status && js.status == "failure"))
          this.pantryService.addItem(new Item(js, barcodeData.text));
      }, error => {
        console.log("Subscribing failed after barcode search");
      });
    }, (err) => {
      console.log('UPC Searching failed');
      this.upcSearchFail();
    });
  }

  public chooseSort(sort: Enums.Sort): void {
    this.sort = sort;
  }

  public displaySortAlert() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Sort Mode');

    for (let sort of Enums.Sort.SORTS) {
      alert.addInput({
        type: 'radio',
        label: sort.value,
        value: sort.value,
        checked: sort == this.sort
      });
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Save',
      handler: data => {
        //Set the sort
        this.sort = Enums.Sort.SORTS.find((curr) => {
          if (curr.value == data)
            return true;
          return false;
        });
      }
    });
    alert.present();
  }

  public chooseFilter(filter: Enums.Filter): void {
    this.filter = filter;
  }

  public displayFilterAlert() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Filter Mode');

    for (let filter of Enums.Filter.FILTERS) {
      alert.addInput({
        type: 'radio',
        label: filter.value,
        value: filter.value,
        checked: filter == this.filter
      });
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Save',
      handler: data => {
        //Set the sort
        this.filter = Enums.Filter.FILTERS.find((curr) => {
          if (curr.value == data)
            return true;
          return false;
        });
      }
    });
    alert.present();
  }

  public changeByOne(isSub: boolean, item: Item){
    if(isSub){
      this.pantryService.updateAmount(item, -1);
    }else{
      this.pantryService.updateAmount(item, 1);
    }
  }
}

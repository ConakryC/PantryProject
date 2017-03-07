import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AlertController, ModalController } from 'ionic-angular';
import {ModalContentPage} from '../pages/products/product-modal';
import { PantryListService } from './pantry-list';
import {Item} from '../pages/products/item/item';
import { BarcodeScanner } from 'ionic-native';
import * as Enums from './ordering-helper';
import 'rxjs/add/operator/map';

/*
* Service that provides all the front end utilities for the product page.
* This will display modals, alerts, and perform barcode scanning
*/
@Injectable()
export class ProductHelper {

  /*
  * Should the pantry list be reversed when displayed
  */
  isReverse: boolean;

  /*
  * What filter should be applied to the pantry list
  */
  filter: Enums.Filter;

  /*
  * What sorting mode should be applied to the pantry list
  */
  sort: Enums.Sort;

  constructor(public http: Http, public alertCtrl: AlertController, public modalCtrl: ModalController, public pantryService: PantryListService) {
    //TODO: Save this as app config and load on start
    this.filter = Enums.Filter.All;
    this.sort = Enums.Sort.None;
    this.isReverse = false;
  }

  /*
  * Opens a manual search alert that the user can use to add items from
  * the API's database
  */
  public openManualSearch(): void {
    //Create the alert to be displayed to the user
    let prompt = this.alertCtrl.create({
      title: 'Manual Search',
      message: "Type in the name of the item or type of item you are looking for",
      inputs: [
        {
          //The only input is the name we searching for
          name: 'name',
          placeholder: 'Product Name'
        },
      ],
      buttons: [
        {
          //We can cancel early
          text: 'Cancel',
          handler: data => {
            console.log('Cancel manual search');
          }
        },
        {
          //Search using the name above
          text: 'Search',
          handler: data => {
            //Use the pantry service to search for products using the supplied name
            this.pantryService.searchName(data.name).subscribe(js => {
              //Display modal so the user can pick between the results
              let modal = this.modalCtrl.create(ModalContentPage, { products: js.products });

              //When we dismiss the modal try and add the item
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

              //Show the modal
              modal.present();
            }, error => {
              console.log("Subscribing failed after manual search");
            });
          }
        }
      ]
    });

    //Show the alert
    prompt.present();
  }

  /*
  * This will be called if a UPC search failed. It will display an alert to ask the
  * user if they want to search manually instead. If they say yes then it opens manual search.
  */
  private upcSearchFail(): void {
    //Create alert
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
            //Open manual search
            this.openManualSearch();
          }
        }
      ]
    });

    //Show alert
    prompt.present();
  }

  /*
  * Opens the devices barcode scanner and adds the item if it exists
  * if not found then it informs the user
  */
  public openBarcodeScanner(): void {
    //Open Barcode Scanner
    BarcodeScanner.scan().then((barcodeData) => {
      //Use service to call API
      this.pantryService.searchUPC(barcodeData.text);
    }, (err) => {
      console.log('UPC Searching failed');
      //Does the user want to open manual search?
      this.upcSearchFail();
    });
  }

  /*
  * Set sort mode
  */
  public chooseSort(sort: Enums.Sort): void {
    this.sort = sort;
  }

  /*
  * Displays a sort alert where the user can pick the current sort that should be applied to the
  * pantry list.
  */
  public displaySortAlert() {
    //Create alert
    let alert = this.alertCtrl.create();
    alert.setTitle('Sort Mode');

    //Add radio inputs to alert
    for (let sort of Enums.Sort.SORTS) {
      alert.addInput({
        type: 'radio',
        label: sort.value,
        value: sort.value,
        checked: sort == this.sort
      });
    }

    alert.addButton('Cancel');
    //Setup save button
    alert.addButton({
      text: 'Save',
      handler: data => {
        //Set current sort
        this.sort = Enums.Sort.SORTS.find((curr) => {
          if (curr.value == data)
            return true;
          return false;
        });
      }
    });

    //Show alert
    alert.present();
  }

  /*
  * Set current filter
  */
  public chooseFilter(filter: Enums.Filter): void {
    this.filter = filter;
  }

  /*
  * Displays a filter alert where the user can pick the current filter that should be applied to the
  * pantry list.
  */
  public displayFilterAlert() {
    //Setup the alert
    let alert = this.alertCtrl.create();
    alert.setTitle('Filter Mode');

    //Add radio inputs to alert
    for (let filter of Enums.Filter.FILTERS) {
      alert.addInput({
        type: 'radio',
        label: filter.value,
        value: filter.value,
        checked: filter == this.filter
      });
    }

    alert.addButton('Cancel');
    //Setup save button
    alert.addButton({
      text: 'Save',
      handler: data => {
        //Set current filter
        this.filter = Enums.Filter.FILTERS.find((curr) => {
          if (curr.value == data)
            return true;
          return false;
        });
      }
    });

    //Show alert
    alert.present();
  }

  /*
  * Updates the amount of an item by one. This is used for the +,- buttons on the items
  */
  public changeByOne(isSub: boolean, item: Item) {
    if (isSub) {
      //Subtract one
      this.pantryService.updateAmount(item, -1);
    } else {
      //Add one
      this.pantryService.updateAmount(item, 1);
    }
  }
}

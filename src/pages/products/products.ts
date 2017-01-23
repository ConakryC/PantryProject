import { Component } from '@angular/core';
import { BarcodeScanner } from 'ionic-native';
import { NavController, AlertController, ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { PantryListService } from '../../providers/pantry-list';
import { Item } from './item/item';
import { ItemPage } from './item/item-page';

@Component({
    selector: 'page-products',
    templateUrl: 'products.html'
})


export class ProductsPage {
    private pantryList: Item[];

    constructor(public navCtrl: NavController, public pantryService: PantryListService, public alertCtrl: AlertController, public modalCtrl: ModalController) {
        //Initialize pantry list
        this.pantryList = [];
    }

    public openBarcodeScanner(): void {
        BarcodeScanner.scan().then((barcodeData) => {
            this.pantryService.searchUPC(barcodeData.text).subscribe(js => {
                this.pantryList.push(new Item(js, barcodeData.text));
            }, error => {
                console.log("Subscribing failed after barcode search");
            });
        }, (err) => {
            console.log('UPC Searching failed');
            this.upcSearchFail();
        });
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

    private openManualSearch(): void {
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
                                        this.pantryList.push(new Item(js));
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

    private itemSelected(item: Item): void {
        this.navCtrl.push(ItemPage, {item: item});
    }
}

@Component({
    template: `
<ion-header>
    <ion-toolbar>
        <ion-title>
            Manual Search
        </ion-title>
        <ion-buttons start>
            <button ion-button (click)="dismiss()">
                <span ion-text color="primary" showWhen="ios">Cancel</span>
                <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
            </button>
        </ion-buttons>
    </ion-toolbar>
</ion-header>
<ion-content padding>
    <p>Choose which one best suits your item</p>
    <ion-list>
        <button ion-item *ngFor="let item of products" (click)="dismiss(item)">
            <ion-thumbnail item-left>
                <img src="{{item.image}}">
            </ion-thumbnail>
            <h2>{{item.title}}</h2>
        </button>
    </ion-list>
</ion-content>
`
})
export class ModalContentPage {

    private products: any;

    constructor(public platform: Platform, public params: NavParams, public viewCtrl: ViewController) {
        this.products = this.params.get('products');
    }

    dismiss(item?: any) {
        this.viewCtrl.dismiss(item);
    }
}
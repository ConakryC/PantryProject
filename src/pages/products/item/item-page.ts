import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { Item } from './item';
import { PantryListService } from '../../../providers/pantry-list';

@Component({
    selector: 'page-item',
    templateUrl: 'item-page.html'
})
export class ItemPage {

    private item: Item;

    constructor(public navCtrl: NavController, public navParams: NavParams, public pantryService: PantryListService, public alertCtrl: AlertController) {
        this.item = this.navParams.get('item');

        console.log(this.item.info);
    }

    private changeAmount(): void {

        let prompt = this.alertCtrl.create({
            title: 'Enter New Amount',
            message: "Enter a new amount for the product...",
            inputs: [
                {
                    name: 'amount',
                    placeholder: 'New Amount',
                    type: 'number'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Save',
                    handler: data => {
                        this.item.amount = data.amount
                    }
                }
            ]
        });
        prompt.present();
    }
}
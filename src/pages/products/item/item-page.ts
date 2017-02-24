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

  /*
  * Toggles the current items favorite state
  */
  private toggleFavorite(): void {
    if (this.item.favorite) {
      this.pantryService.rmFavorite(this.item);
    } else {
      this.pantryService.addFavorite(this.item);
    }
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
            //Since the Item is passed to the item-page as json
            //it is not reflected by the database value so, we must
            //update both VALUES

            //May want to change this so we base the view off of the database
            this.item.amount = data.amount;
            this.pantryService.setAmount(this.item, data.amount);
          }
        }
      ]
    });

    prompt.present();
  }
}

import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { Item } from './item';
import { PantryListService } from '../../../providers/pantry-list';

@Component({
  selector: 'page-item',
  templateUrl: 'item-page.html'
})
export class ItemPage {

  /*
  * The current item being displayed
  */
  private item: Item;

  constructor(public navCtrl: NavController, public navParams: NavParams, public pantryService: PantryListService, public alertCtrl: AlertController) {
    //Grab from nav params
    this.item = this.navParams.get('item');

    console.log(this.item.info);
  }

  /*
  * Toggles the current items favorite state
  */
  private toggleFavorite(): void {
    if (this.item.favorite) {
      //Remove favorite
      this.pantryService.rmFavorite(this.item);
    } else {
      //Add favorite
      this.pantryService.addFavorite(this.item);
    }
  }

  /*
  * Change the current amount of the item. This appears in the form of an alert.
  */
  private changeAmount(): void {
    let prompt = this.alertCtrl.create({
      title: 'Enter New Amount',
      message: "Enter a new amount for the product...",
      inputs: [
        {
          //Input for new amount of the item
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

            //Update locaally
            this.item.amount = data.amount;
            //Update database
            this.pantryService.setAmount(this.item, data.amount);
          }
        }
      ]
    });

    //Show alert
    prompt.present();
  }
}

import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  template: `
<ion-header>
    <ion-toolbar>
        <ion-title color="primary">
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

  constructor(public params: NavParams, public viewCtrl: ViewController) {
    //Get product from params
    this.products = this.params.get('products');
  }

  dismiss(item?: any) {
    //Dismiss modal and send item back with it
    this.viewCtrl.dismiss(item);
  }
}

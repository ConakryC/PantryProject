import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Item } from './item';

@Component({
    selector: 'page-item',
    templateUrl: 'item-page.html'
})
export class ItemPage {

    private item: Item;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.item = this.navParams.get('item');
    }
}
import { Component } from '@angular/core';
import { NavParams, ViewController, PopoverController, ToastController } from 'ionic-angular';
import { ProductHelper } from '../../providers/product-helper';
import * as Enums from '../../providers/ordering-helper';
import { Item } from './item/item';

@Component({
  template: `
  <ion-content>
  <ion-item-group>
    <ion-item-divider color="light">Add Products</ion-item-divider>
    <button ion-item (click)="scanBarcode()"><ion-icon name="barcode" item-left></ion-icon>Scan Barcode</button>
    <button ion-item (click)="manualSearch()"><ion-icon name="hand" item-left></ion-icon>Manual Search</button>
    <button ion-item (click)="showRecentItems()"><ion-icon name="undo" item-left></ion-icon>Recent Items</button>
  </ion-item-group>
  <ion-item-group>
    <ion-item-divider color="light">Sort / Filter</ion-item-divider>
    <button ion-item (click)="chooseFilter()"><ion-icon name="funnel" item-left></ion-icon>Filter</button>
    <button ion-item (click)="chooseSort()"><ion-icon name="list" item-left></ion-icon>Sort</button>
    <button ion-item (click)="toggleOrder()"><ion-icon *ngIf="!productHelper.isReverse" name="arrow-round-down" item-left></ion-icon><ion-icon *ngIf="productHelper.isReverse" name="arrow-round-up" item-left></ion-icon>Change Order</button>
    <button ion-item (click)="clear()"><ion-icon name="trash" item-left></ion-icon>Clear Pantry</button>
  </ion-item-group>
</ion-content>
`
})
export class ProductPagePopover {

  event: any;

  constructor(public params: NavParams, public viewCtrl: ViewController, public productHelper: ProductHelper, public popoverCtrl: PopoverController, public toastCtrl: ToastController) {
    if (params.data)
      this.event = params.data;
  }

  public manualSearch(): void {
    this.productHelper.openManualSearch();
    this.dismiss();
  }

  public scanBarcode(): void {
    this.productHelper.openBarcodeScanner();
    this.dismiss();
  }

  public chooseFilter(): void {
    //Create popover
    let popover = this.popoverCtrl.create(ProductFilterPopover);
    //Present popover
    popover.present({
      ev: this.event
    });

    this.dismiss();
  }

  public chooseSort(): void {
    //Create popover
    let popover = this.popoverCtrl.create(ProductSortPopover);
    //Present popover
    popover.present({
      ev: this.event
    });

    this.dismiss();
  }

  public showRecentItems(): void {
    if (this.productHelper.pantryService.getRecent().length < 1) {
      let toast = this.toastCtrl.create({
        message: 'No recent items found',
        duration: 3000,
        position: 'middle'
      });
      toast.present();
    } else {
      //Create popover
      let popover = this.popoverCtrl.create(RecentItemsPopover);
      //Present popover
      popover.present({
        ev: this.event
      });
    }

    this.dismiss();
  }

  public toggleOrder(): void {
    //Toggle the isReverse from product helper
    this.productHelper.isReverse = !this.productHelper.isReverse;

    this.dismiss();
  }

  public dismiss(): void {
    this.viewCtrl.dismiss();
  }

  public clear(): void {
    this.productHelper.pantryService.clearPantry();
    this.dismiss();
  }
}

@Component({
  template: `
  <ion-list radio-group>
    <ion-list-header color="light">
    Sorts
    </ion-list-header>
    <ion-item *ngFor="let sort of sortingArray">
        <ion-label>{{sort.value}}</ion-label>
        <ion-radio checked="{{sort == productHelper.sort}}" value="{{sort.value}}" (ionSelect)="chooseSort(sort)"></ion-radio>
    </ion-item>
</ion-list>
`
})
export class ProductSortPopover {

  constructor(public params: NavParams, public viewCtrl: ViewController, public productHelper: ProductHelper) {
  }

  public chooseSort(sort: Enums.Sort): void {
    this.productHelper.chooseSort(sort);
    this.viewCtrl.dismiss();
  }

  /**
  * A workaround so that we can access the static variable in the template
  **/
  get sortingArray() {
    return Enums.Sort.SORTS;
  }
}

@Component({
  template: `
  <ion-list radio-group>
    <ion-list-header color="light">
    Filters
    </ion-list-header>
    <ion-item *ngFor="let filter of filterArray">
        <ion-label>{{filter.value}}</ion-label>
        <ion-radio checked="{{filter == productHelper.filter}}" value="{{filter.value}}" (ionSelect)="chooseFilter(filter)"></ion-radio>
    </ion-item>
</ion-list>
`
})
export class ProductFilterPopover {

  constructor(public params: NavParams, public viewCtrl: ViewController, public productHelper: ProductHelper) {
  }

  public chooseFilter(filter: Enums.Filter): void {
    this.productHelper.chooseFilter(filter);
    this.viewCtrl.dismiss();
  }

  /**
  * A workaround so that we can access the static variable in the template
  **/
  get filterArray() {
    return Enums.Filter.FILTERS;
  }
}

@Component({
  template: `
  <ion-list radio-group>
    <ion-list-header color="light">
    Recent Items
    </ion-list-header>
    <ion-list>
      <button ion-item *ngFor="let itm of productHelper.pantryService.getRecent()" (click)="update(itm, productHelper.pantryService.getRecent().length <= 1)">
          <ion-thumbnail item-left>
            <img src={{itm.info.images[0]}}>
          </ion-thumbnail>
          <h2>{{itm.info.title}}</h2>
          <ion-icon *ngIf="itm.favorite" name="star" item-right color="bright"></ion-icon>
          <ion-icon *ngIf="!itm.favorite" name="star-outline" item-right color="bright"></ion-icon>
      </button>
    </ion-list>
</ion-list>
`
})
export class RecentItemsPopover {

  constructor(public params: NavParams, public viewCtrl: ViewController, public productHelper: ProductHelper) {
  }

  public update(item: Item, lastItem?: boolean): void {
    this.productHelper.changeByOne(false, item);
    if (lastItem) {
      this.dismiss();
    }
  }

  public dismiss(): void {
    this.viewCtrl.dismiss();
  }
}

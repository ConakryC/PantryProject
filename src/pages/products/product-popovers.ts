import { Component } from '@angular/core';
import { NavParams, ViewController, PopoverController } from 'ionic-angular';
import { ProductHelper } from '../../providers/product-helper';
import * as Enums from '../../providers/ordering-helper';
import { PantryListService } from '../../providers/pantry-list'

@Component({
  template: `
  <ion-content>
  <ion-item-group>
    <ion-item-divider color="light">Add Products</ion-item-divider>
    <button ion-item (click)="scanBarcode()"><ion-icon name="barcode" item-left></ion-icon>Scan Barcode</button>
    <button ion-item (click)="manualSearch()"><ion-icon name="hand" item-left></ion-icon>Manual Search</button>
    <button ion-item (click)="dismiss()"><ion-icon name="undo" item-left></ion-icon>Recent Items</button>
  </ion-item-group>
  <ion-item-group>
    <ion-item-divider color="light">Sort / Filter</ion-item-divider>
    <button ion-item (click)="chooseFilter()"><ion-icon name="funnel" item-left></ion-icon>Filter</button>
    <button ion-item (click)="chooseSort()"><ion-icon name="list" item-left></ion-icon>Sort</button>
    <button ion-item (click)="dismiss()"><ion-icon *ngIf="!productHelper.isReverse" name="arrow-round-down" item-left></ion-icon><ion-icon *ngIf="productHelper.isReverse" name="arrow-round-up" item-left></ion-icon>Change Order</button>
    <button ion-item (click)="clear()"><ion-icon name="trash" item-left></ion-icon>Clear Pantry</button>
  </ion-item-group>
</ion-content>
`
})
export class ProductPagePopover {

  event: any;

  constructor(public params: NavParams, public viewCtrl: ViewController, public productHelper: ProductHelper, public popoverCtrl: PopoverController, public pService: PantryListService) {
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

  public dismiss(): void {
    this.viewCtrl.dismiss();
  }

  public clear(): void {
    this.pService.clearPantry();
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

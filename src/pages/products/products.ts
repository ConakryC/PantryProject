import { Component, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { BarcodeScanner } from 'ionic-native';
import { NavController, AlertController, PopoverController, ModalController, NavParams, ViewController, FabContainer, Content } from 'ionic-angular';
import { ProductHelper } from '../../providers/product-helper';
import { PantryListService } from '../../providers/pantry-list';
import { Item } from './item/item';
import { ItemPage } from './item/item-page';
import { ProductPagePopover } from './product-popovers';

@Component({
  selector: 'page-products',
  templateUrl: 'products.html'
})
export class ProductsPage {

  showFAB: boolean;

  @Input() recentDetections: Array<any>;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, private changeDetectorRef: ChangeDetectorRef, public popoverCtrl: PopoverController, public productHelper: ProductHelper) {
    this.showFAB = true;
  }

  ngAfterViewInit() {
    this.content.ionScroll.subscribe((data) => {
      if (data.directionY == "down") {
        this.showFAB = false;
      } else {
        this.showFAB = true;
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  public showPopover(event) {
    //Create popover
    let popover = this.popoverCtrl.create(ProductPagePopover, event);
    //Present popover
    popover.present({
      ev: event
    });
  }

  public manualSearch(fab?: FabContainer): void {
    this.productHelper.openManualSearch();
    this.closeFAB(fab);
  }

  public scanBarcode(fab?: FabContainer): void {
    this.productHelper.openBarcodeScanner();
    this.closeFAB(fab);
  }

  public chooseFilter(fab?: FabContainer): void {
    this.productHelper.displayFilterAlert();
    this.closeFAB(fab);
  }

  public chooseSort(fab?: FabContainer): void {
    this.productHelper.displaySortAlert();
    this.closeFAB(fab);
  }

  private closeFAB(fab?: FabContainer) {
    if (fab)
      fab.close();
  }

  public changeByOne(isSub: boolean, item: Item, event: Event){
      //Stop the button from calling the outer button
      event.stopPropagation();

      this.productHelper.changeByOne(isSub, item);
  }

  /*
  * This toggles an items favorite state
  * @param item is the item to toggle
  * @param event is the click event that happened when this method was called
  */
  public toggleFavorite(item: Item, event: Event){
      //Stop the button from calling the outer button
      event.stopPropagation();

      //Toggle favorite for the item
      if (item.favorite) {
        this.productHelper.pantryService.rmFavorite(item);
      } else {
        this.productHelper.pantryService.addFavorite(item);
      }
  }

  private itemSelected(item: Item): void {
    this.navCtrl.push(ItemPage, { item: item });
  }
}

import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Item } from '../pages/products/item/item';
import { Platform, ToastController } from 'ionic-angular';
import { SQLite } from 'ionic-native';
import * as Enums from './ordering-helper';

/*
* Service that provides many backend utilities for handling the pantry list
* this includes database, pantry items, favorites, api calls, and more
*/
@Injectable()
export class PantryListService {

  /**
   This is the list that returns items that are still in the database
   but, have amounts of 0
   **/
  public recentList: Item[];

  /**
   The complete list of all items the user has. There is no
   guaranteed order of any kind on this list
   **/
  public pantryList: Item[];
  private db: SQLite;
  private headers: Headers;
  private opt: RequestOptions;

  constructor(public http: Http, private platform: Platform, public toastCtrl: ToastController) {
    //When constructed we get the database ready
    this.platform.ready().then(() => {
      this.db = new SQLite();
      this.db.openDatabase({ name: 'pantry.db', location: 'default' }).then(() => {
        this.load();
      }, (err) => {
        console.error('Database Error: ', err);
      });
    });

    //Initialize pantry list
    this.pantryList = [];
    this.recentList = [];

    //Setup the headers we use for the API calls
    this.headers = new Headers();
    this.headers.append('X-Mashape-Key', 'FBiqUe796amshHCRsuDjukypRhO4p1C7p0FjsnURXVaA5HhxLS');
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json ');

    //Add header options
    this.opt = new RequestOptions({
      headers: this.headers
    });
  }

  /*
  * This method returns a list of sorted, filtered, and ordered items
  * This uses the pantry list
  */
  public getDisplayList(filter?: Enums.Filter, sort?: Enums.Sort, isReverse?: boolean): Item[] {
    //Is reverse determines if the list should be flipped
    if (isReverse) {
      return this.getOrderedList(filter, sort).reverse();
    } else {
      return this.getOrderedList(filter, sort);
    }
  }

  /*
  * This returns a filtered and sorted list uses the supplied filter and sort mode.
  * we filter first so we don't have to sort extra items
  */
  public getOrderedList(filter?: Enums.Filter, sort?: Enums.Sort): Item[] {
    //TODO: Probably do some caching here for performance
    let sortedItems = [];

    //For all items in the pantry list
    for (let itm of this.pantryList) {
      //First make sure the item is valid
      if (itm) {
        //Apply filters
        if (filter) {
          switch (filter) {
            case Enums.Filter.Gluten_Free:
              //Check for gluten free
              if (itm.info.badges && itm.info.badges.indexOf('gluten_free') > -1) {
                sortedItems.push(itm);
              }
              break;
            case Enums.Filter.Favorite:
              //Check if favorite
              if (itm.favorite) {
                sortedItems.push(itm);
              }
              break;
            case Enums.Filter.Not_Favorite:
              //Check if not favorite
              if (!itm.favorite) {
                sortedItems.push(itm);
              }
              break;
            case Enums.Filter.Dairy_Free:
              //Check for dairy free
              if (itm.info.badges && itm.info.badges.indexOf('dairy_free') > -1) {
                sortedItems.push(itm);
              }
              break;
            case Enums.Filter.Peanut_Free:
              //Check for peanut free
              if (itm.info.badges && itm.info.badges.indexOf('peanut_free') > -1) {
                sortedItems.push(itm);
              }
              break;
            default:
              //Don't mess with the array if not one of the above filters
              //Ex. ALL filter
              sortedItems.push(itm);

              break;
          }
        }
      }
    }

    //Apply sorting
    if (sort) {
      switch (sort) {
        case Enums.Sort.Alphabetical:
          return sortedItems.sort((itemA: Item, itemB: Item) => {
            if (itemA.info.title < itemB.info.title)
              return -1;
            else if (itemA.info.title > itemB.info.title)
              return 1;
            return 0;
          });
        case Enums.Sort.Amount:
          return sortedItems.sort((itemA: Item, itemB: Item) => {
            if (itemA.amount > itemB.amount)
              return -1;
            else if (itemA.amount < itemB.amount)
              return 1;
            return 0;
          });
        case Enums.Sort.Price:
          return sortedItems.sort((itemA: Item, itemB: Item) => {
            if (itemA.info.price < itemB.info.price)
              return -1;
            else if (itemA.info.price > itemB.info.price)
              return 1;
            return 0;
          });
        case Enums.Sort.Score:
          return sortedItems.sort((itemA: Item, itemB: Item) => {
            if (itemA.info.spoonacular_score < itemB.info.spoonacular_score)
              return -1;
            else if (itemA.info.spoonacular_score > itemB.info.spoonacular_score)
              return 1;
            return 0;
          });
        case Enums.Sort.Favorite:
          return sortedItems.sort((itemA: Item, itemB: Item) => {
            return (itemA.favorite === itemB.favorite) ? 0 : itemA.favorite ? -1 : 1;
          });
        default:
          //Don't mess with the array if not one of the above sorts
          //Ex. NONE sort
          break;
      }
    }

    //Return the list once finished
    return sortedItems;
  }

  /**
   * Search for a Item using its UPC code
   */
  public searchUPC(upc: string) {
    this.db.executeSql('SELECT * FROM pantry WHERE upc = ? LIMIT 1', [upc]).then((data) => {
      //Check if UPC is found in database first
      if (data.rows.length > 0) {
        console.log('In DB');
        //Increment that specific value
        this.updateAmountByUPC(upc, 1);
      } else {
        console.log("Using API call");
        //If not in database perform a API call to match UPC
        this.http.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/products/upc/" + upc, this.opt).map(res => res.json()).subscribe(js => {
          //Make sure the API call didn't fail
          if (!(js.status && js.status == "failure")) {
            //If not add the item
            this.addItem(new Item(js, upc));
          }
          else {
            //Display a message that we couldn't find the UPC in the database
            let toast = this.toastCtrl.create({
              message: 'UPC was not found: ' + upc,
              duration: 3000,
              position: 'middle'
            });
            toast.present();
          }
        }, error => {
          console.log("Subscribing failed after barcode search");
        });
      }
    }, (err) => {
      console.error('UPC check error: ', JSON.stringify(err));
    });
  }

  /*
  * Call the API and search for products based on a name
  */
  public searchName(name: string): Observable<any> {
    return this.http.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/products/search?query=" + name, this.opt).map(res => res.json());
  }

  /*
  * Call the API can search for a product based on an API id
  */
  public getProductFromID(id: number): Observable<any> {
    return this.http.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/products/" + id, this.opt).map(res => res.json());
  }

  /*
  * Adds an item to the database
  */
  public add(addItem: Item) {
    //Execute query
    this.db.executeSql('INSERT INTO pantry (upc, spoon_id, amount, add_date, info) VALUES (?,?,?,?,?)',
      [addItem.upc, addItem.info.id, addItem.amount, new Date().getMilliseconds(), JSON.stringify(addItem.info)]).then((data) => {
        console.log('Inserted: ', JSON.stringify(data));
      }, (err) => {
        console.error('DB insert error: ', JSON.stringify(err));
      });
    //Reload the database
    this.load();
  }

  /*
  * Reloads the database. This refreshes both the pantry list and recent list
  */
  public load() {
    //Pantry list
    this.db.executeSql('SELECT * FROM pantry WHERE amount > 0', []).then((data) => {
      this.pantryList = [];
      if (data.rows.length > 0) {
        //For everything returned
        for (let i = 0; i < data.rows.length; i++) {
          //Add an item to the pantry list
          this.pantryList.push(new Item(JSON.parse(data.rows.item(i).info), data.rows.item(i).upc,
            data.rows.item(i).amount, data.rows.item(i).id, data.rows.item(i).is_fav));
        }
      }
    }, (err) => {
      console.error('DB load error: ', JSON.stringify(err))
    });

    //Recent list
    this.db.executeSql('SELECT * FROM pantry WHERE amount = 0', []).then((data) => {
      this.recentList = [];
      if (data.rows.length > 0) {
        //For everything returned
        for (let i = 0; i < data.rows.length; i++) {
          //Add an item to the recent list
          this.recentList.push(new Item(JSON.parse(data.rows.item(i).info), data.rows.item(i).upc,
            data.rows.item(i).amount, data.rows.item(i).id, data.rows.item(i).is_fav));
        }
      }
    }, (err) => {
      console.error('recent load error: ', JSON.stringify(err))
    });
  }

  /*
  * This checks if the item is already in the database if so then update the amount otherwise
  * add the item to the database.
  */
  public addItem(itemToAdd: Item): void {
    //TODO: Testing purposes, don't forget to remove
    //this.pantryList.push(itemToAdd);

    //Perform the check to see if the item exists in the database
    this.db.executeSql('SELECT * FROM pantry WHERE spoon_id = ? LIMIT 1', [itemToAdd.info.id]).then((data) => {
      //If we found something
      if (data.rows.length > 0) {
        console.log('In DB');
        //Then update the amount in the database
        this.updateAmount(new Item(JSON.parse(data.rows.item(0).info), data.rows.item(0).upc,
          data.rows.item(0).amount, data.rows.item(0).id), 1);
      }
      else {
        //Otherwise add the item to the database
        this.add(itemToAdd);
      }
    }, (err) => {
      console.error('item check error: ', JSON.stringify(err));
    });
  }

  /*
  *
  */
  public setAmount(item: Item, amt: number) {
    this.db.executeSql('UPDATE pantry SET amount = ? WHERE id = ?', [amt, item.id]).then((data) => {
      console.log('Updated item amount ', JSON.stringify(data));
      this.load();
    }, (err) => {
      console.error('Amount update error: ', JSON.stringify(err));
    });
  }

  /*
  * This will update an amount on an item in the database by it's UPC
  */
  public updateAmountByUPC(upc: string, dif: number) {
    //Update the items amount
    this.db.executeSql('UPDATE pantry SET amount = amount + ? WHERE upc = ?', [dif, upc]).then((data) => {
      console.log('Updated item amount ', JSON.stringify(data));
      //Reload
      this.load();
    }, (err) => {
      console.error('Amount update error: ', JSON.stringify(err));
    });
  }

  /*
  * This will update an items amount in the database using the item itself
  */
  public updateAmount(item: Item, dif: number) {
    //Update the items amount
    this.db.executeSql('UPDATE pantry SET amount = ? WHERE id = ?', [item.amount + dif, item.id]).then((data) => {
      console.log('Updated item amount ', JSON.stringify(data));
      //Reload
      this.load();
    }, (err) => {
      console.error('Amount update error: ', JSON.stringify(err));
    });
  }

  /*
  * This will clear the pantry by setting each item in the pantry list's amount to 0
  */
  public clearPantry() {
    for (let i = 0; i < this.pantryList.length; i++) {
      //Set amount to 0
      this.setAmount(this.pantryList[i], 0);
    }
    //Reload
    this.load();
  }

  /*
  * This performs a garbage collection on the pantry list database.
  * If an item has less than 0 as an amount and is a month old then remove it from the
  * database
  */
  public gCollect() {
    //Setup the date to be a month old
    let d = new Date();
    d.setMonth(d.getMonth() - 1);
    //Delete all entries that are old enough
    this.db.executeSql('DELETE FROM pantry WHERE add_date < ? AND amount < ?', [d.getMilliseconds(), 1]).then((data) => {
      console.log('Deleting outdated items: ', JSON.stringify(data));
    }, (err) => {
      console.error('Database cleanup error: ', JSON.stringify(err));
    });
  }

  /*
  * This sets an item as a favorite
  */
  public addFavorite(item: Item) {
    //Set directly to inform item page
    item.favorite = true;
    //Set favorite on the database
    this.db.executeSql('UPDATE pantry SET is_fav = ? WHERE id = ?', [1, item.id]).then((data) => {
      console.log('Add favorite: ', JSON.stringify(data));
      //Reload
      this.load();
    }, (err) => {
      console.error('Add favorite error: ', JSON.stringify(err));
    });
  }

  /*
  * This removes favorite from an item
  */
  public rmFavorite(item: Item) {
    //Remove directly to inform item page
    item.favorite = false;
    //Remove favorite on the database
    this.db.executeSql('UPDATE pantry SET is_fav = ? WHERE id = ?', [0, item.id]).then((data) => {
      console.log('Remove favorite: ', JSON.stringify(data));
      //Reload
      this.load();
    }, (err) => {
      console.error('Remove favorite error: ', JSON.stringify(err));
    });
  }

  /*
  * Getter for the recent list
  */
  public getRecent() {
    return this.recentList;
  }

  /*
  * Getter for the pantry list
  */
  public getPantryItems() {
    return this.pantryList;
  }
}

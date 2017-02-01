import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Item} from '../pages/products/item/item';
import { Platform } from 'ionic-angular';
import { SQLite } from 'ionic-native';

@Injectable()
export class PantryListService {

    public pantryList: Item[];
    private db: SQLite;
    private headers: Headers;
    private opt: RequestOptions;

    constructor(public http: Http, private platform: Platform) {
        this.platform.ready().then(() => {
          this.db = new SQLite();
          this.db.openDatabase({name: 'pantry.db', location: 'default'}).then(() => {
              this.load();
          }, (err) => {
              console.error('Database Error: ', err);
          });
        });

        //Initialize pantry list
        this.pantryList = [];

        this.headers = new Headers();
        this.headers.append('X-Mashape-Key', 'FBiqUe796amshHCRsuDjukypRhO4p1C7p0FjsnURXVaA5HhxLS');
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json ');

        this.opt = new RequestOptions({
            headers: this.headers
        });
    }

    /**
     * Search for a Item using its UPC code
     * This returns an observable that needs to be dealt with
     * @param upc
     */
    searchUPC(upc: string): Observable<any> {
      return this.http.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/products/upc/" + upc, this.opt).map(res => res.json());
    }

    searchName(name: string): Observable<any> {
        return this.http.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/products/search?query=" + name, this.opt).map(res => res.json());
    }

    getProductFromID(id: number): Observable<any> {
        return this.http.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/products/" + id, this.opt).map(res => res.json());
    }

    add(addItem: Item) {
        this.db.executeSql('INSERT INTO pantry (upc, spoon_id, amount, add_date, info) VALUES (?,?,?,?,?)',
          [addItem.upc, addItem.info.id, addItem.amount, '2017-01-01', JSON.stringify(addItem.info)]).then((data) => {
            console.log('Inserted: ', JSON.stringify(data));
        }, (err) => {
            console.error('DB insert error: ', JSON.stringify(err));
        });
        this.load();
    }

    load() {
        this.db.executeSql('SELECT * FROM pantry WHERE amount > 0', []).then((data) => {
            //console.log('Selected: ', JSON.stringify(data));
            //console.log(data.rows.item(0));
            this.pantryList = [];
            if (data.rows.length > 0) {
                for (let i = 0; i < data.rows.length; i++) {
                    this.pantryList.push(new Item(JSON.parse(data.rows.item(i).info), data.rows.item(i).upc,
                                                              data.rows.item(i).amount, data.rows.item(i).id));
                }
            }
        }, (err) => {
            console.error('DB load error: ', JSON.stringify(err))
        });
    }

    public addItem(itemToAdd: Item): void {
      this.db.executeSql('SELECT * FROM pantry WHERE spoon_id = ? LIMIT 1', [itemToAdd.info.id]).then((data) => {
        if (data.rows.length > 0) {
          console.log('In DB');
          this.updateAmount(itemToAdd, 1);
        }
        else {
          this.add(itemToAdd);
        }
      }, (err) => {
        console.error('item check error: ', JSON.stringify(err));
      });
    }

  // checkUPC(upc: string): any {
  //
  //   this.db.executeSql('SELECT * FROM pantry WHERE upc = ? LIMIT 1', [upc]).then((data) => {
  //     if (data.rows.length > 0) {
  //       console.log('In DB');
  //       new Item(JSON.parse(data.rows.item(0).info), data.rows.item(0).upc,
  //         data.rows.item(0).amount, data.rows.item(0).id);
  //     }
  //     else {
  //       new Item(0);
  //     }
  //   }, (err) => {
  //     console.error('UPC check error: ', JSON.stringify(err));
  //   });
  // }

  // checkItem(item: Item): any {
  //
  //   this.db.executeSql('SELECT * FROM pantry WHERE spoon_id = ? LIMIT 1', [item.info.id]).then((data) => {
  //     if (data.rows.length > 0) {
  //       console.log('In DB');
  //     }
  //     else {
  //       return new Item(0);
  //     }
  //   }, (err) => {
  //     console.error('item check error: ', JSON.stringify(err));
  //   });
  // }

  setAmount(item: Item, amt: number) {
    this.db.executeSql('UPDATE pantry SET amount = ? WHERE id = ?', [amt, item.id]).then((data) => {
      console.log('Updated item amount ', JSON.stringify(data));
      this.load();
    }, (err) => {
      console.error('Amount update error: ', JSON.stringify(err));
    });
  }

  updateAmount(item: Item, dif: number) {
    this.db.executeSql('UPDATE pantry SET amount = ? WHERE id = ?', [item.amount + dif, item.id]).then((data) => {
      console.log('Updated item amount ', JSON.stringify(data));
      this.load();
    }, (err) => {
      console.error('Amount update error: ', JSON.stringify(err));
    });
  }
}

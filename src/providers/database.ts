import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Platform } from 'ionic-angular';
import { SQLite } from 'ionic-native';
import { Item } from '../pages/products/item/item';

@Injectable()
export class DatabaseService {

  private db: SQLite;

  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      this.db = new SQLite();
      this.db.openDatabase({name: 'pantry.db', location: 'default'}).then(() => {
        console.log('DB opened by dbservice');
      }, (err) => {
        console.error('Database Error: ', err);
      });
    });
  }
}

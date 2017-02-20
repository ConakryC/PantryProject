import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, SQLite } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';
import { PantryListService } from '../providers/pantry-list';
import { InAppBrowser } from 'ionic-native';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform, plService: PantryListService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      let db = new SQLite();
      db.openDatabase({
        name: 'pantry.db',
        location: 'default'
      }).then(() => {
        db.executeSql('CREATE TABLE IF NOT EXISTS pantry (id INTEGER PRIMARY KEY AUTOINCREMENT,' +
                                                          'upc INTEGER,' +
                                                          'spoon_id INTEGER,' +
                                                          'amount INTEGER,' +
                                                          'add_date INTEGER,' +
                                                          'info TEXT,' +
                                                          'is_fav INTEGER DEFAULT 0)', {}).then((data) => {
          console.log('Table created: ', data);
        }, (err) => {
          console.error('Unable to execute sql: ', err);
        });
      }, (err) => {
        console.error('Unable to open database: ', err);
      });
      plService.gCollect();
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}

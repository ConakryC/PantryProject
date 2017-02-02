import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Data } from '../../../providers/data';
import { Platform } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

@Component({
  selector: 'recipe-details',
  templateUrl: 'recipe-details.html'
})
export class RecipeDetails {
  recipeData: any;
  recipeId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private data: Data, public platform: Platform) {
    this.recipeId = navParams.get('recipeId');
    this.data.recipeID(this.recipeId).subscribe(recipeData => {
      console.log(recipeData)
      this.recipeData = recipeData;
   })

   this.platform = platform;
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad RecipeDetailsPage');
  }

  launchUrl(url: string) {
    this.platform.ready().then(() => {
      let ref = new InAppBrowser(url, '_blank');
      console.log('InAppBrowser opened');
    }, error => {
         console.log('Browser opening failed.');
    });
  }

}
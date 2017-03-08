/**
 * recipes-details.ts
 * Created: 2/1/17
 * Author: Bryan Martinez (mbryan93@live.com)
 * 
 * Edited: 3/1/17 By: Bryan Martinez
 * 
 * This page receives a recipe id from recipes.ts and displays the recipe information
 * in a seperate page.
 */
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RecipeListService } from '../../../providers/recipe-list';
import { Platform } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

@Component({
  selector: 'recipe-details',
  templateUrl: 'recipe-details.html'
})
export class RecipeDetails {
  recipeData: any; //Specific data from recipe, mainly for directions
  recipeId: string;
  instructions: any;//Individual object a steps array
  steps: any[] = []; //Store specific step info for analyzed instructions

  constructor(public navCtrl: NavController, public navParams: NavParams, private recipeService: RecipeListService, public platform: Platform) {
    this.recipeId = navParams.get('recipeId'); //Get recipe id from calling page (recipes.ts)
    this.recipeService.recipeID(this.recipeId).subscribe(recipeData => {
      console.log(recipeData)
      if (recipeData.instructions != null) {
        this.instructions = recipeData.analyzedInstructions[0];
        this.steps = this.instructions.steps;
      }

      console.log(this.instructions);
      this.recipeData = recipeData;
   })

   this.platform = platform;
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad RecipeDetailsPage');
  }

  /**
   * Launches the recipe url using inAppBrowser if the recipe is not in api
   * @param {string} url string of url to be opened
   */
  launchUrl(url: string) {
    //Check if ios, if so the inAppBrowser can only open in System browser
    this.platform.ready().then(() => {
      if (this.platform.is('ios')) {
        let ref = new InAppBrowser(url, '_system');
      }
      else {
        let ref = new InAppBrowser(url, '_blank');
      }
      
      console.log('InAppBrowser opened');
    }, error => {
         console.log('Browser opening failed.');
    });
  }

}
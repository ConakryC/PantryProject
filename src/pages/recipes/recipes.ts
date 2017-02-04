import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GeneratedRecipesPage } from '../recipes/generated-recipes/generated-recipes';
import { Search } from '../../providers/search';
import { Recipe } from '../../models/recipe';

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html'
})
export class RecipesPage {

  numRecipes = '5';
  public keywords; //data binding variable for input label
  recipes: Recipe[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public search: Search) {
    
  }
  /**
   * This is the basic recipe generator from pantry items.
   * In html file "check" will be 0 and checked in recipe-from-products
   */
  generateRecipes(check: number) {
    this.navCtrl.push(GeneratedRecipesPage, {
      check: check
    })
  }

  /**
   * This will allow for recipe searching by keyword.
   * A 1 will be passed as "check" to recipe-from-products
   */
  searchRecipes(check: number, keywords: string) {
      console.log("Succesful button press");
      console.log("Text in text area is: " + this.keywords)

    this.navCtrl.push(GeneratedRecipesPage, {
      check: check,
      keywords: keywords
    })
  }

}

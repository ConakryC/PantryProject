import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RecipeDetails } from '../../../pages/recipes/recipe-details/recipe-details';
import { Search } from '../../../providers/search';
import { Recipe } from '../../../models/recipe';
import { RecipeData } from '../../../models/recipe-data';

@Component({
  selector: 'page-recipes-from-products',
  templateUrl: 'recipes-from-products.html'
})
export class RecipesFromProductsPage {

  recipes: Recipe[];
  items: string;
  sort: string;
  numItems: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private search: Search) {
    this.getDefaults();
    this.getProductRecipes();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecipeFromProductsPage');
  }

  
  getDefaults() {
    this.items = "ground beef, Dreamfields Pasta - Spaghetti, canned corn, green beans";
    this.numItems = "5";
    this.sort = "1";
  }

  getProductRecipes() {
    this.search.recipeByIngredients(this.items, this.numItems, this.sort).subscribe(recipes => {
      console.log(recipes)
      this.recipes = recipes;
    })
  }

  viewRecipeData(recipeId: string) {
    this.navCtrl.push(RecipeDetails, {
      recipeId: recipeId
    })
  }

}

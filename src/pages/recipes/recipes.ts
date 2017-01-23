import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RecipeDetails } from '../../pages/recipe-details/recipe-details';
import { Search } from '../../providers/search';
import { Recipe } from '../../models/recipe';
import { RecipeData } from '../../models/recipe-data';

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html'
})
export class RecipesPage {

  recipes: Recipe[];
  items: string;
  sort: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private search: Search) {
    this.getDefaults();
    this.getProductRecipes();
  }

  getDefaults() {
    this.items = "chicken, Dreamfields Pasta - Spaghetti";
    this.sort = "1";
  }

  getProductRecipes() {
    this.search.recipeByIngredients(this.items, this.sort).subscribe(recipes => {
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

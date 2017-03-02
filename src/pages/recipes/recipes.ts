/**
 * recipes.ts
 * Created: 2/1/17
 * Author: Bryan Martinez (mbryan93@live.com)
 * 
 * Edited: 3/1/17 By: Bryan Martinez
 * 
 * This page holds the information that will be displayed on the recipes tab.
 */
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GeneratedRecipesPage } from '../recipes/generated-recipes/generated-recipes';
import { RecipeListService } from '../../providers/recipe-list';
import { RecipeDetails } from '../../pages/recipes/recipe-details/recipe-details';

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html'
})
export class RecipesPage {

  recipes: any[] = [];//Simple recipe info for display
  numRecipes: number = 0;//To display "No recipes found"
  //These need to be strings because provider adds them to string
  items: string; //Should be updated whenever pantry list is changed
  sort: string;
  numItems: string;
  check: number;
  searchKeys: string;
  //Required to concatenate image url to keyword recipe search results
  public baseImageUrl = "https://spoonacular.com/recipeImages/";

  //offset = 0;//Offset may be changed later, generic for now

  constructor(public navCtrl: NavController, public navParams: NavParams, public recipeService: RecipeListService) {
    this.getProductRecipes();
    console.log("Loaded recipes from constructor.");
  }

  /**
   * Get default search values, generic for now, will be modified later.
   */
  getDefaults() {
    this.numItems = "10";
    this.sort = "2";//Minimize ingredients needed
  }


  /**
   * Subscribes to recipes returned by api to display as cards in html.
   */
  getProductRecipes() {
    this.items = this.recipeService.getItemList(); //Load item strings
    this.getDefaults(); //Set defaults
    this.recipeService.recipeByIngredients(this.items, this.numItems, this.sort).subscribe(genRecipes => {
      console.log("Using items: " + this.items);
      console.log(genRecipes);
      this.sortByLikes(genRecipes); //Sort
      this.numRecipes = this.recipes.length;
    })
  }

  /**
   * All recipe cards returned will be sorted before displayed.
   */
  sortByLikes(genRecipes: any) {
    this.recipes = genRecipes.sort((rec1, rec2) => {
      return rec2.likes - rec1.likes;//Sort recipes by descending likes
    })
  }

  //Omit keyword search for now
  /*getSearchResults() {
    this.recipeService.recipeByName(this.numItems, this.searchKeys).subscribe(searchResults => {
      //Need to add url for images, for some reason api doesn't return it
      for (let result of searchResults.results)
        result.image = this.baseImageUrl + result.image;
      console.log(searchResults.results);
      this.recipes = searchResults.results;
    })
  }*/

 /**
  * To open a RecipeDetails page passing only recipe id as string.
  */

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getProductRecipes();//Reload pantry list items and refresh
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }


 


  viewRecipeData(recipeId: string) {
    this.navCtrl.push(RecipeDetails, {
      recipeId: recipeId,
    })
  }
}

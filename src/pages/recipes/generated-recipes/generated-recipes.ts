import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RecipeDetails } from '../../../pages/recipes/recipe-details/recipe-details';
import { Search } from '../../../providers/search';
import { Recipe } from '../../../models/recipe';
import { RecipeData } from '../../../models/recipe-data';
import { Item } from '../../../pages/products/item/item';
import { PantryListService } from '../../../providers/pantry-list'

@Component({
  selector: 'page-generated-recipes',
  templateUrl: 'generated-recipes.html'
})
export class GeneratedRecipesPage {

  recipes: Recipe[];
  items: string;
  sort: string;
  numItems: string;
  public ingrds: Item[];
  check: number;
  searchKeys: string;
  public baseImageUrl = "https://spoonacular.com/recipeImages/";

  constructor(public navCtrl: NavController, public navParams: NavParams, private search: Search, pantryService: PantryListService) {
    //Load pantry items and store as a string in "items"
    pantryService.load();
    this.ingrds = pantryService.getPantryItems();
    for (let item of this.ingrds) {
      console.log(item.id);
      this.items = this.items + ', ' + item.info.breadcrumbs[0]; 
    }

    this.getDefaults();
    this.check = this.navParams.get('check');//Should retrieve 1 or 0

    if (this.check == 0) {
      this.getProductRecipes();
    }

    else if (this.check == 1) {
      this.searchKeys = navParams.get('keywords');
      console.log("Search keys rectrieved from navparams are " + this.searchKeys);
      this.getSearchResults();
    }

    else
      console.log("Recipe generation failed");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecipeFromProductsPage');
  }
  
  //Get default search values, generic for now, will be modified later
  getDefaults() {
    this.numItems = "5";
    this.sort = "1";
  }

  getProductRecipes() {
    this.search.recipeByIngredients(this.items, this.numItems, this.sort).subscribe(recipes => {
      console.log(recipes)
      this.recipes = recipes;
    })
  }

  getSearchResults() {
    this.search.recipeByName(this.numItems, this.searchKeys).subscribe(searchResults => {
      //Need to add url for images, for some reason api doesn't return it
      for (let result of searchResults.results)
        result.image = this.baseImageUrl + result.image;
      console.log(searchResults.results);
      this.recipes = searchResults.results;
  })
  }

  viewRecipeData(recipeId: string) {
    this.navCtrl.push(RecipeDetails, {
      recipeId: recipeId
    })
  }

}

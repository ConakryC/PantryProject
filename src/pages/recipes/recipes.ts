/**
 * recipes.ts
 * Created: 2/1/17
 * Author: Bryan Martinez (mbryan93@live.com)
 * 
 * Edited: 3/5/17 By: Bryan Martinez
 * 
 * This page holds the information that will be displayed on the recipes tab.
 */
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GeneratedRecipesPage } from '../recipes/generated-recipes/generated-recipes';
import { RecipeListService } from '../../providers/recipe-list';
import { RecipeDetails } from '../../pages/recipes/recipe-details/recipe-details';
import { AlertController } from 'ionic-angular';

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

  itemList: any[];//Array of items
  searchKeys: string;//String of keywords for recipe search

  //Required to concatenate image url to keyword recipe search results
  public baseImageUrl = "https://spoonacular.com/recipeImages/";
  itemCheckboxOpen: boolean; //For checkboxes

  constructor(public navCtrl: NavController, public navParams: NavParams, public recipeService: RecipeListService,
    public alertCtrl: AlertController) {
    this.getProductRecipes(); //Generate recipes first time tab is clicked
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
      this.numRecipes = genRecipes.length;
    })
  }

  /**
   * All recipe cards returned will be sorted before displayed.
   * @param genRecipes recipes that are generated and unsorted
   */
  sortByLikes(genRecipes: any) {
    this.recipes = genRecipes.sort((rec1, rec2) => {
      return rec2.likes - rec1.likes;//Sort recipes by descending likes
    })
  }

  /**
   * Calls a checkbox alert to ask the user for items wanted in recipe search
   * then populates and sorts.
   */
  getCheckboxRecipes() {
    console.log("Items after checkbox closed:", this.items);
    this.getDefaults(); //Set defaults
    this.recipeService.recipeByIngredients(this.items, this.numItems, this.sort).subscribe(genRecipes => {
      console.log("Using items: " + this.items);
      console.log(genRecipes);
      this.sortByLikes(genRecipes); //Sort
      this.numRecipes = genRecipes.length;
    })
  }

  /**
   * Creates an item checkbox when a user clicks "Change Items" button.
   * Uses the name of the item as a label then if the box is checked, the
   * breadcrumb is added to the items string
   */
  getCheckboxInfo() {
    //Reload the database before retrieving any updated pantry items
    this.itemList = this.recipeService.refresh();

    let alert = this.alertCtrl.create();
    alert.setTitle("Recipes should include..");
    //Create checkboxes for each item
    for (let item of this.itemList) {
      alert.addInput({
        type: 'checkbox',
        label: item.info.title,
        value: item.info.breadcrumbs[0], //Add to data variable later if checked
        checked: true
      });
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        this.itemCheckboxOpen = false;
        console.log('Checked data:', data);
        this.items = "";//reset items string

        //Loop through data returned by checkbox (Array of breadcrumbs)
        for (let item of data) {
          if (this.items === "") this.items = item;
          else
            this.items = this.items + ', ' + item;
        }

        this.getCheckboxRecipes();//Repopulate page with recipes
      }
    });
    alert.present().then(() => {
      this.itemCheckboxOpen = true;
    })
  }

  /**
   * Creates an alert for the user to input search keywords then Calls
   * getSearchResults()
   */
  searchRecipes() {
    let prompt = this.alertCtrl.create({
      title: 'Enter search keywords',
      message: 'Enter a recipe you would like to search for.',
      inputs: [
        {
          name: 'keywords',
          placeholder: 'Recipe'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel Clicked')
          }
        },
        {
          text: 'Search',
          handler: data => {
            console.log('Search clicked')
            this.searchKeys = data.keywords;
            console.log("Search keywords", this.searchKeys);
            this.getSearchResults();

          }
        }
      ]
    });
    prompt.present();
  }


  /**
   * Generates the default number of recipes based off user input.
   */
  getSearchResults() {
    this.getDefaults();
    this.recipeService.recipeByName(this.numItems, this.searchKeys).subscribe(searchResults => {
      //Need to add url for images, for some reason api doesn't return it
      for (let result of searchResults.results)
        result.image = this.baseImageUrl + result.image;
      console.log(searchResults.results);
      this.recipes = searchResults.results;
      this.numRecipes = this.recipes.length;
    })
  }


  /**
   * Refreshes page when a user pulls down from the top of page
   * @param refresher 
   */
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getProductRecipes();//Reload pantry list items and refresh
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  /**
  * To open a RecipeDetails page passing only recipe id as string.
  */
  viewRecipeData(recipeId: string) {
    this.navCtrl.push(RecipeDetails, {
      recipeId: recipeId,
    })
  }
}

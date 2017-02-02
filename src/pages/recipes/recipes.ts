import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RecipesFromProductsPage } from '../recipes/recipe-from-products/recipes-from-products';

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html'
})
export class RecipesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  generateRecipes() {
    this.navCtrl.push(RecipesFromProductsPage)
  }
}

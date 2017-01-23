import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Recipe } from '../../models/recipe';
import { RecipeData } from '../models/recipe-data';
import { Data } from '../../providers/data';

@Component({
  selector: 'recipe-details',
  templateUrl: 'recipe-details.html'
})
export class RecipeDetails {
  recipeData: any;
  recipeId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private data: Data) {
    this.recipeId = navParams.get('recipeId');
    this.data.recipeID(this.recipeId).subscribe(recipeData => {
      console.log(recipeData)
      this.recipeData = recipeData;
   })
    
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad RecipeDetailsPage');
  }

}
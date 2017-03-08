/**
 * recipes-list.ts
 * Created: 2/1/17
 * Author: Bryan Martinez (mbryan93@live.com)
 *
 * Edited: 3/5/17 By: Bryan Martinez
 *
 * A recipe list service that provides api call functions and other useful functions for recipe
 * generation and display.
 */

import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Recipe } from '../models/recipe'
import { RecipeData } from '../models/recipe-data';
import { PantryListService } from './pantry-list';
import { Item } from '../pages/products/item/item';

const apiKey = 'FBiqUe796amshHCRsuDjukypRhO4p1C7p0FjsnURXVaA5HhxLS';

@Injectable()
export class RecipeListService {

    private headers: Headers;
    private reqOps: RequestOptions;
    itemList: Item[];
    items: string;   //to return, string of item breadcrumbs

    constructor(private http: Http, private pantryService: PantryListService) {

        //Initialize headers and requestoptions for api calls
        this.headers = new Headers();
        this.headers.append('X-Mashape-Key', apiKey);
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json ');

        this.reqOps = new RequestOptions({
            headers: this.headers
        });

        this.itemList = pantryService.getPantryItems();
    }

    /**
     * Makes an http api call using headers and other relevant information
     * to retrieve recipes based on products. 
     * 
     * @param {string} items products seperated by "," to search for
     * @param {string} numRecipes number of recipes to generate
     * @param {string} sort 1 to maximize used products, 2 to minimize unused
     * @returns {Observable<any[]>} 
     * 
     * @memberOf RecipeListService
     */
    recipeByIngredients(items: string, numRecipes: string, sort: string): Observable<any[]> {
        let ingrds = '?fillIngredients=true&ingredients=' + items;
        let numIngrds = '&limitLicense=false&number=' + numRecipes;
        let rank = '&ranking=' + sort;

        return this.http.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients'
            + ingrds + numIngrds + rank, this.reqOps).map(res => <any[]>res.json())
    }

    /**
     * Uses search keys to make api call for related recipes.
     * 
     * @param {string} numRec number of recipes to generate
     * @param {string} keywords search keys
     * @returns {Observable<any>} 
     * 
     */
    recipeByName(numRec: string, keywords: string): Observable<any> {
        let ingrds = '?instructionsRequired=false&limitLicense=false';
        let numRecipes = '&number=' + numRec;
        let offset = '&offset=0';
        let query = '&query=' + keywords;

        return this.http.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search'
        + ingrds + numRecipes + offset + query, this.reqOps).map(res => <any>res.json());
    }

    /**
     * Retrieves recipe information from api for specified recipe.
     * 
     * @param {string} id recipe id 
     * @returns {Observable<Recipe>} 
     * 
     */
    recipeID(id: string): Observable<Recipe> {
        let headers = new Headers();
        headers.append('X-Mashape-Key', apiKey);
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json ');

        let reqOps = new RequestOptions({
            headers: headers
        });

        let recipe = id + '/information?includeNutrition=false';

        return this.http.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/'
            + recipe, reqOps).map(res => <Recipe>res.json())
    }

    /**
     * Loops through pantry items to create ingredients string.
     * 
     * @returns {string} ingredients
     * 
     */
    getItemList(): string {
        //Reload the database before retrieving any updated pantry items
        this.pantryService.load();
        this.itemList = this.pantryService.getPantryItems();
        this.items = "";
        //Loop pantry items and store as a string in "items"
        for (let item of this.itemList) {
            if (this.items === "") this.items = item.info.breadcrumbs[0];
            else
                this.items = this.items + ', ' + item.info.breadcrumbs[0];
        }

        return this.items;
    }

    /**
     * Reload database and updates local pantry list.
     * 
     * @returns {any[]} pantry list
     * 
     */
    refresh():any[] {
        this.pantryService.load();
        return this.pantryService.getPantryItems();
    }
}

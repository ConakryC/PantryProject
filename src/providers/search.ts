import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Recipe } from '../models/recipe'

const apiKey = 'FBiqUe796amshHCRsuDjukypRhO4p1C7p0FjsnURXVaA5HhxLS';

@Injectable()
export class Search {

    private headers: Headers;
    private reqOps: RequestOptions;

    constructor(private http: Http) {

        //Initialize headers and requestoptions for api calls
        this.headers = new Headers();
        this.headers.append('X-Mashape-Key', apiKey);
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json ');

        this.reqOps = new RequestOptions({
            headers: this.headers
        });
    }

    recipeByIngredients(items: string, numRecipes: string, sort: string): Observable<Recipe[]> {
        let ingrds = '?fillIngredients=false&ingredients=' + items;
        let numIngrds = '&limitLicense=false&number=' + numRecipes;
        let rank = '&ranking=' + sort;

        return this.http.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients'
            + ingrds + numIngrds + rank, this.reqOps).map(res => <Recipe[]>res.json())
    }

    recipeByName(numRec: string, keywords: string): Observable<any> {
        let ingrds = '?instructionsRequired=false&limitLicense=false';
        let numRecipes = '&number=' + numRec;
        let offset = '&offset=0';
        let query = '&query=' + keywords;

        return this.http.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search'
        + ingrds + numRecipes + offset + query, this.reqOps).map(res => <any>res.json());
    }
}

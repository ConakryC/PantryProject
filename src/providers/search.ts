import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Recipe } from '../models/recipe'

const apiKey = 'COpXPzpvFNmshP4Owo07PrR9rdOdp1KlFGqjsnDq2umrhMaqQh';

@Injectable()
export class Search {

    constructor(private http: Http) {}

    recipeByIngredients(items: string, sort: string): Observable<Recipe[]> {
        let headers = new Headers();
        headers.append('X-Mashape-Key', apiKey);
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json ');

        let reqOps = new RequestOptions({
            headers: headers
        });

        let ingrds= '?fillIngredients=false&ingredients=' + items;
        let rank = '&limitLicense=false&number=3&ranking=' + sort;

        return this.http.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients'
            + ingrds + rank, reqOps).map(res => <Recipe[]>res.json())
    }
}
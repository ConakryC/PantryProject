import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { RecipeData } from '../models/recipe-data';

const apiKey = 'COpXPzpvFNmshP4Owo07PrR9rdOdp1KlFGqjsnDq2umrhMaqQh';

@Injectable()
export class Data {

    constructor(private http: Http) {}
    
    recipeID(id: string): Observable<RecipeData> {
        let headers = new Headers();
        headers.append('X-Mashape-Key', apiKey);
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json ');

        let reqOps = new RequestOptions({
            headers: headers
        });

        let recipe = id + '/information?includeNutrition=false';

        return this.http.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/'
            + recipe, reqOps).map(res => <RecipeData>res.json())
    }
}

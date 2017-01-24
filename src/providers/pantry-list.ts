import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Item} from '../pages/products/item/item';

@Injectable()
export class PantryListService {

    public pantryList: Item[];
    private headers: Headers;
    private opt: RequestOptions;

    constructor(public http: Http) {
        //Initialize pantry list
        this.pantryList = [];

        this.headers = new Headers();
        this.headers.append('X-Mashape-Key', 'FBiqUe796amshHCRsuDjukypRhO4p1C7p0FjsnURXVaA5HhxLS');
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json ');

        this.opt = new RequestOptions({
            headers: this.headers
        });
    }

    /**
     * Search for a Item using its UPC code
     * This returns an observable that needs to be dealt with
     * @param upc
     */
    searchUPC(upc: string): Observable<any> {
        return this.http.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/products/upc/" + upc, this.opt).map(res => res.json());
    }

    searchName(name: string): Observable<any> {
        return this.http.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/products/search?query=" + name, this.opt).map(res => res.json());
    }

    getProductFromID(id: number): Observable<any> {
        return this.http.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/products/" + id, this.opt).map(res => res.json());
    }

    public addItem(itemToAdd: Item): void {
        this.pantryList.push(itemToAdd);
    }
}

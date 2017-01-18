import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

const apiKey = 'LGzRSpu12QmshEYgXnbe5NvD91DYp183EV0jsnjoKY7hGWVZs2';
const autoCompImages = 'https://spoonacular.com/cdn/ingredients_100x100/';

function itemByUPC(upc) {
  let headers = new Headers();
  headers.append('X-Mashape-Key', apiKey);
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json ');

  let reqOps = new RequestOptions({
    headers: headers
  });

  this.http.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/products/upc/'
    + upc, reqOps).map(res => res.json()).subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.log("API Error");
      }
  );
}

function itemByKeyword(s) {
  let headers = new Headers();
  headers.append('X-Mashape-Key', apiKey);
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json ');

  let reqOps = new RequestOptions({
    headers: headers
  });

  let search = '?number=10&offset=0&query=' + s;

  this.http.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/products/search'
    + search, reqOps).map(res => res.json()).subscribe(
    data => {
      console.log(data);
    },
    err => {
      console.log("API Error");
    }
  );
}

function recipeByIngredients(items, sort) {
  let headers = new Headers();
  headers.append('X-Mashape-Key', apiKey);
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json ');

  let reqOps = new RequestOptions({
    headers: headers
  });

  let ingrds= '?fillIngredients=false&ingredients=' + items;
  let rank = '&limitLicense=false&number=5&ranking=' + sort;

  this.http.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients'
    + ingrds + rank, reqOps).map(res => res.json()).subscribe(
    data => {
      console.log(data);
    },
    err => {
      console.log("API Error");
    }
  );
}

function itemID(id) {
  let headers = new Headers();
  headers.append('X-Mashape-Key', apiKey);
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json ');

  let reqOps = new RequestOptions({
    headers: headers
  });

  this.http.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/products/'
    + id, reqOps).map(res => res.json()).subscribe(
    data => {
      console.log(data);
    },
    err => {
      console.log("API Error");
    }
  );
}

function recipeID(id) {
  let headers = new Headers();
  headers.append('X-Mashape-Key', apiKey);
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json ');

  let reqOps = new RequestOptions({
    headers: headers
  });

  let recipe = id + '/information?includeNutrition=false';

  this.http.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/'
    + recipe, reqOps).map(res => res.json()).subscribe(
    data => {
      console.log(data);
    },
    err => {
      console.log("API Error");
    }
  );
}

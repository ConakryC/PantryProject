import { Component } from '@angular/core';
import { BarcodeScanner } from 'ionic-native';
import { NavController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Item } from './Item';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-products',
  templateUrl: 'products.html'
})
export class ProductsPage {

    private pantryList: Item[];
	public upc = "076808002515";
    public data:any = {};

  constructor(public navCtrl: NavController, public http: Http) {
  }

  openBarcode(){
    BarcodeScanner.scan().then((barcodeData) => {
        this.upc = barcodeData.text;
        this.search(this.upc);
    }, (err) => {
        alert("Scanning failed: " + err);
		this.search(this.upc);
    });
  }
  
  search(upc : any){
	var headers = new Headers();
	headers.append('X-Mashape-Key', 'Jbst01LqSKmshsrw2kIpcSztjoCqp10lNaGjsnPR4YEgtq9zfX');
	headers.append('Content-Type', 'application/json');
	headers.append('Accept', 'application/json ');
    var opt = new RequestOptions({
        headers: headers
    });
  
    this.http.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/products/upc/" + this.upc, opt).map(res => res.json()).subscribe(js => {
        console.log(js);
		this.data.id = js.id;
		this.data.title = js.title;
		this.data.price = js.price;
		this.data.badges = js.badges;
		this.data.servings = js.serving_size;
		this.data.numIngredients = js.ingredientCount;
		this.data.image = js.images[0];
    }, error => {
        console.log("Error");
    });
  
    //this.url = "http://api.upcdatabase.org/json/0e5cffe460aceb38bad4de549bdadf32/" + upc;
    
    //this.http.get("http://api.upcdatabase.org/json/0e5cffe460aceb38bad4de549bdadf32/" + upc)
    //    .map(res => res.json())
    //    .subscribe(js => {
    //      this.data = "ItemName: " + js.itemname + "\nUPC: " + upc + "\nDesciption: " + js.description;
    //    }, error => {
    //      this.data = "Error: " + error;
    //    });
  }
}

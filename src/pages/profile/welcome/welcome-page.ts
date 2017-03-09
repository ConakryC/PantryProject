import { Component } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { NavController } from 'ionic-angular';
import { Auth, User } from '@ionic/cloud-angular';
import { ProfilePage } from '../../profile/profile';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome-page.html'
})

export class WelcomePage {

  private headers: Headers;
  private opt: RequestOptions;
  private foodJoke: string;
  private foodTrivia: string;

  constructor(public navCtrl: NavController, public user: User, public auth: Auth, public http: Http) {
    console.log(user);

    this.foodJoke = "";
    this.foodTrivia = "";

    //Setup the headers we use for the API calls
    this.headers = new Headers();
    this.headers.append('X-Mashape-Key', 'FBiqUe796amshHCRsuDjukypRhO4p1C7p0FjsnURXVaA5HhxLS');
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json ');

    //Add header options
    this.opt = new RequestOptions({
      headers: this.headers
    });
  }

  logout() {
    this.auth.logout();
    this.navCtrl.setRoot(ProfilePage);
  }

  getJoke() {
    this.http.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/jokes/random", this.opt).map(res => res.json()).subscribe(js => {
      this.foodJoke = js.text;
    });
  }

  getTrivia() {
    this.http.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/trivia/random", this.opt).map(res => res.json()).subscribe(js => {
      this.foodTrivia = js.text;
    });
  }
}

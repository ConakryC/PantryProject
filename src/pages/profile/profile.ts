import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
//import { ProfilePage } from './profile/profile';
//import { SignInPage } from '../../../pages/profile/sign-in/signin';
//import { SignUpPage } from '../../../pages/profile/sign-up/signup';

@Component({
  selector: 'profile',
  templateUrl: 'profile.html'
})

export class ProfilePage {
  constructor(public navCtrl: NavController) {}
  signIn(){
    //this.navCtrl.push(SignInPage);
  }
  signUp(){
    //this.navCtrl.push(SignUpPage);
  }
}

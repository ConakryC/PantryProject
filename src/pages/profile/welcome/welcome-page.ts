import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Auth, User } from '@ionic/cloud-angular';
import { ProfilePage } from '../../profile/profile';

@Component ({
  selector: 'page-welcome',
  templateUrl: 'welcome-page.html'
})

export class WelcomePage {

  constructor(public navCtrl: NavController, public user:User, public auth: Auth) {
  console.log(user);

 }

 logout() {
   this.auth.logout();
   this.navCtrl.setRoot(ProfilePage);
 }


}

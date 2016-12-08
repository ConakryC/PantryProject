import { Component } from '@angular/core';

import { ProductsPage } from '../products/products';
import { RecipesPage } from '../recipes/recipes';
import { ProfilePage } from '../profile/profile';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = ProductsPage;
  tab2Root: any = RecipesPage;
  tab3Root: any = ProfilePage;

  constructor() {

  }
}

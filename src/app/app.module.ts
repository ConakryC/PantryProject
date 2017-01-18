import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ProfilePage } from '../pages/profile/profile';
import { RecipesPage } from '../pages/recipes/recipes';
import { ProductsPage } from '../pages/products/products';
import { TabsPage } from '../pages/tabs/tabs';
import { PantryList } from '../providers/pantry-list';

@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    RecipesPage,
    ProductsPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,
    RecipesPage,
    ProductsPage,
    TabsPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, PantryList]
})
export class AppModule {}

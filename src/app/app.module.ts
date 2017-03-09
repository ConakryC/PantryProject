import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { MyApp } from './app.component';
import { ProfilePage } from '../pages/profile/profile';
import { WelcomePage } from '../pages/profile/welcome/welcome-page';
import { RecipesPage } from '../pages/recipes/recipes';
import { ItemPage } from '../pages/products/item/item-page';
import { ProductsPage } from '../pages/products/products';
import { ProductPagePopover, ProductSortPopover, ProductFilterPopover, RecentItemsPopover } from '../pages/products/product-popovers';
import { ModalContentPage } from '../pages/products/product-modal';
import { TabsPage } from '../pages/tabs/tabs';
import { PantryListService } from '../providers/pantry-list';
import { ProductHelper } from '../providers/product-helper';
import { RecipeDetails } from '../pages/recipes/recipe-details/recipe-details'
import { RecipeListService } from '../providers/recipe-list';
import { Platform } from 'ionic-angular';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'b9279193'
  }
};

@NgModule({
    declarations: [
        MyApp,
        ProfilePage,
        WelcomePage,
        RecipesPage,
        ItemPage,
        ProductsPage,
        ModalContentPage,
        ProductPagePopover,
        ProductSortPopover,
        ProductFilterPopover,
        RecentItemsPopover,
        RecipeDetails,
        TabsPage
    ],
    imports: [
        IonicModule.forRoot(MyApp),
        CloudModule.forRoot(cloudSettings)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        ProfilePage,
        WelcomePage,
        RecipesPage,
        ItemPage,
        ProductsPage,
        ModalContentPage,
        ProductPagePopover,
        ProductSortPopover,
        ProductFilterPopover,
        RecentItemsPopover,
        RecipeDetails,
        TabsPage
    ],
    providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, PantryListService, RecipeListService, ProductHelper]
})
export class AppModule {
  rootPage;

  constructor(platform: Platform, public auth: Auth) {
    platform.ready().then(() => {

      if(this.auth.isAuthenticated()) {
        this.rootPage = WelcomePage;
      } else {
        this.rootPage = ProfilePage;
      }

    });
  }
}

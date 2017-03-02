import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ProfilePage } from '../pages/profile/profile';
import { RecipesPage } from '../pages/recipes/recipes';
import { ItemPage } from '../pages/products/item/item-page';
import { ProductsPage } from '../pages/products/products';
import { ProductPagePopover, ProductSortPopover, ProductFilterPopover, RecentItemsPopover } from '../pages/products/product-popovers';
import { ModalContentPage } from '../pages/products/product-modal';
import { TabsPage } from '../pages/tabs/tabs';
import { PantryListService } from '../providers/pantry-list';
import { ProductHelper } from '../providers/product-helper';
import { FilterPipe } from '../pipes/filter-pipe';
import { RecipeDetails } from '../pages/recipes/recipe-details/recipe-details'
import { RecipeListService } from '../providers/recipe-list';


@NgModule({
    declarations: [
        MyApp,
        ProfilePage,
        RecipesPage,
        ItemPage,
        ProductsPage,
        ModalContentPage,
        ProductPagePopover,
        ProductSortPopover,
        ProductFilterPopover,
        RecentItemsPopover,
        RecipeDetails,
        FilterPipe,
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
export class AppModule { }

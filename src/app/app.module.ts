import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ProfilePage } from '../pages/profile/profile';
import { RecipesPage } from '../pages/recipes/recipes';
import { ItemPage } from '../pages/products/item/item-page';
import { ProductsPage } from '../pages/products/products';
import { ProductPagePopover, ProductSortPopover, ProductFilterPopover } from '../pages/products/product-popovers';
import { ModalContentPage } from '../pages/products/product-modal';
import { TabsPage } from '../pages/tabs/tabs';
import { PantryListService } from '../providers/pantry-list';
import { ProductHelper } from '../providers/product-helper';
import { Search } from '../providers/search';
import { Data } from '../providers/data';
import { RecipeDetails } from '../pages/recipe-details/recipe-details';
import { FilterPipe } from '../pipes/filter-pipe';

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
        RecipeDetails,
        TabsPage,
        FilterPipe
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
        RecipeDetails,
        TabsPage
    ],
    providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, PantryListService, Search, Data, ProductHelper]
})
export class AppModule { }

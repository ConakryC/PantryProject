import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ProfilePage } from '../pages/profile/profile';
import { RecipesPage } from '../pages/recipes/recipes';
import { ItemPage } from '../pages/products/item/item-page';
import { ProductsPage, ModalContentPage } from '../pages/products/products';
import { TabsPage } from '../pages/tabs/tabs';
import { PantryListService } from '../providers/pantry-list';
import { Search } from '../providers/search';
import { Data } from '../providers/data';
import { RecipeDetails } from '../pages/recipes/recipe-details/recipe-details'
import { GeneratedRecipesPage } from '../pages/recipes/generated-recipes/generated-recipes';

@NgModule({
    declarations: [
        MyApp,
        ProfilePage,
        RecipesPage,
        ItemPage,
        ProductsPage,
        ModalContentPage,
        RecipeDetails,
        GeneratedRecipesPage,
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
        RecipeDetails,
        GeneratedRecipesPage,
        TabsPage
    ],
    providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, PantryListService, Search, Data]
})
export class AppModule { }

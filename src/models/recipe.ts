/**
 * To be used for storing recipe information after a user clicks on one.
 * Possibly only for saving recipes if creating one is too costly.
 */
export class Recipe {
    preparationMinutes: number;
    cookingMinutes: number;
    extendedIngredients: any[];
    id: number;
    title: string;
    image: string;
    nutrients: any[]; //To be used only if nutrition information will be used.
    analyzedInstructions: any[];
    instructions: string;

    /**
     * Automatically sets all recipe data returned from api.
     */
    constructor(data?: any) {
        this.preparationMinutes = data.preparationMinutes;
        this.cookingMinutes = data.cookingMinutes;
        this.extendedIngredients = data.extendedIngredients;
        this.id = data.id;
        this.title = data.title;
        this.image = data.image;
        this.nutrients = data.nutrients; //To be used only if nutrition information will be used.
        this.analyzedInstructions = data.analyzedInstructions;
    }
}


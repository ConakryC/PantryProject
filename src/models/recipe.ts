export interface Recipe {
    id: number;
    title: string;
    image: string;
    usedIngredientCount: number;
    missedIngredientCount: number;
    likes: number;
    results: any[];
}
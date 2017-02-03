/**
* Basically an enum but to get around TypeScript only
* allowing numbers of values in enums
**/
export class Filter
{
    static FILTERS = [];

    // boilerplate
    constructor(public value:string){
      Filter.FILTERS.push(this);
    }

    toString(){
        return this.value;
    }

    // values
    static All = new Filter("All");
    static Gluten_Free = new Filter("Gluten Free");
    static Favorite = new Filter("Favorite");
    static Not_Favorite = new Filter("Not Favorite");
    static Dairy_Free = new Filter("Dairy Free");
    static Peanut_Free = new Filter("Peanut Free");
}

export class Sort
{
    static SORTS = [];

    // boilerplate
    constructor(public value:string){
      Sort.SORTS.push(this);
    }

    toString(){
        return this.value;
    }

    // values
    static None = new Sort("None");
    static Alphabetical = new Sort("Alphabetical");
    static Favorite = new Sort("Favorite");
    static Amount = new Sort("Amount");
    static Price = new Sort("Price");
    static Score = new Sort("Score");
}

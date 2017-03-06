/*
* Class that holds basic information about items
*/
﻿export class Item {

    /*
    * Our database unique id
    */
    public id: number;

    /*
    * Amount that the item currently has
    */
    public amount: number;

    /*
    * The items UPC
    */
    public upc: string;

    /*
    * The information returned from the API
    */
    public info: any;

    /*
    * Is the item a favorite
    */
    public favorite: boolean;

    constructor(info?: any, upc = "", amount = 1, id = 0, favorite = false) {
        this.id = id;
        this.favorite = favorite;
        this.amount = amount;
        this.upc = upc;
        this.info = info;
    }
}

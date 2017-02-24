export class Item {

    public id: number;
    public amount: number;
    public upc: string;
    public info: any;
    public favorite: boolean;

    constructor(info?: any, upc = "", amount = 1, id = 0, favorite = false) {
        this.id = id;
        this.favorite = favorite;
        this.amount = amount;
        this.upc = upc;
        this.info = info;
    }
}

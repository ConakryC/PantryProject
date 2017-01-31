export class Item {

    public id: number;
    public amount: number;
    public upc: string;
    public info: any;

    constructor(info?: any, upc = "", amount = 1, id = 0) {
        this.id = id;
        this.amount = amount;
        this.upc = upc;
        this.info = info;
    }
}

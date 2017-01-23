export class Item {
    
    public amount: number;
    public upc: string;
    public info: any;

    constructor(info?: any, upc = "", amount = 1) {
        this.amount = amount;
        this.upc = upc;
        this.info = info;
    }
}
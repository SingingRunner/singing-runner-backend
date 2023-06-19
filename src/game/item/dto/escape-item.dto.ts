import { Item } from "../item.enum";

export class EscapeItemDto{
    private userid:string;
    private item:Item;

    public getUserId():string{
        return this.userid;
    }

    public getItem():Item{
        return this.item;
    }
}
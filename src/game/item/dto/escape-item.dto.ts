import { Item } from "../item.enum";

export class UserItemDto{
    private userid:string;
    private item:Item;

    public getUserId():string{
        return this.userid;
    }

    public getItem():Item{
        return this.item;
    }
}
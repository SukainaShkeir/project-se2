import { Item, ItemCategory } from "./Item.model";


export class Toy {
    private OrderID: number;
    private Type: string;
    private AgeGroup: string;
    private Brand: string;
    private Material: string;
    private BatteryRequired: boolean;
    private Educational: boolean;
    private Price: number;
    private Quantity: number;

    constructor(
        OrderID: number,
        Type: string,
        AgeGroup: string,
        Brand: string,
        Material: string,
        BatteryRequired: boolean,
        Educational: boolean,
        Price: number,
        Quantity: number
    ) {
        this.OrderID = OrderID;
        this.Type = Type;
        this.AgeGroup = AgeGroup;
        this.Brand = Brand;
        this.Material = Material;
        this.BatteryRequired = BatteryRequired;
        this.Educational = Educational;
        this.Price = Price;
        this.Quantity = Quantity;
    }

    public getOrderID(): number {
        return this.OrderID;
    }

    public getType(): string {
        return this.Type;
    }

    public getAgeGroup(): string {
        return this.AgeGroup;
    }

    public getBrand(): string {
        return this.Brand;
    }

    public getMaterial(): string {
        return this.Material;
    }

    public isBatteryRequired(): boolean {
        return this.BatteryRequired;
    }

    public isEducational(): boolean {
        return this.Educational;
    }

    public getPrice(): number {
        return this.Price;
    }

    public getQuantity(): number {
        return this.Quantity;
    }

    getCategory(): ItemCategory{
        return ItemCategory.TOY;
    }
}
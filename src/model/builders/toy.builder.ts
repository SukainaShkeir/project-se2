import logger from "../../util/logger";
import { Toy } from "../Toy.model";


export class ToyBuilder {
    private OrderID!: number;
    private Type!: string;
    private AgeGroup!: string;
    private Brand!: string;
    private Material!: string;
    private BatteryRequired!: boolean;
    private Educational!: boolean;
 

    public setOrderID(orderID: number): ToyBuilder {
        this.OrderID = orderID;
        return this;
    }

    public setType(type: string): ToyBuilder {
        this.Type = type;
        return this;
    }

    public setAgeGroup(ageGroup: string): ToyBuilder {
        this.AgeGroup = ageGroup;
        return this;
    }

    public setBrand(brand: string): ToyBuilder {
        this.Brand = brand;
        return this;
    }

    public setMaterial(material: string): ToyBuilder {
        this.Material = material;
        return this;
    }

    public setBatteryRequired(batteryRequired: boolean): ToyBuilder {
        this.BatteryRequired = batteryRequired;
        return this;
    }

    public setEducational(educational: boolean): ToyBuilder {
        this.Educational = educational;
        return this;
    }

    

    build(): Toy{
        const requiredProperties = [
            this.OrderID,
            this.Type,              
            this.AgeGroup,
            this.Brand,
            this.Material,
            this.BatteryRequired,
            this.Educational,
        ];
        for (const property of requiredProperties) {
            if (!property){
                logger.error("Missing required property for Toy object.");
                throw new Error("Missing required property for Toy object.");  
            }
        }
        return new Toy(
            this.OrderID,
            this.Type,
            this.AgeGroup,
            this.Brand,
            this.Material,
            this.BatteryRequired,
            this.Educational,
          
        );

    }
}

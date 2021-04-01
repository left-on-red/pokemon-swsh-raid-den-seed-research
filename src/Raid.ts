import { PersonalLoader } from './PersonalLoader';

export class Raid {
    public ability:number;
    public altform:number;
    public ivCount:number;
    public gender:number;
    public genderRatio:number;
    public gmax:Boolean;
    public species:number;
    private _star:Array<Boolean>;
    public shinyType:number;

    constructor(ability:number, altform:number, ivCount:number, gender:number, gmax:Boolean, species:number, star:Array<Boolean>, shinyType:number = 0) {
        this.ability = ability;
        this.altform = altform;
        this.ivCount = ivCount;
        this.gender = gender;
        this.genderRatio = PersonalLoader.getInfo(species, altform).genderRatio;
        this.gmax = gmax;
        this.species = species;
        this._star = star;
        this.shinyType = shinyType;
    }

    public getStar(index:number):Boolean { return this._star[index] }

    public getStarRange():string {
        let low:number = 4;
        let high:number = 0;

        for (let i = 0; i < 5; i++) {
            if (this._star[i]) {
                if (i < low) { low = i }
                if (i > high) { high = i }
            }
        }
      
        if (low == high) { return `${low + 1}★'` }
        return `${low + 1}-${high + 1}★`;
    }
}
export class FilterData {
    public ivs:Array<number>;
    public natures:Array<Boolean>;
    public gender:number;
    public ability:number;
    public shiny:number;
    public skip:Boolean;

    constructor(ivs:Array<number>, natures:Array<Boolean>, gender:number, ability:number, shiny:number, skip:Boolean) {
        this.ivs = ivs;
        this.natures = natures;
        this.gender = gender;
        this.ability = ability;
        this.shiny = shiny;
        this.skip = skip;
    }
}
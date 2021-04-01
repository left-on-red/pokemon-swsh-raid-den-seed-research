export class PersonalInfo {
    private _stats:Array<number>;
    public genderRatio:number;
    public ability1:number
    public ability2:number
    public abilityH:number;
    public formCount:number;
    public formStatIndex:number;
    public included:Boolean;
  
    constructor(stats:Array<number>, genderRatio:number, ability1:number, ability2:number, abilityH:number, formCount:number, formStatIndex:number, included:Boolean) {
        this._stats = stats;
        this.genderRatio = genderRatio;
        this.ability1 = ability1;
        this.ability2 = ability2;
        this.abilityH = abilityH;
        this.formCount = formCount;
        this.formStatIndex = formStatIndex;
        this.included = included;
    }

    public getStat(index:number):number { return this._stats[index] }

    public getAbility(ability:number):number {
        if (ability == 0) { return this.ability1; }
        if (ability == 1) { return this.ability2; }
        return this.abilityH;
    }
}
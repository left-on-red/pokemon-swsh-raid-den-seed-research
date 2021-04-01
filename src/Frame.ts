export class Frame {
    public frame:number = -1;
    public nature:number = -1;
    public ability:number = -1;
    public gender:number = -1;
    public shiny:number = -1;

    private _ivs:Array<number> = [0, 0, 0, 0, 0, 0]

    constructor(frame:number) { this.frame = frame }

    getIV(index:number):number { return this._ivs[index] }

    setIV(index:number, iv:number):void { this._ivs[index] = iv }
}
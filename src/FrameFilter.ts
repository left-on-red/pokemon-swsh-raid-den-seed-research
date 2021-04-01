import { Frame } from './Frame';

export class FrameFilter {
    private _min:Array<number>;
    private _max:Array<number>;
    private _natures:Array<Boolean>;
    private _gender:number;
    private _ability:number;
    private _shiny:number;
    private _skip:Boolean;

    constructor(ivs:Array<number>, natures:Array<Boolean>, gender:number, ability:number, shiny:number, skip:Boolean) {
        this._min = new Array<number>(6);
        this._max = new Array<number>(6);
        for (let i:number = 0; i < 6; i++) {
            let value:number = ivs[i];
            if (value == -1) { this._min[i] = 0; this._max[i] = 31; }
            else if (value == 0) { this._min[i] = 0; this._max[i] = 0; }
            else if (value == 1) { this._min[i] = 1; this._max[i] = 15; }
            else if (value == 2) { this._min[i] = 16; this._max[i] = 25; }
            else if (value == 3) { this._min[i] = 26; this._max[i] = 29; }
            else if (value == 4) { this._min[i] = 30; this._max[i] = 30; }
            else if (value == 5) { this._min[i] = 31; this._max[i] = 31; }
        }

        this._natures = natures;
        this._gender = gender;
        this._ability = ability;
        this._shiny = shiny;
        this._skip = skip;
    }

    public compareFrame(frame:Frame):Boolean {
        if (this._skip) { return true }
        if (this._gender != -1 && this._gender != frame.gender) { return false }
        if (this._ability != -1 && this._ability != frame.ability) { return false }
        if (!this._natures[frame.nature]) { return false }

        for (let i:number = 0; i < 6; i++) {
            let iv:number = frame.getIV(i);
            if (iv < this._min[i] || iv > this._max[i]) { return false }
        }

        return true;
    }

    public compareShiny(frame:Frame):Boolean { return this._skip || this._shiny == -1 || ((this._shiny & frame.shiny) != 0) }
}

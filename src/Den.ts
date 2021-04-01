import { Raid } from './Raid';
import { Game } from './Game';

export class Den {
    private _swordRaids:Array<Raid>;
    private _shieldRaids:Array<Raid>;

    constructor(swordRaids:Array<Raid>, shieldRaids:Array<Raid>) {
        this._swordRaids = swordRaids;
        this._shieldRaids = shieldRaids;
    }

    public getRaids(version:Game):Array<Raid> { return version == Game.Sword ? this._swordRaids : this._shieldRaids }

    public getRaid(index:number, version:Game):Raid { return this.getRaids(version)[index] }
}
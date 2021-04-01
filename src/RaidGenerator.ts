import { Frame } from './Frame';
import { Raid } from './Raid';
import { FrameFilter } from './FrameFilter';
import { XoroShiro } from './XoroShiro';
let long = require('long');

import { PythonShell } from 'python-shell';
let pyshell = PythonShell;

function getPy(path, args):Promise<string> {
    console.log(path);
    return new Promise(function(resolve, reject) {
        let options = {
            args: args
        }

        pyshell.run(path, options, function(error, results) {
            if (error) {
                console.log(error);
                console.log(`gen ${path}: ${args.join(', ')}`)
                //reject(error)
            }
            else { console.log(`${path}: ${results.join(', ')}`); resolve(results[0]) }
        });
    });
}

const toxtricityAmpedNatures = [ 3, 4, 2, 8, 9, 19, 22, 11, 13, 14, 0, 6, 24 ];
const toxtricityLowKeyNatures = [ 1, 5, 7, 10, 12, 15, 16, 17, 18, 20, 21, 23 ];

export class RaidGenerator {
    private _initialFrame:number;
    private _maxResults:number;
    private _species:number;
    private _altform:number;
    private _abilityType:number;
    private _shinyType:number;
    private _ivCount:number;
    private _genderType:number;
    private _genderRatio:number;

    constructor(initialFrame:number, maxResults:number, raid:Raid) {
        this._initialFrame = initialFrame;
        this._maxResults = maxResults;
        this._species = raid.species;
        this._altform = raid.altform;
        this._abilityType = raid.ability;
        this._shinyType = raid.shinyType;
        this._ivCount = raid.ivCount;
        this._genderType = raid.gender;
        this._genderRatio = raid.genderRatio;
    }

    //private _getShinyValue(value:number):number { return ((value >> 16) ^ (value & 0xffff)) >> 4 }
    //private _getShinyValue(value:String):String { return long.fromString(long.fromString(value, 16).shiftRight().toString(10), false, 10).xor(long.fromString(value, 16).and('-1')).shiftRight(4).toString(16) }

    private async _getShinyValue(value:string):Promise<string> {
        let val = await getPy(`./python/getShinyValue.py`, [value]);
        return val;
    }

    private async _getShinyType(sidtid:string, pid:string):Promise<string> {
        let val = await getPy(`./python/getShinyType.py`, [sidtid, pid]);
        return val;
        /*let val = long.fromString(sidtid, 16).xor(long.fromString(pid, 16)).shiftRight(16).toString(16);
        //let val = (sidtid ^ pid) >> 16;
    
        // square
        if (long.fromString(val, 16).xor(long.fromString(sidtid, 16).shiftRight(16).eq(long.fromString(pid, 16).and(-1)))) { return 2; }
        //if ((val ^ (sidtid >> 16)) == (pid & 0xffff)) { return 2; }
    
        // star
        return 1;*/
    }

    public async generate(filter:FrameFilter, seed:string):Promise<Array<Frame>> {
        let frames:Array<Frame> = new Array<Frame>();
        //console.log(seed);
        console.log(await getPy(`./python/getInitialFrameSeed.py`, [seed, this._initialFrame]));
        seed = await getPy(`./python/getInitialFrameSeed.py`, [seed, this._initialFrame]);

        //for (let i:number = 1; i < this._initialFrame; i++) { seed = long.fromString(seed, 16).add('-9033462785901761957').toString(16) }
        //for (let i:number = 1; i < this._initialFrame; i++) { seed += 0x82A2B175229D6A5B }

        //for (let frame:number = 0; frame < this._maxResults; frame++, seed = long.fromString(seed, 16).add('-9033462785901761957').toString(16)) {
        for (let frame:number = 0; frame < this._maxResults; frame++) {

        //for (let frame:number = 0; frame < this._maxResults; frame++, seed += 0x82A2B175229D6A5B) {
            //console.log(seed);
            let rng = new XoroShiro(seed);
            //console.log(long.fromString(seed, 16).toString(10));
            let result:Frame = new Frame(this._initialFrame + frame);
            //rng.nextInt('-1', '-1');
            await rng.nextInt(`0xffffffff`, `0xffffffff`);
            //rng.nextInt(0xffffffff, 0xffffffff);
            //let sidtid:String = await rng.nextInt('-1', '-1');
            let sidtid:string = await rng.nextInt(`0xffffffff`, `0xffffffff`);
            //let sidtid:number = rng.nextInt(0xffffffff, 0xffffffff);
            //let pid:String = rng.nextInt('-1', '-1');
            let pid:string = await rng.nextInt(`0xffffffff`, `0xffffffff`);
            //let pid:number = rng.nextInt(0xffffffff, 0xffffffff);

            //console.log(`sidtid: ${sidtid}`);
            //console.log(`pid: ${pid}`);

            //console.log(long.fromString(sidtid, 16).toString(10));
            //console.log(long.fromString(pid, 16).toString(10));
            if (this._shinyType == 0) { // Random shiny
                console.log(`sidtid: ${sidtid}`);
                console.log(`pid: ${pid}`);
                if (await this._getShinyValue(sidtid) == await this._getShinyValue(pid)) { /* Force shiny */ result.shiny = parseInt(await this._getShinyType(sidtid, pid)) }
                else { /* Force non shiny */ result.shiny = 0 }
            }
        
            else { /* Force shiny */ result.shiny = 2 }

            if (!filter.compareShiny(result)) { continue }

            for (let i:number = 0; i < this._ivCount;) {
                let index:number = parseInt(await rng.nextInt('0x6', '0x7'));
                if (result.getIV(index) == 0) { result.setIV(index, 31); i++; }
            }

            for (let i:number = 0; i < 6; i++) { if (result.getIV(i) == 0) { result.setIV(i, parseInt(await rng.nextInt('0x1F'))) } }

            if (this._abilityType == 4) { /* Allow hidden ability */ result.ability = await parseInt(await rng.nextInt('0x3', '0x3')) }
            else if (this._abilityType == 3) { /* No hidden ability */ result.ability = parseInt(await rng.nextInt('0x1')) }
            else { /* Locked ability*/ result.ability = this._abilityType }

            if (this._genderType == 0) {
                // Random
                if (this._genderRatio == 255) { /* Genderless */ result.gender = 2 }
                else if (this._genderRatio == 254) { /* Female */ result.gender = 1 }
                else if (this._genderRatio == 0) { /* Male */ result.gender = 0 }
                else { result.gender = parseInt(await rng.nextInt('0xFD', '0xFF')) + 1 < this._genderRatio ? 1 : 0 }
            }
      
            else if (this._genderType == 1) { /* Male */ result.gender = 0 }
            else if (this._genderType == 2) { /* Female */ result.gender = 1 }
            else { /* Genderless */ result.gender = 2 }

            if (this._species != 849) { result.nature = parseInt(await rng.nextInt('0x19', '0x1F')) }
            else {
                if (this._altform == 0) { result.nature = toxtricityAmpedNatures[parseInt(await rng.nextInt('0xD', '0xF'))] }
                else { result.nature = toxtricityLowKeyNatures[parseInt(await rng.nextInt('0xC', '0xF'))] }
            }

            if (filter.compareFrame(result)) { frames.push(result) }
        }

        return frames;
    }
}
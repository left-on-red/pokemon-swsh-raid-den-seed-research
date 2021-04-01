//import { readFileSync } from 'fs';

import { PersonalInfo } from './PersonalInfo';


export class PersonalLoader {
    static _info:Array<PersonalInfo> = [];
    static async init() {
        let readFileSync = require('fs').readFileSync;
        let data = readFileSync('./data/personal_swsh');
        for (let i:number = 0; i < data.length; i+= 168) {
            let stats:Array<number> = [
                data.readUInt8(i),
                data.readUInt8(i + 1),
                data.readUInt8(i + 2),
                data.readUInt8(i + 4),
                data.readUInt8(i + 5),
                data.readUInt8(i + 3),
            ];

            let genderRatio:number = data.readUInt8(i + 18);
            let ability1:number = data.readUInt16LE(i + 24);
            let ability2:number = data.readUInt16LE(i + 26);
            let abilityH:number = data.readUInt16LE(i + 28);
            let formStatIndex:number = data.readUInt16LE(i + 30);
            let formCount:number = data.readUInt8(i + 32);
            let included:Boolean = ((data.readUInt8(i + 33) >> 6) & 1) == 1;

            PersonalLoader._info.push(new PersonalInfo(stats, genderRatio, ability1, ability2, abilityH, formCount, formStatIndex, included));
        }
    }

    static getInfo(species:number, form:number):PersonalInfo {
        let base = this._info[species];
        if (form == 0 || base.formStatIndex == 0) { return base }
        return this._info[base.formStatIndex + form - 1];
    }
}
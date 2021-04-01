import { PersonalLoader } from './PersonalLoader';
import { DenLoader } from './DenLoader';
import { Translator } from './Translator';
import { Den } from './Den';
import { Game } from './Game';
import { Raid } from './Raid';
import { RaidGenerator } from './RaidGenerator';
import { FrameFilter } from './FrameFilter';
import { Frame } from './Frame';
import * as pyshell from 'python-shell';

Translator.init();
PersonalLoader.init();
DenLoader.init();

let den = DenLoader.getDen(0, 0);
//let raids = den!.getRaids(Game.Sword);
//for (let r = 0; r < raids.length; r++) { console.log(Translator.getSpecie(raids[r].species)) }

//console.log(den.getRaids(Game.Sword));

let raid = den!.getRaid(0, Game.Sword);
let gen = new RaidGenerator(1, 10, raid);

async function start() {
    let filter:FrameFilter = new FrameFilter([-1, -1, -1, -1, -1, -1], [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true], -1, -1, -1, false);
    let frames:Array<Frame> = await gen.generate(filter, '0x1');

    let arr = [];

    //console.log(raid.species);
    //console.log(Translator.getSpecie(raid.species));
    //console.log(raid.gmax);


    for (let f = 0; f < frames.length; f++) {
        let toAdd = {
            frame: frames[f].frame,
            gender: frames[f].gender == 0 ? 'male' : 'female',
            ability: frames[f].ability,
            IVs: `${frames[f].getIV(0)}, ${frames[f].getIV(1)}, ${frames[f].getIV(2)}, ${frames[f].getIV(3)}, ${frames[f].getIV(4)}, ${frames[f].getIV(5)}`,
            shiny: frames[f].shiny
        }

        arr.push(toAdd);
        //console.log(`${frames[i].frame} ${frames[i].shiny}`);

    }

    console.table(arr);

    //console.log(frames[0].getIV(0));

    //console.table(arr, ['frame', 'gender', 'ability', 'IVs', 'shiny']);
    //gen.generate()
}

start();
import * as fs from 'fs';

export class Translator {
    static _abilities:Array<String>;
    static _characteristics:Array<String>;
    static _locations:Array<String>;
    static _natures:Array<String>;
    static _species:Array<String>;

    static init() {
        let locale:String = 'en';

        Translator._abilities = fs.readFileSync(`./data/abilities/abilities_${locale}.txt`, 'utf8').split('\n');
        Translator._characteristics = fs.readFileSync(`./data/characteristics/characteristics_${locale}.txt`, 'utf8').split('\n');
        Translator._locations = fs.readFileSync(`./data/locations/locations_${locale}.txt`, 'utf8').split('\n');
        Translator._natures = fs.readFileSync(`./data/natures/natures_${locale}.txt`, 'utf8').split('\n');
        Translator._species = fs.readFileSync(`./data/species/species_${locale}.txt`, 'utf8').split('\n');
    }

    static getAbility(index:number):String { return Translator._abilities[index-1] }

    static getCharacteristics():Array<String> { return Translator._characteristics }
    
    static getLocation(index:number):String { return Translator._locations[index-1] }
    
    static getSpecie(index:number):String { return Translator._species[index-1] }
    
    static getNatures():Array<String> { return Translator._natures }

    static getNature(index:number):String { return Translator._natures[index-1] }
}

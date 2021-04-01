let long = require('long');

import { PythonShell } from 'python-shell';
let pyshell = PythonShell;

function getPy(path, args):Promise<string> {
    return new Promise(function(resolve, reject) {
        let options = {
            args: args
        }

        pyshell.run(path, options, function(error, results) {
            if (error) {
                console.log(`xor ${path}: ${args.join(', ')}`)
                //reject(error);
            }
            else { resolve(results[0]) }
        });
    });
}

export class XoroShiro {
    _state:Array<string> = [];
    constructor(seed:string) {
        this._state[0] = seed;
        this._state[1] = `0x82A2B175229D6A5B`;
        console.log(this._state);
    }

    public async setSeed(seed:string):Promise<void> {
        this._state[0] = seed;
        this._state[1] = `0x82A2B175229D6A5B`;
    }

    private async _rotl(x:string, k:string, mask:string):Promise<string> {
        //console.log(long.fromString(x, 16).toString(10));
        //console.log(long.fromString(k, 16).toString(10));
        //console.log(long.fromString(mask, 16).toString(10));

        //let high = long.fromString(x, 16).shiftLeft(long.fromString(k, 16)).toString(16);
        let high = await getPy(`./python/getHigh.py`, [x, k]);
        //let high = x << k;

        //let low = long.fromString(x, 16);
        let low = await getPy(`./python/getLow.py`, [x, k, mask]);
        //low = low.shiftRight(long.fromString('64').sub(k));
        //low = low.and(long.fromString(mask, 16)).toString(16);

        return await getPy(`./python/getOR.py`, [high, low]);
        //let low = (x >> (64 - k)) & mask;
        //return long.fromString(high, 16).or(long.fromString(low, 16)).toString(16);
        //return high | low;
    }

    private async _next():Promise<string> {
        let s0 = this._state[0];
        let s1 = this._state[1];

        console.log(`s0: ${s0}`);
        console.log(`s1: ${s1}`);

        let result = await getPy(`./python/getAdd.py`, [s0, s1]);

        //console.log(long.fromString(s0, 16).toString(10));
        //console.log(long.fromString(s1, 16).toString(10));

        //console.log(long.fromString(result, 16).toString(10));

        //s1 = long.fromString(s1, 16).xor(s0).toString(16);
        s1 = await getPy(`./python/getXOR.py`, [s1, s0]);
        //s1 ^= s0;

        //console.log(long.fromString(s1).toString(10));

        //let rotl1 = await this._rotl(s0, '24', '0xffffff');
        //rotl1 = await getPy(`./../`)

        let rotl = await this._rotl(s0, '24', '0xffffff');

        this._state[0] = await getPy('./python/getRotl.py', [rotl, s1]);
        this._state[1] = await this._rotl(s1, '37', '0x1fffffffff');

        //this._state[0] = long.fromString(this._rotl(s0, '24', 'ffffff'), 16).xor(long.fromString(s1, 16)).xor(long.fromString(s1, 16).shiftLeft(16)).toString(16);
        //this._state[1] = long.fromString(this._rotl(s0, '37', '1fffffffff'), 16).toString(16);

        //this._state[0] = this._rotl(s0, 24, 0xffffff) ^ s1 ^ (s1 << 16);
        //this._state[1] = this._rotl(s1, 37, 0x1fffffffff);
        
        return result;
    }

    public async nextInt(thresh:string, mask?:string):Promise<string> {
        console.log(`thresh: ${parseInt(thresh, 16)}`);
        console.log(`mask: ${parseInt(mask, 16)}`);
        let n = await this._next();
        let result = await getPy(`./python/getAND.py`, [n, thresh]);
        //console.log(`test`, await getPy(`./python/getAND.py`, [n, thresh]))
        if (!mask) {
            //return long.fromString(this._next(), 16).and(long.fromString(thresh, 16).toString()).toString(16);
            return result;
            //return this._next() & thresh;
        }

        //let result = long.fromString(this._next(), 16).and(long.fromString(mask, 16).toString()).toString(16);
        //let result = this._next() & mask;

        //console.log(`r: ${await getPy(`./python/getGe.py`, [result, thresh])}`)
        while(await getPy(`./python/getGe.py`, [result, thresh]) == 'True') {
        //while (long.fromString(result, 16).ge(long.fromString(thresh, 16))) {
            n = await this._next();
            result = await getPy(`./python/getAND.py`, [n, mask]);
            //console.log(`result: ${result}`);
            //return long.fromString(this._next(), 16).and(long.fromString(mask, 16)).toString(16);
            //result = this._next() & mask;
        }

        return result;
    }
}
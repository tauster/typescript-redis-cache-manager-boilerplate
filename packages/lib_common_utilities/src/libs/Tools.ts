
import * as Util from "util";
import _ from "lodash";
import { LoDashStatic } from "lodash";
import semver from "semver";
import { v4 as uuidV4 } from 'uuid';

/**
 * General JS tools that can be shared across the stack
 */
export class Tools {

    /**
     * Pass along node.js's util so it's only imported once
     * 
     * @returns {any}
     */
    public static get util():any {
        return Util;
    }


    /**
     * Format string with any number of arguments (works as util.format does)
     *
     * @param {string} msg
     * @param {any[]} args
     * @returns {string}
     */
    public static utilFormat(msg:string, ...args:any[]): string {

        // if args are not defined, instantiate empty array for use
        if (Tools._.isUndefined(args))
            args = [];

        // add message to beginning of array
        args.unshift(msg);

        // pass args as array to util.format function
        return Util.format(args);
    }


    /**
     * Pass along lodash
     * 
     * @returns {LoDashStatic}
     */
    public static get _():LoDashStatic {
        return _;
    }


    /**
     * Pass along lodash
     * 
     * @returns {any}
     */
    public static get semver():any {
        return semver;
    }


    /**
     * Returns a uuidV4 string
     * 
     * @returns {string}
     */
    public static generateUuidV4():string {
        return uuidV4();
    }


    /**
     * Returns an encryption key string with length given 
     * 
     * @param {number} length
     * @returns {string}
     */
    public static generateEncryptionKey(length:number):string {

        // placeholder for the final result
        let result:string = '';

        // allowable characters within the encryption key
        let allowableCharacters:string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-+';
        let allowableCharactersLength:number = allowableCharacters.length;

        // develop the encryption key and return it
        for (let i:number = 0; i < length; i++) {
            result += allowableCharacters.charAt(Math.floor(Math.random() * allowableCharactersLength));
        }
        return result;
    }


    /**
     * Generates an array linearly spaced between the start and 
     * end values, spaced by the given "n" value
     * 
     * @param {number} start
     * @param {number} end
     * @param {number} n
     * @returns {number[]}
     */
    public static numericLinSpace(start:number, end:number, n:number):number[] {

        // based on following algorithm:
        // https://stackoverflow.com/questions/40475155/does-javascript-have-a-method-that-returns-an-array-of-numbers-based-on-start-s
        
        // placeholder for the linSpace array
        let arr:number[] = [];

        // attempt to create linSpace, try/catch to avoid numeric operation errors
        try {
            // the value used to linearly space to meet the given "n"
            let step:number = (end - start) / (n - 1);
    
            // push each incremented value into the placeholder array
            for (let i:number = 0; i < n; i++) {
                arr.push(start + (step * i));
            }

            // return the numeric linSpace array
            return arr;
        }
        // if an error occurs, return an empty array
        catch (err) {
            return [];
        }
    }


    /**
     * Rounds a number to given "n" decimal places
     * @param { number } num
     * @param { number } n
     * @returns { number }
     */
    public static roundNumberToNDecimalPlaces(num:number, n:number):number {
        return Math.round((num + Number.EPSILON) * Math.pow(10, n)) / Math.pow(10, n);
    }
}
import { Tools } from "./Tools";

export class VariableTypeResolver {

    /**
     * Checks if given variable is string or not. If it is
     * return it otherwise return null for everything else.
     * 
     * @param {any} valueToCheck
     * @returns {string}
     */
    public static checkIfStringFromAny(valueToCheck:any):string {
        if (Tools._.isUndefined(valueToCheck) === false) {
            if (Tools._.isString(valueToCheck) === true) {
                return <string>valueToCheck;
            }
            else {
                return <any>null;
            }
        }
        else {
            return <any>null;
        }
    }


    /**
     * Parses to integer (number) representation based on 
     * given any value. Will return null if not resolvable.
     * Accepts potential undefined values to resolve as null.
     * 
     * @param {any} valueToParse
     * @returns {number}
     */
    public static resolveToIntegerFromAny(valueToParse:any):number {
        if (Tools._.isNaN(parseInt(valueToParse)) === false) {
            return parseInt(valueToParse);
        }
        else {
            return <any>null;
        }
    }


    /**
     * Parses to float/double (number) representation based on 
     * given any value. Will return null if not resolvable.
     * Accepts potential undefined values to resolve as null.
     * 
     * @param {any} valueToParse
     * @returns {number}
     */
    public static resolveToFloatFromAny(valueToParse:any):number {
        if (Tools._.isNaN(parseFloat(valueToParse)) === false) {
            return parseFloat(valueToParse);
        }
        else {
            return <any>null;
        }
    }


    /**
     * Parses to boolean representation based on given any value.
     * Will return null if not resolvable. Accepts potential
     * undefined values to resolve as null.
     * 
     * @param {any} valueToParse
     * @returns {boolean}
     */
    public static resolveToBooleanFromAny(valueToParse:any):boolean {
        switch (valueToParse) {
            case "false":
            case "False":
            case "FALSE":
            case "0":
            case 0:
                return false;
            case "true":
            case "True":
            case "TRUE":
            case "1":
            case 1:
                return true;
            default:
                return <any>null;
        }
    }


    /**
     * Parses to number array if all the values are numbers. Returns 
     * null otherwise.
     * 
     * @param {any} valueToParse
     * @returns {number[]}
     */
    public static resolveToNumberArrayFromAny(valueToParse:any):number[] {
        if (Array.isArray(valueToParse) === true) {
            if ((<any[]>(valueToParse)).some(isNaN) === false) {
                return <number[]>valueToParse
            }
            else {
                return <any>null;
            }
        }
        else {
            return <any>null;
        }
    }


    /**
     * Parses to string array if all the values are strings. Returns 
     * null otherwise.
     * 
     * @param {any} valueToParse
     * @returns {string[]}
     */
    public static resolveToStringArrayFromAny(valueToParse:any):string[] {
        if (Array.isArray(valueToParse) === true) {
            if ((<any[]>valueToParse).every(i => (typeof i === "string")) === true) {
                return <string[]>valueToParse;
            }
            else {
                return <any>null;
            }
        }
        else {
            return <any>null;
        }
    }
}
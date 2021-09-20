import { EEnvironmentType, EnvironmentTypeHelpers } from "./Environment";
import { Tools } from "./Tools";
import { DateHelpers } from "./DateHelpers";

export class ConsoleLogger {

    /**
     * Logger meant to be used for development builds only for debugging purposes
     * 
     * @param { string } message
     * @param { any[] } optionalParams
     */
    public static debug(message?: any, ...optionalParams:any[]):void {
        if (EnvironmentTypeHelpers.resolveStringToEnum(process.env.NODE_ENV!) === EEnvironmentType.Development ||
            EnvironmentTypeHelpers.resolveStringToEnum(process.env.NODE_ENV!) === EEnvironmentType.DevelopmentLocal ||
            ConsoleLogger.isDebugFlagGiven() === true) {

            if (Tools._.isUndefined(message) === false) {
                console.log(`\x1b[1m${ DateHelpers.getFormattedTimeWithSecondsString(new Date()) } >> DEBUG >>\x1b[0m\x1b[32m ${ message }\x1b[0m`, ...optionalParams);
            }
            else {
                console.log(...optionalParams);
            }
        }
    }

    /**
     * Generic logger
     * 
     * @param { string } message
     * @param { any[] } optionalParams
     */
    public static log(message?: any, ...optionalParams:any[]):void{
        if (Tools._.isUndefined(message) === false) {
            console.log(`\x1b[1m${ DateHelpers.getFormattedTimeWithSecondsString(new Date()) } >>\x1b[0m ${ message }`, ...optionalParams);
        }
        else {
            console.log(...optionalParams);
        }
    }

    /**
     * Logs info using console logger
     * 
     * @param { string } message
     * @param { any[] } optionalParams
     */
    public static info(message?: any, ...optionalParams:any[]):void{
        if (Tools._.isUndefined(message) === false) {
            console.info(`\x1b[1m${ DateHelpers.getFormattedTimeWithSecondsString(new Date()) } >>\x1b[0m\x1b[36m ${ message }\x1b[0m`, ...optionalParams);
        }
        else {
            console.info(...optionalParams);
        }
    }
    
    /**
     * Logs warnings using console logger
     * 
     * @param { string } message
     * @param { any[] } optionalParams
     */
    public static warn(message?: any, ...optionalParams:any[]):void{
        if (Tools._.isUndefined(message) === false) {
            console.warn(`\x1b[1m${ DateHelpers.getFormattedTimeWithSecondsString(new Date()) } >>\x1b[0m\x1b[33m ${ message }\x1b[0m`, ...optionalParams);
        }
        else {
            console.warn(...optionalParams);
        }
    }
    
    /**
     * Logs errors using console logger
     * 
     * @param { string } message
     * @param { any[] } optionalParams
     */
    public static error(message?: any, ...optionalParams:any[]):void{
        if (Tools._.isUndefined(message) === false) {
            console.error(`\x1b[1m${ DateHelpers.getFormattedTimeWithSecondsString(new Date()) } >>\x1b[0m\x1b[31m ${ message }\x1b[0m`, ...optionalParams);
        }
        else {
            console.error(...optionalParams);
        }
    }

    /**
     * Checks the node runtime environment variables if the
     * forced debug logging flag is provided
     * 
     * @returns { any }
     */
    private static isDebugFlagGiven():boolean {
        
        // check if the flag is available or not
        if (Tools._.isUndefined(process.env.FORCE_DEBUG_LOG!) === false) {

            // check whether it's string value is true or not, it so return true
            if (process.env.FORCE_DEBUG_LOG! === "true") {
                return true;
            }
            // otherwise return false
            else {
                return false;
            }
        }
        // otherwise return false
        else {
            return false;
        }
    }
}
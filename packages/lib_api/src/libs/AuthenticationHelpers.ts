import { ECognitoExpressTokenUse } from "../types/CognitoExpressTypes";
import { ESystem } from "../types/SystemTypes";
import { EAuthorizationAccessLevel } from "../types/AuthorizationTypes";

export class AuthenticationHelpers {

    /**
     * Checks whether the auth header is valid or not
     * 
     * @param {string} authHeader
     * @returns {boolean}
     */
    public static isAuthHeaderValid(authHeader:string):boolean {
        
        // check if the correct header is in place
        /**
         * Redacted
         */
        return true;
    }


    /**
     * Extracts the auth token from the header
     * 
     * @param {string} authHeader
     * @returns {string}
     */
    public static getAuthTokenFromHeader(authHeader:string):string {

        let tokenFromClient:string = "";

        /**
         * Redacted
         */

        return tokenFromClient;
    }


    /**
     * Gets the token use type from the auth header
     * 
     * @param {string} authHeader
     * @returns {ECognitoExpressTokenUse}
     */
    public static getTokenUseFromAuthHeader(authHeader:string):ECognitoExpressTokenUse {

        /**
         * Redacted
         */

        return ECognitoExpressTokenUse.None;
    }


    /**
     * Gets the token use type from the auth header
     * 
     * @param {string} authHeader
     * @returns {EAuthorizationAccessLevel}
     */
    public static getAccessLevelFromAuthHeader(authHeader:string):EAuthorizationAccessLevel {

        /**
         * Redacted
         */

        return EAuthorizationAccessLevel.None;
    }


    /**
     * Gets the token system type from the auth header
     * 
     * @param {string} authHeader
     * @returns {ESystem}
     */
    public static getTokenSystemFromAuthHeader(authHeader:string):ESystem {

        /**
         * Redacted
         */

        return ESystem.None;
    }


    /**
     * Generates an auth header string given the required parameters
     * 
     * @param {ESystem} systemAuthOrigin
     * @param {EAuthorizationAccessLevel} accessLevel 
     * @param {string} authToken 
     * @returns {string}
     */
    public static generateAuthHeader(systemAuthOrigin:ESystem, accessLevel:EAuthorizationAccessLevel, authToken:string):string {
        
        /**
         * Redacted
         */
        
        return "";
    }
}
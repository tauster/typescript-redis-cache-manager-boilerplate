import { ECognitoExpressTokenUse, ICognitoExpressConfig } from "../types/CognitoExpressTypes";
import { EAWSRegion } from "@cache_manager/lib_common_utilities/types/AWSTypes";
import { CognitoUserPool } from 'amazon-cognito-identity-js';

const CognitoExpress = require("cognito-express");

export class CognitoHelpers {

    /**
     * Performs validate method on a given cognitoExpress object as a promise
     * to allow async/await
     * 
     * @param {any} cognitoExpress
     * @param {string} idTokenFromClient
     * @return {Promise<any>}
     */
    public static async cognitoExpressValidatePromisified(cognitoExpress:any, idTokenFromClient:string):Promise<any> {
        return new Promise((resolve, reject) => {
            cognitoExpress.validate(idTokenFromClient, (err?:Error|undefined, result?:any):void => {
        
                // err will be defined if request is not authenticated 
                if (err) {
                    reject(err);
                    return;
                }
                // otherwise validation successful, return the results
                resolve(result);
            });
        });
    }


    /**
     * Gets a new instance of the cognitoExpress object
     * 
     * @param {ECognitoExpressTokenUse} tokenUse
     * @returns {any}
     */
    public static getCognitoExpress(awsRegion:EAWSRegion, awsCognitoUserPoolId:string, tokenUse:ECognitoExpressTokenUse, tokenExpiration:number):any {
        return new CognitoExpress(<ICognitoExpressConfig>{
            region: awsRegion,
            cognitoUserPoolId: awsCognitoUserPoolId,
            tokenUse: tokenUse,
            tokenExpiration: tokenExpiration
        });
    }


    /**
     * Gets the user pool object for the given user pool id
     * and app client id
     * 
     * @param {string} cognitoUserPoolId
     * @param {string} cognitoAppClientId
     * @returns {CognitoUserPool}
     */
    public static getUserPool(cognitoUserPoolId:string, cognitoAppClientId:string):CognitoUserPool {
        return new CognitoUserPool({
            UserPoolId: cognitoUserPoolId,
            ClientId: cognitoAppClientId
        });
    }
}
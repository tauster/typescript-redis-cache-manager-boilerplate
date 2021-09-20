import { EAWSRegion } from "@cache_manager/lib_common_utilities/types/AWSTypes";

/**
 * Enum of all types of cognitoExpress tokens
 * that can be accessed
 */
export enum ECognitoExpressTokenUse {
    Access = "access",
    Id = "id",
    Admin = "admin",
    None = "none"
}

/**
 * Interface of cognitoExpress config parameters 
 */
export interface ICognitoExpressConfig {
    region:EAWSRegion;
    cognitoUserPoolId:string;
    tokenUse:ECognitoExpressTokenUse;
    tokenExpiration:number;
}
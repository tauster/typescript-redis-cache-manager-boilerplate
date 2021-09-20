import { EEnvironmentType } from "@cache_manager/lib_common_utilities/libs/Environment";
import { EAWSRegion } from "@cache_manager/lib_common_utilities/types/AWSTypes";

/**
 * Interface of all AuthenticatorConfig parameters
 */
export interface IAuthenticatorConfig {
    cacheManagerAuthToken:string;
    websocketAuthToken:string;

    runtimeEnv:EEnvironmentType;

    runtimeAuthToken:string;
    runtimeEmail:string;

    awsRegion:EAWSRegion;
    awsCognitoUserPoolId:string;
    awsTokenExpiration:number;

    cacheItemExpirationMs:number

    pgUser:string;
    pgPassword:string;
    pgHost:string;
}
import { Response, NextFunction } from 'express';
import { IAuthenticatorConfig } from '../types/AuthenticatorTypes';
import { IAuthenticatedRequest } from '../types/HeaderTypes';
import { ECognitoExpressTokenUse } from '../types/CognitoExpressTypes';
import { AuthenticationHelpers } from './AuthenticationHelpers';
import { EWebsocketDataOrigin } from '../types/WebsocketTypes';
import { ESystem } from '../types/SystemTypes';
import { EUserGroup } from '@cache_manager/lib_common_utilities/types/UserTypes';
import { PostgresDbHelpers } from '@cache_manager/lib_database/libs/PostgresDbHelpers';
import {
    EPostgresDbNames,
    PostgresDbTableRowTypes,
    EPostgresDbTableNames
} from '@cache_manager/lib_database/types/PostgresDbTableTypes';
import { IUserBaseRow } from '@cache_manager/lib_database/types/UsersDbTypes';
import { IErrorResponse } from '../types/APIResponseTypes';
import { CognitoHelpers } from '../libs/CognitoHelpers';
import { EnvironmentTypeHelpers } from '@cache_manager/lib_common_utilities/libs/Environment';
import { Tools } from '@cache_manager/lib_common_utilities/libs/Tools';
import { CacheClient } from '@cache_manager/lib_cache/libs/CacheClient';
import { ECacheObjectKey } from '@cache_manager/lib_cache/types/CacheDbTypes';

export class Authenticator {

    // static placeholder for this authenticator instance's config parameters
    private static authenticatorConfig:IAuthenticatorConfig = <any>null;

    /**
     * Initializes the Authenticator processes
     * 
     * @param { IAuthenticatorConfig } authenticatorConfig
     */
    public static initialize(authenticatorConfig:IAuthenticatorConfig):void {
        Authenticator.authenticatorConfig = authenticatorConfig;
    }


    /**
     * Middleware validates requests for routes that requires authentication.
     * Requires an Id Token for the Authorization header of the request
     * with a leading "Bearer " header
     * 
     * @param { IAuthenticatedRequest } request
     * @param { Response } response
     * @param { NextFunction } next
     * @returns { Promise<any> }
     */
    public static async validateAuthentication(request:IAuthenticatedRequest, response:Response, next:NextFunction):Promise<any> {

        // check that the authenticator config is set
        if (Tools._.isNull(Authenticator.authenticatorConfig) === false) {

            /**
             * Redacted
            */

            return next();
        }
        // otherwise handle no authenticator configuration
        else {
            return response.status(403).json({ error: "Authenticator was not initialized." });
        }
    }


    /**
     * Middleware validates request is coming from an admin user group
     * or not. If it is, pass to next function, otherwise return 403.
     * Must be used AFTER authentication validation
     * 
     * @param { IAuthenticatedRequest } request
     * @param { Response } response
     * @param { NextFunction } next
     * @returns { Promise<any> }
     */
    public static async validateAdminUserGroup(request:IAuthenticatedRequest, response:Response, next:NextFunction):Promise<any> {

        // check if authenticated request user group is an admin or not, if so pass along into the next function
        if (request.userGroup === EUserGroup.Admin) {
            next();
        }
        // otherwise return unauthorized response
        else {
            return response.status(403).json(<IErrorResponse>{ error: "Unauthorized. User does not have access to this route." });
        }
    }


    /**
     * Gets the user id given the user's email
     * 
     * @param { string } email
     * @returns { Promise<string> }
     */
    public static async getUserIdFromEmail(email:string):Promise<string> {

        // check that the authenticator config is set
        if (Tools._.isNull(Authenticator.authenticatorConfig) === false) {

            try {
                // attempt to get the user id of the given user email
                let userBaseRowFromId:PostgresDbTableRowTypes[] = await PostgresDbHelpers.getRowsWhereColumnEqualsValue(
                    PostgresDbHelpers.getDbClientInstance(
                        Authenticator.authenticatorConfig.pgUser,
                        Authenticator.authenticatorConfig.pgPassword,
                        Authenticator.authenticatorConfig.pgHost,
                        EPostgresDbNames.Users
                    ),
                    EPostgresDbTableNames.UserBase,
                    "email",
                    email
                );
    
                // if a user base row was returned, then return it's user id
                if (userBaseRowFromId.length > 0) {
                    return (<IUserBaseRow>userBaseRowFromId[0]).user_id;
                }
                // otherwise return default none
                else {
                    return <any>null;
                }
            }
            // catch errors and return default none
            catch (err) {
                return <any>null;
            }
        }
        // otherwise return null
        else {
            return <any>null;
        }
    }


    /**
     * Gets the user group given the user's id
     * 
     * @param { string } userId
     * @returns { Promise<EUserGroup> }
     */
    private static async getUserGroupFromUserId(userId:string):Promise<EUserGroup> {

        // check that the authenticator config is set
        if (Tools._.isNull(Authenticator.authenticatorConfig) === false) {

            try {
                // attempt to get the user base of the given user id
                let userBaseRowFromId:PostgresDbTableRowTypes[] = await PostgresDbHelpers.getRowsWhereColumnEqualsValue(
                    PostgresDbHelpers.getDbClientInstance(
                        Authenticator.authenticatorConfig.pgUser,
                        Authenticator.authenticatorConfig.pgPassword,
                        Authenticator.authenticatorConfig.pgHost,
                        EPostgresDbNames.Users
                    ),
                    EPostgresDbTableNames.UserBase,
                    "user_id",
                    userId
                );
    
                // if a user base row was returned, then return it's user group
                if (userBaseRowFromId.length > 0) {
                    return (<IUserBaseRow>userBaseRowFromId[0]).user_group;
                }
                // otherwise return default none
                else {
                    return EUserGroup.None;
                }
            }
            // catch errors and return default none
            catch (err) {
                return EUserGroup.None;
            }
        }
        // otherwise return none
        else {
            return EUserGroup.None
        }
    }
}
import { Request } from 'express';
import { EUserGroup } from '@cache_manager/lib_common_utilities/types/UserTypes';

/**
 * Interface of an authenticate request with 
 * additional parameters from the extended Request
 */
export interface IAuthenticatedRequest extends Request {
    systemAdmin?:boolean;
    userId?:string;
    userGroup?:EUserGroup;
}
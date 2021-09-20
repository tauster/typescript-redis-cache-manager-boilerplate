import { ELogSystemOrigin } from "@cache_manager/lib_database/types/LogsDbTableTypes";

/**
 * Interface of a LogSystemError request
 */
export interface ILogSystemErrorRequest {
    epochTs:number;
    systemOrigin:ELogSystemOrigin;
    systemLocation:string;
    errorName:string;
    errorDetails:string;
    metaData?:any;
    errorLockTimeoutMs?:number;
}

/**
 * Interface of a ClearLogSystemErrorLock request
 */
export interface IClearLogSystemErrorLockRequest {
    errorName:string;
}


/**
 * Type of all API requests
 */
export type ApiRequest = ILogSystemErrorRequest |
    IClearLogSystemErrorLockRequest;
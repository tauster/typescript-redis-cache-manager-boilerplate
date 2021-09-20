import axios, { AxiosResponse } from 'axios';
import { RestApiHelpers } from '@cache_manager/lib_api/libs/RestApiHelpers';
import { Config } from '../Config';
import { ILogSystemErrorRequest } from '@cache_manager/lib_api/types/APIRequestTypes';
import { ELogSystemOrigin } from '@cache_manager/lib_database/types/LogsDbTableTypes';
import { ConsoleLogger } from '@cache_manager/lib_common_utilities/libs/ConsoleLogger';

export class ErrorLogger {

    /**
     * Logs system errors
     * 
     * @param { string } systemLocation
     * @param { string } errorName
     * @param { string } errorDetails
     * @param { number } errorLockTimeoutMs
     */
    public static async logSystemError(systemLocation:string, errorName:string, errorDetails:string, errorLockTimeoutMs:number):Promise<void> {

        try {

            // attempt to log error
            let logSystemErrorResponse:AxiosResponse = await axios(
                RestApiHelpers.getPOSTRequestOptions(
                    "/logs/system/error",
                    Config.restDbStaticServerHost,
                    <ILogSystemErrorRequest>{
                        epochTs: Date.now(),
                        systemOrigin: ELogSystemOrigin.Database_CacheManager,
                        systemLocation: systemLocation,
                        errorName:errorName,
                        errorDetails:errorDetails,
                        errorLockTimeoutMs:errorLockTimeoutMs
                    }
                )
            );
        }
        catch (err) {
            ConsoleLogger.debug(`ErrorLogger.logSystemError: Failed to log error: ${ err }`);
        }
    }
}
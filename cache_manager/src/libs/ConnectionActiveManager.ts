import { CacheClient } from "@cache_manager/lib_cache/libs/CacheClient";
import { ECacheObjectKey } from "@cache_manager/lib_cache/types/CacheDbTypes";
import { ConsoleLogger } from "@cache_manager/lib_common_utilities/libs/ConsoleLogger";
import { Tools } from "@cache_manager/lib_common_utilities/libs/Tools";
import { Config } from "../Config";

export class ConnectionActiveManager {

    // placeholder for the connection active status check in timeout
    private static cacheManagerActiveStatusCheckInTimeout:any = null;


    /**
     * Initializes the ConnectionActiveManager
     */
    public static initialize():void {

        // shutdown a previous instance is one is active
        ConnectionActiveManager.shutdown();

        // restart a new instance of the connection manager active status check in process
        ConnectionActiveManager.cacheManagerActiveStatusCheckInTimeout = setTimeout(ConnectionActiveManager.applyCacheManagerActiveStatusIntoCacheServer, Config.cacheManagerActiveTimeoutTimerMs);
    }


    /**
     * Shuts down the ConnectionActiveManager
     */
    public static shutdown():void {

        // check if there is a timeout in place first
        if (Tools._.isNull(ConnectionActiveManager.cacheManagerActiveStatusCheckInTimeout) === false) {

            // clear the timeout and set the timeout placeholder to null 
            clearTimeout(ConnectionActiveManager.cacheManagerActiveStatusCheckInTimeout);
            ConnectionActiveManager.cacheManagerActiveStatusCheckInTimeout = null;
        }
    }


    /**
     * Applies a check in key/value to the cache server with 
     * a Config determined expiry time.
     * 
     * This would allow the REST API to check if the cache 
     * manager is alive or not before pushing new set of data
     */
    private static async applyCacheManagerActiveStatusIntoCacheServer():Promise<void> {

        // check in the active key/value with its own exp time which is more than the timeout time to ensure there's no overlap and the
        // active key/value pair doesn't disappear for a split second when it is in fact still active
        let setItemStatus:boolean = await CacheClient.setItem(ECacheObjectKey.CacheManagerActive, true, Config.cacheManagerActiveExpirationMs);

        ConsoleLogger.debug(`ConnectionActiveManager: Checked in active status: ${ setItemStatus }`);

        // instantiate the next check in timeout
        ConnectionActiveManager.cacheManagerActiveStatusCheckInTimeout = setTimeout(ConnectionActiveManager.applyCacheManagerActiveStatusIntoCacheServer, Config.cacheManagerActiveTimeoutTimerMs);
    }
}
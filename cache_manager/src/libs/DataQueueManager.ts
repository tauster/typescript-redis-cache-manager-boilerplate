import { IWebsocketDatabaseLoggingSettings } from "@cache_manager/lib_api/types/WebsocketTypes";
import { Tools } from "@cache_manager/lib_common_utilities/libs/Tools";
import { Config } from "../Config";
import { CacheClient } from '@cache_manager/lib_cache/libs/CacheClient';
import { ECacheObjectKey } from "@cache_manager/lib_cache/types/CacheDbTypes";
import { ConsoleLogger } from "@cache_manager/lib_common_utilities/libs/ConsoleLogger";
import { ExternalSettingsTools } from "./ExternalSettingsTools";
import { PostgresDbHelpers } from "../../../../packages/lib_database/src/libs/PostgresDbHelpers";

export class DataQueueManager {

    // placeholder for the queue manager timeout
    private static queueManagerTimeout:any = null;


    /**
     * Initialize the startup processes
     */
    public static initialize():void {

        // check if there is a queue timeout running already, if so clear it before starting a new one
        if (Tools._.isNull(DataQueueManager.queueManagerTimeout) === false) {
            clearTimeout(DataQueueManager.queueManagerTimeout);
        }

        // instantiate the queue manager timeout
        DataQueueManager.queueManagerTimeout = setTimeout(DataQueueManager.bulkWriteData, Config.DataFrameQueueBufferTimeMs);
    }


    /**
     * Applies the shutdown processes
     */
    public static shutdown():void {
        
        // check if there is a queue timeout running already, if so clear it before starting a new one
        if (Tools._.isNull(DataQueueManager.queueManagerTimeout) === false) {
            clearTimeout(DataQueueManager.queueManagerTimeout);
        }

        ConsoleLogger.info("DataQueueManager: Shutdown complete");
    }


    /**
     * Handles bulk writing data within the cached
     * data queue
     */
    private static async bulkWriteData():Promise<void> {

        // attempt to check the cache to see whether this toke is associated to an already validated user or not
        let dataQueueFromCache:string[] = await CacheClient.getLRangeFromList(ECacheObjectKey.DataQueue, 0, Config.dataQueueBufferRangeMax - 1);

        // check if any data exists in the queue within the range
        if (dataQueueFromCache.length > 0) {

            // retrieve the database logging settings
            let databaseLoggingSettings:IWebsocketDatabaseLoggingSettings = await ExternalSettingsTools.getDatabaseLoggingSettings();

            // attempt to bulk write all the data frames to the db
            await PostgresDbHelpers.insertMultipleRowsToDbTable(
                <any>null,
                <any>null,
                dataQueueFromCache.map((frameStr:string):IFrame => { return JSON.parse(frameStr); }), // parse the stringed frames from cache to objects
            );

            ConsoleLogger.debug(`DataQueueManager.bulkWriteData: Saved ${ dataQueueFromCache.length } data records from cache queue`);

            // attempt to clear the items written to the db for the next iteration of bulk writes
            // using the length of the number of records retrieved because we don't necessarily know whether we have less than the max range and more items
            // were pushed during the bulk writing process
            let clearRangeFromCacheQueueStatus:boolean = await CacheClient.lTrimFromList(ECacheObjectKey.DataQueue, dataQueueFromCache.length, -1);
        }
        else {
            ConsoleLogger.debug("DataQueueManager.bulkWriteData: No items found in queue");
        }

        // restart the timeout to run again for the next iteration
        DataQueueManager.queueManagerTimeout = setTimeout(DataQueueManager.bulkWriteData, Config.dataQueueBufferRangeMax);
    }
}
import { BootHelpers } from "@cache_manager/lib_common_utilities/libs/BootHelpers";
import { ConsoleLogger } from "@cache_manager/lib_common_utilities/libs/ConsoleLogger";
import { Config } from "../Config";
import { CacheClient } from '@cache_manager/lib_cache/libs/CacheClient';
import { DataQueueManager } from "./DataQueueManager";
import { ConnectionActiveManager } from "./ConnectionActiveManager";
import { ErrorLogger } from "./ErrorLogger";

export class Core {

    /**
     * Handle the startup processes
     */
    public static async initialize():Promise<void> {

        // print out the boot banner
        BootHelpers.printPackageBootBanner(Config.packageName, Config.endpointVersion, Config.runtimeEnv);

        ConsoleLogger.info(`${ new Date() }`);

        try {

            // connect the redis client
            ConsoleLogger.info("Connecting redis client");
            CacheClient.connectClient(Config.redisHost, Config.redisPort, Config.cacheManagerAuthToken);

            // initialize the connection active manager for continuous check ins
            ConnectionActiveManager.initialize();
            
            // initialize the queue managers
            DataQueueManager.initialize();
    
            ConsoleLogger.info("Cache Manager: Startup complete");
        }
        catch (err) {
            ConsoleLogger.error("Core.initialize: Failed to start Cache Manager");
            ConsoleLogger.error(err);

            // attempt to log the error
            await ErrorLogger.logSystemError(
                "Core.initialize",
                "cache_manager_initialize_failed",
                `${ err }`,
                1800000 // 30 mins
            );
        }

        // instantiate request to shutdown
        process.on('SIGINT', Core.shutdown);
    }


    /**
     * Handle the shutdown processes
     */
    public static shutdown():void {

        // shutdown the connection active manager
        ConnectionActiveManager.shutdown();

        // shutdown the queue managers
        DataQueueManager.shutdown();

        // properly disconnect the cache client
        CacheClient.disconnectClient();

        ConsoleLogger.info("Core.shutdown: Shutdown complete");

        // exit this node process
        process.exit();
    }
}
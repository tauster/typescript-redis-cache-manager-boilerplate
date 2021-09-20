import redis, {
    ClientOpts,
    RedisClient,
    ServerInfo
} from "redis";
import { Tools } from "@cache_manager/lib_common_utilities/libs/Tools";
import { ConsoleLogger } from "@cache_manager/lib_common_utilities/libs/ConsoleLogger";
import { ECacheObjectKey } from "../types/CacheDbTypes";

export class CacheClient {

    // placeholder for redis client object
    private static redisClient:RedisClient = <any>null;
    private static redisReconnectionTimeout:any = <any>null;
    private static redisReconnectionTimeoutMs:number = 60000;

    /**
     * Starts a client connection to the redis server for usage
     * 
     * @param { string } host
     * @param { number } port
     * @param { string } password
     */
    public static connectClient(host:string, port:number, password:string):void {
    
        // first check if there's already a redis client connection or not, only connect if null (not connected)
        if (Tools._.isNull(CacheClient.redisClient) === true) {

            // attempt to connect to the redis server
            try {

                // instantiate redis client
                CacheClient.redisClient = redis.createClient(<ClientOpts>{
                    host: host,
                    port: port,
                    password: password
                });

                CacheClient.redisClient.on("connect", CacheClient.redisClientOnConnectCb);
                CacheClient.redisClient.on("ready", CacheClient.redisClientOnReadyCb);
                CacheClient.redisClient.on("error", CacheClient.redisClientOnErrorCb);
                CacheClient.redisClient.on("end", CacheClient.redisClientOnEndCb);
            }
            // otherwise catch any errors that may be caused by no redis-server running
            catch (err) {
                ConsoleLogger.error("CacheClient.connectClient: Failed to connect to redis as client. Check if your redis-server for your current build is running. Full error:");
                ConsoleLogger.error(err);
            }
        }
    }


    /**
     * Disconnects the client connection from the redis server
     */
    public static disconnectClient():void {

        // first check if there's already a redis client connection or not, only connect if null (not connected)
        if (Tools._.isNull(CacheClient.redisClient) === false) {
            CacheClient.redisClient.quit();
            CacheClient.redisClient = <any>null;

            // clear out reconnection timeout if one exists
            if (Tools._.isNull(CacheClient.redisReconnectionTimeout) === false) {
                clearTimeout(CacheClient.redisReconnectionTimeout);
                CacheClient.redisReconnectionTimeout = <any>null;
            }
        }
    }


    /**
     * Checks whether the cache manager is active or not
     * 
     * @returns { Promise<boolean> }
     */
    public static async isCacheManagerActive():Promise<boolean> {

        // attempt to grab the active status from the cache server
        let activeStatus:string|null = await CacheClient.getItem(ECacheObjectKey.CacheManagerActive);

        // if null is returned, either the cache server itself is down OR the cache manager is offline, so return false
        if (Tools._.isNull(activeStatus) === true) {
            return false;
        }
        // otherwise the cache server itself is up AND the cache manager is online
        else {
            return true;
        }
    }


    /**
     * Sets item to redis cache server
     * 
     * @param { ECacheObjectKey|string } key
     * @param { any } value
     * @param { ?number } expirationTimeMs
     * @returns { boolean }
     */
    public static async setItem(key:ECacheObjectKey|string, value:any, expirationTimeMs?:number):Promise<boolean> {

        // promisified version of getting the item in order to allow async usage
        return new Promise((resolve, reject) => {

            // first check if there's already a redis client connection or not, then get item
            if (Tools._.isNull(CacheClient.redisClient) === false) {

                // check if an expiration time was given or not, if so set the key/value pair with the expiration time in seconds
                if (Tools._.isUndefined(expirationTimeMs) === false) {
                    CacheClient.redisClient.set(key, JSON.stringify(value), "EX", Math.floor(expirationTimeMs! / 1000), (err:Error|null):void => {
                        
                        // check if the error is null or not to see if the item was set properly or not, null means no errors
                        if (Tools._.isNull(err) === true) {
                            resolve(true);
                        }
                        // otherwise the item doesn't exist so resolve null 
                        else {
                            resolve(false);
                        }
                    });
                }
                // otherwise set the item without an expiration
                else {
                    CacheClient.redisClient.set(key, JSON.stringify(value), (err:Error|null, reply:string):void => {

                        // check if the error is null or not to see if the item was set properly or not
                        if (Tools._.isNull(err) === true) {
                            resolve(true);
                        }
                        // otherwise the item doesn't exist so resolve null 
                        else {
                            resolve(false);
                        }
                    });
                }
            }
            // otherwise resolve to exit promise
            else {
                resolve(false);
            }
        });
    }


    /**
     * Gets item to redis cache server
     * 
     * @param { ECacheObjectKey|string } key
     * @returns { Promise<string|null> }
     */
    public static async getItem(key:ECacheObjectKey|string):Promise<string|null> {

        // promisified version of getting the item in order to allow async usage
        return new Promise((resolve, reject) => {

            // first check if there's already a redis client connection or not, then get item
            if (Tools._.isNull(CacheClient.redisClient) === false) {
                CacheClient.redisClient.get(key, (err:Error|null, reply:string|null):void => {

                    // check if the reply is null or not, if not then the item was retrieved so resolve the reply
                    // not null means reply is string
                    if (Tools._.isNull(reply) === false) {
                        resolve(reply);
                    }
                    // otherwise the item doesn't exist so resolve null 
                    else {
                        resolve(null);
                    }
                });
            }
            // otherwise resolve null
            else {
                resolve(null);
            }
        });
    }


    /**
     * Uses RPUSH redis command to add item to end of key's list on
     * redis cache server
     * 
     * @param { ECacheObjectKey|string } key
     * @param { any } value
     */
    public static async rPushItem(key:ECacheObjectKey|string, value:any):Promise<boolean> {

        // promisified version of getting the item in order to allow async usage
        return new Promise((resolve, reject) => {

            // first check if there's already a redis client connection or not, then rpush the item to the key
            if (Tools._.isNull(CacheClient.redisClient) === false) {
                CacheClient.redisClient.rpush(key, JSON.stringify(value), (err:Error|null):void => {

                    // check if the error is null or not to see if the item was set properly or not, if null that means not error
                    if (Tools._.isNull(err) === true) {
                        resolve(true);
                    }
                    // otherwise the item doesn't exist so resolve null 
                    else {
                        resolve(false);
                    }
                });
            }
            // otherwise resolve to exit promise
            else {
                resolve(false);
            }
        });
    }


    /**
     * Uses LRANGE redis command to get the given range of items of key's
     * list on redis cache server
     * 
     * @param { ECacheObjectKey|string } key
     * @param { number } startRange
     * @param { number } stopRange
     * @returns { Promise<string[]> }
     */
    public static async getLRangeFromList(key:ECacheObjectKey|string, startRange:number, stopRange:number):Promise<string[]> {

        // promisified version of getting the item in order to allow async usage
        return new Promise((resolve, reject) => {

            // first check if there's already a redis client connection or not, then rpush the item to the key
            if (Tools._.isNull(CacheClient.redisClient) === false) {
                CacheClient.redisClient.lrange(key, startRange, stopRange, (err:Error|null, reply:string[]|null):void => {

                    // check if the reply is null or not, if not then the item was retrieved so resolve the reply
                    // not null means reply is string[]
                    if (Tools._.isNull(reply) === false) {
                        resolve(<string[]>reply);
                    }
                    // otherwise the item doesn't exist so resolve null 
                    else {
                        resolve([]);
                    }
                });
            }
            // otherwise resolve to exit promise
            else {
                resolve([]);
            }
        });
    }


    /**
     * Uses LTRIM redis command to add item to end of key's list on
     * redis cache server
     * 
     * @param { ECacheObjectKey|string } key
     * @param { number } startRange
     * @param { number } stopRange
     * @returns { boolean }
     */
    public static async lTrimFromList(key:ECacheObjectKey|string, startRange:number, stopRange:number):Promise<boolean> {

        // promisified version of getting the item in order to allow async usage
        return new Promise((resolve, reject) => {

            // first check if there's already a redis client connection or not, then rpush the item to the key
            if (Tools._.isNull(CacheClient.redisClient) === false) {
                CacheClient.redisClient.ltrim(key, startRange, stopRange, (err:Error|null):void => {

                    // check if the error is null or not to see if the item was set properly or not, null means no error
                    if (Tools._.isNull(err) === true) {
                        resolve(true);
                    }
                    // otherwise the item doesn't exist so resolve null 
                    else {
                        resolve(false);
                    }
                });
            }
            // otherwise resolve to exit promise
            else {
                resolve(false);
            }
        });
    }


    /**
     * Gets an info object for cache server
     * 
     * @returns { Promise<any|null> }
     */
    public static async getServerInfo():Promise<any|null> {

        // promisified version of getting the item in order to allow async usage
        return new Promise((resolve, reject) => {

            // first check if there's already a redis client connection or not, then get item
            if (Tools._.isNull(CacheClient.redisClient) === false) {
                CacheClient.redisClient.info((err:Error|null, info:ServerInfo) => {

                    // check if the error is null or not to see if the item was set properly or not, null means no error
                    if (Tools._.isNull(err) === true) {

                        // attempt to parse the results
                        try {

                            // break up each line into an array of "key:value"
                            let lines:string[] = (<any>info as string).split( "\r\n" );

                            // placeholder object for the server info
                            let serverInfoObj:any = {};
 
                            // go through each line and parse accordingly
                            lines.forEach((line:string):void => {

                                // split this line by the colon to get its key and value
                                let lineSplit:string[] = line.split(":");

                                // ensure that this line is in fact a key and value pair, if so add it to the object
                                if (lineSplit.length > 1) {
                                    serverInfoObj[lineSplit[0]] = lineSplit[1];
                                }
                            });

                            // resolve the object
                            resolve(serverInfoObj);
                        }
                        // catch any errors and resolve none
                        catch (err) {
                            console.log(null);
                        }
                    }
                    // otherwise resolve null
                    else {
                        resolve(null);
                    }
                });
            }
            // otherwise resolve null
            else {
                resolve(null);
            }
        });
    }


    /**
     * Callback for redis client on connect
     */
    private static redisClientOnConnectCb():void {
        ConsoleLogger.info(`CacheClient: Redis server connected`);
    }


    /**
     * Callback for redis client on ready
     */
    private static redisClientOnReadyCb():void {
        ConsoleLogger.info(`CacheClient: Redis server connection ready`);
    }


    /**
     * Callback for redis client on error
     * 
     * @param { string } channel
     */
    private static redisClientOnErrorCb(channel:string):void {
        ConsoleLogger.error(`CacheClient: Redis server error attempting reconnection at channel: ${ channel }`);

        // disconnect the client
        CacheClient.disconnectClient();

        // implement a reconnection timeout
        if (Tools._.isNull(CacheClient.redisReconnectionTimeout) === true) {
            ConsoleLogger.warn(`CacheClient: Attempting reconnection in ${ Math.floor(CacheClient.redisReconnectionTimeoutMs / 1000) }s`);
            CacheClient.redisReconnectionTimeout = setTimeout(CacheClient.connectClient, CacheClient.redisReconnectionTimeoutMs); 
        }
    }


    /**
     * Callback for redis client on end
     */
    private static redisClientOnEndCb():void {
        ConsoleLogger.debug(`CacheClient: Redis server connection ended`);
    }
}
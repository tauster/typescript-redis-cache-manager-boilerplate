
import { BaseConfig } from "@cache_manager/lib_common_utilities/libs/BaseConfig";
import { Tools } from "@cache_manager/lib_common_utilities/libs/Tools";
import { EnvironmentTypeHelpers } from "@cache_manager/lib_common_utilities/libs/Environment";
import { EAWSRegion } from "@cache_manager/lib_common_utilities/types/AWSTypes";
import { ERestApiBaseUrl, EStaticRestApiBaseUrl } from "@cache_manager/lib_api/types/APIUrlTypes";

export class LocalConfig extends BaseConfig {

    /**
     * Constant Configuration Properties Across All Environments
     */
    public static endpointVersionSuffix:string = 'beta.1'; // suffix of endpoint version using semver notation

    /**
     * Runtime Environment Dependent Configuration Properties
     */
    // package versioning config properties
    public endpointVersion!:string; // version for the package from package.json
    public endpointVersionDevStage!:string; // part of endpoint version appended after numeric bits
    public endpointVersionIncludingPreRelease!:string; // full version in semver notation

    // runtime credentials, mainly meant for dev_local
    public runtimeEmail!:string;
    public runtimePassword!:string;
    public runtimeAuthToken!:string;

    // rest api parameters
    public apiBaseUrl!:ERestApiBaseUrl;

    // static rest api server parameters
    public restDbStaticServerHost!:EStaticRestApiBaseUrl;

    // 256-bit aes encrypted with keys available at a secure bucket
    public cacheManagerAuthToken!:string;

    // AWS parameters
    public awsRegion!:EAWSRegion;

    // db parameters
    public pgUser!:string;
    public pgPassword!:string;
    public pgHost!:string;

    // redis cache server parameters
    public redisHost!:string;
    public redisPort!:number;
    public cacheItemExpirationMs!:number;

    // cache manager settings
    public cacheManagerActiveExpirationMs!:number;
    public cacheManagerActiveTimeoutTimerMs!:number;

    // mission data parameters
    public dataQueueBufferTimeMs!:number;
    public dataQueueBufferRangeMax!:number;

    /**
     * Develop BaseConfig parameters
     */
    constructor() {

        // environment type helpers should resolve default environment to development if undefined
        super(
            EnvironmentTypeHelpers.resolveStringToEnum(process.env.NODE_ENV!),
            Tools._.isUndefined(process.env.PACKAGE_NAME) == true  ? 'unknown_package' : process.env.PACKAGE_NAME!,
            Tools._.isUndefined(process.env.PACKAGE_VERSION) == true  ? '0.0.0' : process.env.PACKAGE_VERSION!,
        );
    }

    /**
     * Set config parameters for development local runtime environment
     */
    public setupAsDevelopmentLocal():void {

        this.endpointVersion = this.packageVersion; // pull from package.json
        this.endpointVersionDevStage = this.runtimeEnv.toString() + '_' + LocalConfig.endpointVersionSuffix;
        this.endpointVersionIncludingPreRelease = this.packageVersion + '-' + LocalConfig.endpointVersionSuffix + '-development_local';

        this.runtimeEmail = "";
        this.runtimePassword = "";
        this.runtimeAuthToken = "";

        this.apiBaseUrl = ERestApiBaseUrl.DevelopmentLocal;

        this.restDbStaticServerHost = EStaticRestApiBaseUrl.DevelopmentLocal;

        this.cacheManagerAuthToken = ""; // USE RUNTIME ENVIRONMENT VARIABLES

        this.awsRegion = EAWSRegion.USWest2Oregon;

        this.pgUser = ""; // USE RUNTIME ENVIRONMENT VARIABLES
        this.pgPassword = ""; // USE RUNTIME ENVIRONMENT VARIABLES
        this.pgHost = ""; // USE RUNTIME ENVIRONMENT VARIABLES

        this.redisHost = "127.0.0.1";
        this.redisPort = 6379;
        this.cacheItemExpirationMs = 30000;

        this.cacheManagerActiveExpirationMs = 10000;
        this.cacheManagerActiveTimeoutTimerMs = 5000;

        this.dataQueueBufferTimeMs = 10000;
        this.dataQueueBufferRangeMax = 5;
    }

    /**
     * Set config parameters for development runtime environment
     */
    public setupAsDevelopment():void {

        this.endpointVersion = this.packageVersion; // pull from package.json
        this.endpointVersionDevStage = this.runtimeEnv.toString() + '_' + LocalConfig.endpointVersionSuffix;
        this.endpointVersionIncludingPreRelease = this.packageVersion + '-' + LocalConfig.endpointVersionSuffix + '-development';

        this.runtimeEmail = <any>null;
        this.runtimePassword = <any>null;
        this.runtimeAuthToken = <any>null;

        this.apiBaseUrl = ERestApiBaseUrl.Development;

        this.restDbStaticServerHost = EStaticRestApiBaseUrl.Development;

        this.cacheManagerAuthToken = ""; // USE RUNTIME ENVIRONMENT VARIABLES

        this.awsRegion = EAWSRegion.USWest2Oregon;

        this.pgUser = ""; // USE RUNTIME ENVIRONMENT VARIABLES
        this.pgPassword = ""; // USE RUNTIME ENVIRONMENT VARIABLES
        this.pgHost = ""; // USE RUNTIME ENVIRONMENT VARIABLES

        this.redisHost = "127.0.0.1";
        this.redisPort = 6379;
        this.cacheItemExpirationMs = 30000;

        this.cacheManagerActiveExpirationMs = 10000;
        this.cacheManagerActiveTimeoutTimerMs = 5000;

        this.dataQueueBufferTimeMs = 20000;
        this.dataQueueBufferRangeMax = 500;
    }

    /**
     * Set config parameters for staging runtime environment
     */
    public setupAsStaging():void {

        this.endpointVersion = this.packageVersion; // pull from package.json
        this.endpointVersionDevStage = this.runtimeEnv.toString() + '_' + LocalConfig.endpointVersionSuffix;
        this.endpointVersionIncludingPreRelease = this.packageVersion + '-' + LocalConfig.endpointVersionSuffix + '-staging';

        this.runtimeEmail = <any>null;
        this.runtimePassword = <any>null;
        this.runtimeAuthToken = <any>null;

        this.apiBaseUrl = ERestApiBaseUrl.Staging;

        this.restDbStaticServerHost = EStaticRestApiBaseUrl.Staging;

        this.cacheManagerAuthToken = ""; // USE RUNTIME ENVIRONMENT VARIABLES

        this.awsRegion = EAWSRegion.USWest2Oregon;

        this.pgUser = ""; // USE RUNTIME ENVIRONMENT VARIABLES
        this.pgPassword = ""; // USE RUNTIME ENVIRONMENT VARIABLES
        this.pgHost = ""; // USE RUNTIME ENVIRONMENT VARIABLES

        this.redisHost = "127.0.0.1";
        this.redisPort = 6379;
        this.cacheItemExpirationMs = 30000;

        this.cacheManagerActiveExpirationMs = 10000;
        this.cacheManagerActiveTimeoutTimerMs = 5000;

        this.dataQueueBufferTimeMs = 20000;
        this.dataQueueBufferRangeMax = 500;
    }

    /**
     * Set config parameters for production local runtime environment
     */
    public setupAsProductionLocal():void {

        this.endpointVersion = this.packageVersion; // pull from package.json
        this.endpointVersionDevStage = this.runtimeEnv.toString() + '_' + LocalConfig.endpointVersionSuffix;
        this.endpointVersionIncludingPreRelease = this.packageVersion + '-' + LocalConfig.endpointVersionSuffix + '-production_local';

        this.runtimeEmail = "";
        this.runtimePassword = "";
        this.runtimeAuthToken = "";

        this.apiBaseUrl = ERestApiBaseUrl.ProductionLocal;

        this.restDbStaticServerHost = EStaticRestApiBaseUrl.ProductionLocal;

        this.cacheManagerAuthToken = ""; // USE RUNTIME ENVIRONMENT VARIABLES

        this.awsRegion = EAWSRegion.USWest2Oregon;

        this.pgUser = ""; // USE RUNTIME ENVIRONMENT VARIABLES
        this.pgPassword = ""; // USE RUNTIME ENVIRONMENT VARIABLES
        this.pgHost = ""; // USE RUNTIME ENVIRONMENT VARIABLES

        this.redisHost = "127.0.0.1";
        this.redisPort = 6379;
        this.cacheItemExpirationMs = 30000;

        this.cacheManagerActiveExpirationMs = 10000;
        this.cacheManagerActiveTimeoutTimerMs = 5000;

        this.dataQueueBufferTimeMs = 20000;
        this.dataQueueBufferRangeMax = 500;
    }

    /**
     * Set config parameters for production runtime environment
     */
    public setupAsProduction():void {

        this.endpointVersion = this.packageVersion; // pull from package.json
        this.endpointVersionDevStage = this.runtimeEnv.toString() + '_' + LocalConfig.endpointVersionSuffix;
        this.endpointVersionIncludingPreRelease = this.packageVersion + '-' + LocalConfig.endpointVersionSuffix + '-production';

        this.runtimeEmail = <any>null;
        this.runtimePassword = <any>null;
        this.runtimeAuthToken = <any>null;

        this.apiBaseUrl = ERestApiBaseUrl.Production;

        this.restDbStaticServerHost = EStaticRestApiBaseUrl.Production;

        this.cacheManagerAuthToken = ""; // USE RUNTIME ENVIRONMENT VARIABLES

        this.awsRegion = EAWSRegion.USWest2Oregon;

        this.pgUser = ""; // USE RUNTIME ENVIRONMENT VARIABLES
        this.pgPassword = ""; // USE RUNTIME ENVIRONMENT VARIABLES
        this.pgHost = ""; // USE RUNTIME ENVIRONMENT VARIABLES

        this.redisHost = "127.0.0.1";
        this.redisPort = 6379;
        this.cacheItemExpirationMs = 30000;

        this.cacheManagerActiveExpirationMs = 10000;
        this.cacheManagerActiveTimeoutTimerMs = 5000;

        this.dataQueueBufferTimeMs = 20000;
        this.dataQueueBufferRangeMax = 500;
    }

    /**
     * Load variables from the environment if available. Empty string in variables where number is valid, will
     * not be accepted. Empty string will be accepted everywhere else (but software may error out).
     */
    public loadFromEnvironmentVariables():void {
        // nothing loaded from environment variables
    }

}

export const Config:LocalConfig = new LocalConfig();

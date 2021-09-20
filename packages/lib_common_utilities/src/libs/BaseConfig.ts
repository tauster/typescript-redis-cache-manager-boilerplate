import { EEnvironmentType } from "./Environment";
import { Tools } from "./Tools";
import Debug from 'debug';

// because this is instantiated before the GlobalLogger, cannot use GlobalLogger's debug
let debug:Debug.IDebugger = Debug('cache_manager:lib_common_utilities:libs:BaseConfig');

/**
 * Abstract class for BaseConfig which can be used
 * across all packages. Used in order to allow for 
 * constant parameter resolution based on runtime
 * environment. 
 */
export abstract class BaseConfig {

    /**
     * All available base config parameters
     */
    public runtimeEnv!:EEnvironmentType;
    public packageName:string;
    public packageVersion:string;

    /**
     * For base config, provide runtime environment, package name
     * and package version relating to this configuration.
     *
     * @param { EEnvironmentType } runtimeEnv
     * @param { string } packageName
     * @param { string } packageVersion
     */
    constructor(runtimeEnv:EEnvironmentType, packageName:string, packageVersion:string) {

        // set configuration details
        this.runtimeEnv = runtimeEnv;
        this.packageName = packageName;
        this.packageVersion = packageVersion;

        this.startupAsRuntimeEnvironment();

        debug(
            Tools.utilFormat(
                'LocalConfig for "%s" v."%s" used has been initialized with NODE_ENV=%s".',
                this.packageName,
                this.packageVersion,
                this.runtimeEnv.toString()));
    }

    /**
     * Development Local Environment Settings
     */
    public abstract setupAsDevelopmentLocal():void;

    /**
     * Development Environment Settings
     */
    public abstract setupAsDevelopment():void;

    /**
     * Staging Environment Settings
     */
    public abstract setupAsStaging():void;

    /**
     * Production Local Environment Settings
     */
    public abstract setupAsProductionLocal():void;

    /**
     * Production Environment Settings
     */
    public abstract setupAsProduction():void;

    /**
     * Load variables from the environment if available. Empty string in variables where number is valid, will
     * not be accepted. Empty string will be accepted everywhere else (but software may error out).
     */
    public abstract loadFromEnvironmentVariables():void;

    /**
     * Starts up config based on the resolved runtime environment
     */
    public startupAsRuntimeEnvironment():void {

        // setup environment based on NODE_ENV environment variable
        switch (this.runtimeEnv) {
            case EEnvironmentType.DevelopmentLocal:
                this.setupAsDevelopmentLocal();
                break;
            case EEnvironmentType.Development:
                this.setupAsDevelopment();
                break;
            case EEnvironmentType.Staging:
                this.setupAsStaging();
                break;
            case EEnvironmentType.ProductionLocal:
                this.setupAsProductionLocal();
                break;
            case EEnvironmentType.Production:
                this.setupAsProduction();
                break;
            default:
                console.error('NODE_ENV in client is not in bundle set. This shouldn\'t be possible!');
                break;
        }
    }
}
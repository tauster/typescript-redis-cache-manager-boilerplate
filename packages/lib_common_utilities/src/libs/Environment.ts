
/**
 * Enum of all environment types available
 */
export enum EEnvironmentType {
    DevelopmentLocal = "development_local",
    Development = "development",
    Staging = "staging",
    ProductionLocal = "production_local",
    Production = "production"
}

/**
 * Class of environment type helpers
 */
export class EnvironmentTypeHelpers {
    
    /**
     * Resolves given string to the enum equivalent. Default
     * is Development
     * 
     * @param { string } environmentTypeInString
     * @returns { EEnvironmentType } 
     */
    public static resolveStringToEnum(environmentTypeInString:string):EEnvironmentType {

        switch(environmentTypeInString) {

            case "development_local":
                return EEnvironmentType.DevelopmentLocal;
            case "development":
                return EEnvironmentType.Development;
            case "staging":
                return EEnvironmentType.Staging;
            case "production_local":
                return EEnvironmentType.ProductionLocal;
            case "production":
                return EEnvironmentType.Production;
            default:
                return EEnvironmentType.Development;
        }
    }


    /**
     * Returns status of whether the given environment string type is local
     * or not
     * 
     * @param { string } environmentTypeInString
     * @returns { boolean }
     */
    public static isLocalEnvironmentFromString(environmentTypeInString:string):boolean {

        switch(environmentTypeInString) {

            case "development_local":
            case "production_local":
                return true;
            case "development":
            case "staging":
            case "production":
            default:
                return false;
        }
    }


    /**
     * Returns status of whether the given environment type enum is local
     * or not
     * 
     * @param { EEnvironmentType } environmentTypeInString
     * @returns { boolean }
     */
    public static isLocalEnvironment(environmentType:EEnvironmentType):boolean {

        switch(environmentType) {

            case EEnvironmentType.DevelopmentLocal:
            case EEnvironmentType.ProductionLocal:
                return true;
            case EEnvironmentType.Development:
            case EEnvironmentType.Staging:
            case EEnvironmentType.Production:
            default:
                return false;
        }
    }
}
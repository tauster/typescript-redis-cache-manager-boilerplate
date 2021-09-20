/**
 * Enum of all REST API Base URLs for all runtime environments
 */
export enum ERestApiBaseUrl {
    DevelopmentLocal = "http://localhost:6050",
    Development = "https://aws-lambda/development",
    Staging = "https://aws-lambda/staging",
    ProductionLocal = "http://dns-reroute-for-local-network:6050",
    ProductionLocalServer = "http://localhost:6050",
    Production = "https://aws-lambda/production"
}


/**
 * Enum of all Static REST API Base URLs for all runtime environments
 */
export enum EStaticRestApiBaseUrl {
    DevelopmentLocal = "http://localhost:6055",
    Development = "http://aws-ec2-development:6055",
    Staging = "http://aws-ec2-staging:6055",
    ProductionLocal = "http://dns-reroute-for-local-network:6055",
    ProductionLocalServer = "http://localhost:6055",
    Production = "http://aws-ec2-production:6055"
}


/**
 * Enum of all Websocket Base URLs for all runtime environments
 */
export enum EWebsocketBaseUrl {
    DevelopmentLocal = "ws://localhost:6060",
    Development = "wss://aws-lambda/development",
    Staging = "wss://aws-lambda/staging",
    ProductionLocal = "ws://dns-reroute-for-local-network:6060",
    ProductionLocalServer = "ws://localhost:6060",
    Production = "wss://aws-lambda/production"
}


/**
 * Enum of all Websocket Base URLs for all runtime environments
 */
 export enum EWebsocketUplinkBaseUrl {
    DevelopmentLocal = "ws://localhost:6061",
    Development = "",
    Staging = "",
    ProductionLocal = "ws://dns-reroute-for-local-network:6061",
    ProductionLocalServer = "ws://localhost:6061",
    Production = ""
}
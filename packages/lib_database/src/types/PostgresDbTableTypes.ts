import { ILogsSystemErrorRow } from "./LogsDbTableTypes";

/**
 * Enum of all postgres based databases
 */
export enum EPostgresDbNames {
    Connections = "cache_manager_connections",
    Users = "cache_manager_users"
}

/**
 * Enum of all postgres based db table names
 */
export enum EPostgresDbTableNames {
    LogsSystemErrors = "cache_manager_logs_system_errors",
    UserActions = "cache_manager_user_actions",
    UserBase = "cache_manager_user_base",
    UserSettings = "cache_manager_user_settings",
    WebsocketConnectionLog = "cache_manager_websocket_connection_log"
}

/**
 * Type of all postgres based db table rows
 */
export type PostgresDbTableRowTypes = ILogsSystemErrorRow;
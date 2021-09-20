import { EPostgresDbTableNames } from "../types/PostgresDbTableTypes";

export class TableNameHelpers {

    /**
     * Resolves given table name in string to the its enum. Will
     * return null if no matches
     * 
     * @param { string } tableNameStr
     * @returns { EPostgresDbTableNames }
     */
     public static resolveTableNameStringToEnum(tableNameStr:string):EPostgresDbTableNames {
        switch (tableNameStr) {
            case "cache_manager_logs_system_errors":
                return EPostgresDbTableNames.LogsSystemErrors;

            case "cache_manager_user_actions":
                return EPostgresDbTableNames.UserActions;

            case "cache_manager_user_base":
                return EPostgresDbTableNames.UserBase;

            case "cache_manager_user_settings":
                return EPostgresDbTableNames.UserSettings;

            case "cache_manager_websocket_connection_log":
                return EPostgresDbTableNames.WebsocketConnectionLog;

            default:
                return <any>null;
        }
    }
}
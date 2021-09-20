import { Client, ClientConfig, QueryResult } from "pg";
import { EPostgresDbTableNames, PostgresDbTableRowTypes, EPostgresDbNames } from "../types/PostgresDbTableTypes";
import { Tools } from "@cache_manager/lib_common_utilities/libs/Tools";

export class PostgresDbHelpers {

    /**
     * Gets the database client instance for future
     * manipulation
     * 
     * @param { string } user
     * @param { string } password
     * @param { string } host
     * @param { string } database
     * @returns { Client }
     */
    public static getDbClientInstance(user:string, password:string, host:string, database:EPostgresDbNames):Client {
        return new Client(<ClientConfig>{
            user: user,
            password: password,
            host: host,
            port: 5432,
            database: database
        });
    }


    /**
     * Inserts a row into the given postgres table
     * 
     * @param { Client } dbClient
     * @param { EPostgresDbTableNames } tableName
     * @param { PostgresDbTableRowTypes } tableRow
     */
    public static async insertRowToDbTable(dbClient:Client, tableName:EPostgresDbTableNames, tableRow:PostgresDbTableRowTypes):Promise<void> {

        try {

            // attempts to connect to the db clients
            await dbClient.connect();

            // query params to insert all given rows into the given table name
            const queryParams = {
                text: PostgresDbHelpers.getInsertRowText(tableName, tableRow),
                values: Object.values(tableRow)
            };

            // perform the query
            await dbClient.query(queryParams);
        }
        catch (err) {
            // handle any errors
            console.error(err);
        }
        finally {
            // after performing the query, or handling any errors, end the db client connection
            await dbClient.end();
        }
    }


    /**
     * Inserts a row into the given postgres table
     * 
     * @param { Client } dbClient
     * @param { EPostgresDbTableNames } tableName
     * @param { PostgresDbTableRowTypes[] } tableRows
     */
    public static async insertMultipleRowsToDbTable(dbClient:Client, tableName:EPostgresDbTableNames, tableRows:PostgresDbTableRowTypes[]):Promise<void> {

        try {

            // attempts to connect to the db clients
            await dbClient.connect();

            // query params to insert all given rows into the given table name
            const queryParams = {
                text: PostgresDbHelpers.getInsertMultipleRowsText(tableName, tableRows),
                values: [].concat.apply([], tableRows.map((tableRow:PostgresDbTableRowTypes):any => { return Object.values(tableRow); }))
            };

            // perform the query
            await dbClient.query(queryParams);
        }
        catch (err) {
            // handle any errors
            console.error(err);
        }
        finally {
            // after performing the query, or handling any errors, end the db client connection
            await dbClient.end();
        }
    }


    /**
     * Returns and array of available rows that match the 
     * given column name/value pair
     * 
     * @param { Client } dbClient
     * @param { EPostgresDbTableNames } tableName
     * @param { string } columnName
     * @param { any } columnValue
     * @param { string[]? } columnsList
     * @returns { PostgresDbTableRowTypes[] }
     */
    public static async getRowsWhereColumnEqualsValue(dbClient:Client, tableName:EPostgresDbTableNames, columnName:string, columnValue:any, columnsList?:string[]):Promise<PostgresDbTableRowTypes[]> {

        // placeholder for the query results
        let results:PostgresDbTableRowTypes[] = [];

        // attempt to perform the query
        try {

            // attempts to connect to the db clients
            await dbClient.connect();

            // query params to select all from table where a column condition is met
            const queryParams = {
                text: `SELECT ${ (Tools._.isUndefined(columnsList) === false && columnsList!.length > 0) ? columnsList!.join(", ") : "*" } FROM ${tableName} WHERE ${columnName} = $1`,
                values: [columnValue]
            };

            // perform the query
            let queryResults:QueryResult<any> = await dbClient.query(queryParams);

            // check if there are any resulting rows, if so return them
            if (queryResults.rows.length > 0) {
                results = queryResults.rows;
            }
        }
        catch (err) {
            // handle any errors
            console.error(err);
        }
        finally {
            // after performing the query, or handling any errors, end the db client connection and return the results
            await dbClient.end();
            return results;
        }
    }


    /**
     * Returns and array of available rows for the given
     * table name
     * 
     * @param { Client } dbClient
     * @param { EPostgresDbTableNames } tableName
     * @returns { PostgresDbTableRowTypes[] }
     */
    public static async getAllRowsForTable(dbClient:Client, tableName:EPostgresDbTableNames):Promise<PostgresDbTableRowTypes[]> {

        // placeholder for the query results
        let results:PostgresDbTableRowTypes[] = [];

        // attempt to perform the query
        try {

            // attempts to connect to the db clients
            await dbClient.connect();

            // query params to select all from table
            const queryParams = {
                text: `SELECT * FROM ${tableName}`
            };

            // perform the query
            let queryResults:QueryResult<any> = await dbClient.query(queryParams);

            // check if there are any resulting rows, if so return them
            if (queryResults.rows.length > 0) {
                results = queryResults.rows;
            }
        }
        catch (err) {
            // handle any errors
            console.error(err);
        }
        finally {
            // after performing the query, or handling any errors, end the db client connection and return the results
            await dbClient.end();
            return results;
        }
    }


    /**
     * Returns and array of available rows for the given
     * table name for the given limit
     * 
     * @param { Client } dbClient
     * @param { string } tsSortColumnName
     * @param { EPostgresDbTableNames } tableName
     * @param { number } limit
     * @returns { PostgresDbTableRowTypes[] }
     */
    public static async getLatestRowsLimited(dbClient:Client, tableName:EPostgresDbTableNames, tsSortColumnName:string, limit:number):Promise<PostgresDbTableRowTypes[]> {

        // placeholder for the query results
        let results:PostgresDbTableRowTypes[] = [];

        // attempt to perform the query
        try {

            // attempts to connect to the db clients
            await dbClient.connect();

            // query params to select all from table
            const queryParams = {
                text: `SELECT * FROM ${ tableName } order by ${ tsSortColumnName } desc LIMIT ${ limit }`
            };

            // perform the query
            let queryResults:QueryResult<any> = await dbClient.query(queryParams);

            // check if there are any resulting rows, if so return them
            if (queryResults.rows.length > 0) {
                results = queryResults.rows;
            }
        }
        catch (err) {
            // handle any errors
            console.error(err);
        }
        finally {
            // after performing the query, or handling any errors, end the db client connection and return the results
            await dbClient.end();
            return results;
        }
    }


    /**
     * Returns and array of available rows that are between
     * the given epoch timestamp ranges. Epoch timestamps
     * must be in milliseconds
     * 
     * @param { Client } dbClient
     * @param { EPostgresDbTableNames } tableName
     * @param { string } tsColumnName
     * @param { number } startTsMs
     * @param { number } endTsMs
     * @param { string } columnsList // empty arrays represent all columns to be downloaded
     * @returns { PostgresDbTableRowTypes[] }
     */
    public static async getRowsBetweenTwoEpochTsForTable(
        dbClient:Client,
        tableName:EPostgresDbTableNames,
        tsColumnName:string,
        startTsMs:number,
        endTsMs:number,
        columnsList:string[],
        optionalConditions?:{ [key: string]: any; }
    ):Promise<PostgresDbTableRowTypes[]> {

        // placeholder for the query results
        let results:PostgresDbTableRowTypes[] = [];

        // attempt to perform the query
        try {

            // attempts to connect to the db clients
            await dbClient.connect();

            // develop the base query string for the time range selector
            let selectRangeText:string = `SELECT ${ (columnsList.length > 0) ? columnsList.join(", ") : "*" } FROM ${ tableName } WHERE (${ tsColumnName } BETWEEN to_timestamp(${ startTsMs / 1000 }) AND to_timestamp(${ endTsMs / 1000 }))`;

            // query params to select the rows between the given epoch timestamps
            let queryParams:any = {
                text: selectRangeText
            };

            // check if any optional conditions were given or not
            if (Tools._.isUndefined(optionalConditions) === false) {

                // go through each conditional option and add the condition to the query string
                Object.keys(optionalConditions!).forEach((optionalConditionKey:string, index:number):void => {
                    selectRangeText = selectRangeText + ` AND (${ optionalConditionKey } = $${ index + 1 })`
                });

                // update the query params object with the conditional params
                queryParams = {
                    text: selectRangeText,
                    values: Object.values(optionalConditions!)
                };
            }

            // perform the query
            let queryResults:QueryResult<any> = await dbClient.query(queryParams);

            // check if there are any resulting rows, if so return them
            if (queryResults.rows.length > 0) {
                results = queryResults.rows;
            }
        }
        catch (err) {
            // handle any errors
            console.error(err);
        }
        finally {
            // after performing the query, or handling any errors, end the db client connection and return the results
            await dbClient.end();
            return results;
        }
    }


    /**
     * Updates a row for a column name/value pair
     * 
     * @param { Client } dbClient
     * @param { EPostgresDbTableNames } tableName
     * @param { string } primaryColumnName
     * @param { any } primaryValue
     * @param { { [key: string]: any; } } updateParams
     * @returns { PostgresDbTableRowTypes[] }
     */
    public static async updateColumnNameValuePairOfExisitingRowInDbTable(
        dbClient:Client, 
        tableName:EPostgresDbTableNames, 
        primaryColumnName:string,
        primaryValue:any,
        updateParams:{ [key: string]: any; }
    ):Promise<void> {

        try {

            // attempts to connect to the db clients
            await dbClient.connect();

            // develop the query text
            let queryTextHeader:string = `UPDATE ${tableName} SET `;
            let queryTextParams:string = Object.keys(updateParams).map((columnName:string, index:number):string => { return `${columnName} = (\$${index + 1})` }).join(", ");
            let queryTextFooter:string = ` WHERE ${primaryColumnName} = (\$${Object.keys(updateParams).length + 1})`;

            // query params to insert all given rows into the given table name
            const queryParams = {
                text: `${queryTextHeader}${queryTextParams}${queryTextFooter}`,
                values: Object.values(updateParams).concat(primaryValue)
            };

            // perform the query
            await dbClient.query(queryParams);
        }
        catch (err) {
            // handle any errors
            console.error(err);
        }
        finally {
            // after performing the query, or handling any errors, end the db client connection
            await dbClient.end();
        }
    }


    /**
     * Returns the number of rows in the table
     * 
     * @param { Client } dbClient
     * @param { EPostgresDbTableNames } tableName
     * @returns { number }
     */
    public static async getNumberOfRows(dbClient:Client, tableName:EPostgresDbTableNames):Promise<number> {

        try {

            // attempts to connect to the db clients
            await dbClient.connect();

            // query params to insert all given rows into the given table name
            const queryParams = {
                text: `SELECT COUNT(*) FROM ${tableName}`
            };

            // perform the query
            let queryResults:QueryResult<any> = await dbClient.query(queryParams);

            // check if there are any resulting rows and whether the count key is available, if so return them, otherwise return null
            if (queryResults.rows.length > 0) {
                if (Tools._.isUndefined(queryResults.rows[0]["count"]) === false) {
                    return parseInt(queryResults.rows[0]["count"]);
                }
                else {
                    return <any>null;
                }
            }
            else {
                return <any>null;
            }
        }
        catch (err) {
            // handle any errors
            console.error(err);
            return <any>null;
        }
        finally {
            // after performing the query, or handling any errors, end the db client connection
            await dbClient.end();
        }
    }


    /**
     * Returns the number of rows in the table
     * 
     * @param { Client } dbClient
     * @param { EPostgresDbTableNames } tableName
     * @param { string } betweenColumnName
     * @param { any } betweenStartValue
     * @param { any } betweenEndValue
     * @returns { number }
     */
    public static async getNumberOfRowsWhereBetweenColumnValue(
        dbClient:Client,
        tableName:EPostgresDbTableNames,
        betweenColumnName:string,
        betweenStartValue:any,
        betweenEndValue:any
    ):Promise<number> {

        try {

            // attempts to connect to the db clients
            await dbClient.connect();

            // query params to insert all given rows into the given table name
            const queryParams = {
                text: `SELECT COUNT(*) FROM ${ tableName } WHERE ${ betweenColumnName } BETWEEN ${ betweenStartValue } AND ${ betweenEndValue }`
            };

            // perform the query
            let queryResults:QueryResult<any> = await dbClient.query(queryParams);

            // check if there are any resulting rows and whether the count key is available, if so return them, otherwise return null
            if (queryResults.rows.length > 0) {
                if (Tools._.isUndefined(queryResults.rows[0]["count"]) === false) {
                    return parseInt(queryResults.rows[0]["count"]);
                }
                else {
                    return <any>null;
                }
            }
            else {
                return <any>null;
            }
        }
        catch (err) {
            // handle any errors
            console.error(err);
            return <any>null;
        }
        finally {
            // after performing the query, or handling any errors, end the db client connection
            await dbClient.end();
        }
    }


    /**
     * Gets a list of column name strings for a given table
     * instance
     * 
     * @param { Client } dbClient
     * @param { EPostgresDbTableNames } tableName
     * @returns { Promise<string[]> }
     */
    public static async getListOfColumnsForTable(dbClient:Client, tableName:EPostgresDbTableNames):Promise<string[]> {

        try {

            // attempts to connect to the db clients
            await dbClient.connect();

            // query params to get list of column names for given table name
            const queryParams = {
                text: `SELECT column_name FROM information_schema.columns WHERE table_name = '${ tableName }'`
            };

            // perform the query
            let queryResults:QueryResult<any> = await dbClient.query(queryParams);

            // check if there are any resulting rows and whether column name key is available, if so return just the values of each collection item, otherwise return empty array
            if (queryResults.rows.length > 0) {
                if (Tools._.isUndefined(queryResults.rows[0]["column_name"]) === false) {
                    return Tools._.map(queryResults.rows, "column_name");
                }
                else {
                    return [];
                }
            }
            else {
                return [];
            }
        }
        catch (err) {
            // handle any errors
            console.error(err);
            return [];
        }
        finally {
            // after performing the query, or handling any errors, end the db client connection
            await dbClient.end();
        }
    }


    /**
     * Gets the insert row SQL query text
     * 
     * @param { EPostgresDbTableNames } tableName
     * @param { PostgresDbTableRowTypes } tableRow
     * @returns { string }
     */
    private static getInsertRowText(tableName:EPostgresDbTableNames, tableRow:PostgresDbTableRowTypes):string {
        return `INSERT INTO ${ tableName }(${ Object.keys(tableRow).join(", ") }) VALUES(${ Object.keys(tableRow).map((value:string, index:number):string => { return "$" + (index + 1).toString(); }).join(", ") })`
    }


    /**
     * Gets the insert multiple rows SQL query text
     * 
     * @param { EPostgresDbTableNames } tableName
     * @param { PostgresDbTableRowTypes[] } tableRows
     * @returns { string }
     */
    private static getInsertMultipleRowsText(tableName:EPostgresDbTableNames, tableRows:PostgresDbTableRowTypes[]):string {

        // develop the insert header text with all the column names
        let insetHeaderText:string = `INSERT INTO ${ tableName }(${ Object.keys(tableRows[0]).join(", ") }) VALUES `;

        // initialize the index for the query's placeholder index
        let rolloverIndex:number = 0;

        // develop all the row value components of the query and it it onto the header
        tableRows.forEach((tableRow:PostgresDbTableRowTypes, index:number):void => {
            insetHeaderText = insetHeaderText + `(${ Object.keys(tableRow).map((value:string, index:number):string => { rolloverIndex++; return "$" + (rolloverIndex).toString(); }).join(", ") })${ (index === tableRows.length - 1) ? "" : ", " }`;
        });

        // return the results
        return insetHeaderText;
    }


    /**
     * Gets the insert row SQL query text
     * 
     * @param { EPostgresDbTableNames } tableName
     * @param { PostgresDbTableRowTypes } tableRow
     * @returns { string }
     */
    private static getSelectRowsText(tableName:EPostgresDbTableNames, limit:number):string {
        return `SELECT * FROM ${ tableName } order by log_ts desc LIMIT ${ limit }`
    }
}
export enum ELogSystemOrigin {
}

/**
 * Interface of a LogsSystemError table row
 */
export interface ILogsSystemErrorRow {
    id:string;
    log_ts:Date;
    ts:Date;
    system_origin:ELogSystemOrigin;
    system_location:string;
    error_name:string;
    error_details:string;
    meta_data:any;
}
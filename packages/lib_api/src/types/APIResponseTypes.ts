/**
 * Interface of a Base response
 */
export interface IBaseResponse {
    message:string;
}


/**
 * Interface of an Error response
 */
export interface IErrorResponse {
    error:any;
}


/**
 * Interface of a UserSessionValidation response
 */
export interface IUserSessionValidationResponse extends IBaseResponse {
    sessionIsValid:boolean;
}


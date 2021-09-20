/**
 * Enum of all user config groups
 */
export enum EUserGroup {
    Admin = "admin",
    EngineerAdmin = "engineer_admin",
    Engineer = "engineer",
    ExternalDepartment = "external_department",
    GeneralPublic = "general_public",
    None = "none"
}


/**
 * Enum of all user actions
 */
export enum EUserAction {
    AccountPasswordChange = "account_password_change",
    NewAccountCreated = "new_account_created",
    Login = "login",
    Logout = "logout",
    WebsocketConnected = "websocket_connected",
    WebsocketDisconnected = "websocket_disconnected"
}


/**
 * Interface of a UserDetails response
 */
export interface IUserDetails {
    userId:string;
    createdAtTs:Date;
    lastLoginTs:Date;
    email:string;
    userGroup:EUserGroup;
    firstName:string;
    lastName:string;
}
import { AxiosRequestConfig } from "axios";
import { Tools } from "@cache_manager/lib_common_utilities/libs/Tools";
import { ApiRequest } from "../types/APIRequestTypes";
import { IWebsocketDatabaseLoggingSettings } from "../types/WebsocketTypes";

export class RestApiHelpers {

    /**
     * Creates a GET request for given api endpoint. Endpoint
     * requires a "/" character. userAuthToken only required for
     * protected endpoints and is optional 
     * 
     * @param { string } apiEndpoint 
     * @param { string } apiBaseUrl 
     * @param { string? } userAuthToken
     * @returns { AxiosRequestConfig } 
     */
    public static getGETRequestOptions(apiEndpoint:string, apiBaseUrl:string, userAuthHeader?:string):AxiosRequestConfig {
        return <AxiosRequestConfig>{
            method: "GET",
            url: apiEndpoint,
            baseURL: apiBaseUrl,
            mode: "cors",
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                ...((Tools._.isUndefined(userAuthHeader) === false) && { 'Authorization': userAuthHeader })
            },
            withCredentials: false
        }
    }

    /**
     * Creates a POST request for given api endpoint. Endpoint
     * requires a "/" character. userAuthToken only required for
     * protected endpoints and is optional 
     * 
     * @param { string } apiEndpoint 
     * @param { any } data
     * @param { string? } userAuthToken 
     * @returns { AxiosRequestConfig }
     */
    public static getPOSTRequestOptions(apiEndpoint:string, apiBaseUrl:string, data:ApiRequest, userAuthHeader?:string):AxiosRequestConfig {
        return <AxiosRequestConfig>{
            method: "POST",
            url: apiEndpoint,
            baseURL: apiBaseUrl,
            data: data,
            mode: "cors",
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                ...((Tools._.isUndefined(userAuthHeader) === false) && { 'Authorization': userAuthHeader })
            },
            withCredentials: false
        }
    }
}
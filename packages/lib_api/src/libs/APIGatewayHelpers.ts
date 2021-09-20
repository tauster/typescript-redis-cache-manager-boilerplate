
import { ApiGatewayManagementApi } from "aws-sdk/clients/all";

// aws dependency, excluded in webpack in order to use lambda's aws-sdk for config parameters
const AWS = require("aws-sdk");

export class APIGatewayHelpers {

    /**
     * Creates a new ApiGateway management api instance with
     * the AWS config parameters defined in Lambda's env
     * 
     * @param {string} domainName
     * @param {string} stage
     * @returns {ApiGatewayManagementApi}
     */
    public static createNewApiGatewayManagementApi(domainName:string, stage:string):ApiGatewayManagementApi {
        return new AWS.ApiGatewayManagementApi({
            apiVersion: '2018-11-29',
            endpoint: domainName + '/' + stage
        });
    }

    /**
     * Posts given data to given connection on a given 
     * ApiGatewayManagementApi
     * 
     * @param {ApiGatewayManagementApi} apiGatewayManagementApi 
     * @param {string} connectionId 
     * @param {string} data 
     */
    public static postDataToConnection(apiGatewayManagementApi:ApiGatewayManagementApi, connectionId:string, data:any):Promise<any> {
        return apiGatewayManagementApi.postToConnection({
            ConnectionId: connectionId,
            Data: data
        }).promise();
    }
}
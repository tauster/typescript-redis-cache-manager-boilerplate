// tslint:disable:no-bitwise
import { UAParser } from "ua-parser-js";
import * as moment from "moment-timezone";

export class ClientEnvironment {

    /**
     * Retrieves internal IPv4 address for client
     * 
     * @returns {Promise<string>}
     */
    public static async getInternalIpAddressV4():Promise<string> {

        // placeholder for client's internal ip
        let internalIp:string = "";

        // https://gist.github.com/hectorguo/672844c319547498dcb569df583f959d
        await new Promise((resolve:Function, reject:Function):any => {

            // attempt to get internal ip, in the event we're in an environment without the "window" object
            // we can leave gracefully
            try {

                // NOTE: window.RTCPeerConnection is "not a constructor" in FF22/23
                // @ts-ignore
                let RTCPeerConnection:any = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    
                if (!RTCPeerConnection) {
                    reject('Your browser does not support this API');
                }
    
                let rtc:any = new RTCPeerConnection({iceServers:[]});
                let addresses:any = {};
                addresses["0.0.0.0"] = false;
    
                let grepSDP:any = (sdp:any):any => {
                    let hosts:any = [];
                    sdp.split('\r\n').forEach((line:any):any => { // c.f. http://tools.ietf.org/html/rfc4566#page-39
                        if (~line.indexOf("a=candidate")) {     // http://tools.ietf.org/html/rfc4566#section-5.13
                            let parts:any = line.split(' '),        // http://tools.ietf.org/html/rfc5245#section-15.1
                                addr:any = parts[4],
                                type:any = parts[7];
                            if (type === 'host') {
                                internalIp = addr;
                            }
                        }
                        else if (~line.indexOf("c=")) {       // http://tools.ietf.org/html/rfc4566#section-5.7
                            let parts:any = line.split(' ');
                            let addr:any = parts[2];
                            internalIp = addr;
                        }
                    });
    
                    return internalIp;
                };
    
                // @ts-ignore
                if (1 || window.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
                    rtc.createDataChannel('', {reliable:false});
                }
    
                rtc.onicecandidate = (evt:any):any => {
                    // convert the candidate to SDP so we can run it through our general parser
                    // see https://twitter.com/lancestout/status/525796175425720320 for details
                    if (evt.candidate) {
                        let addr:any = grepSDP("a=" + evt.candidate.candidate);
                        resolve(addr);
                    }
                };
                rtc.createOffer((offerDesc:any):any => {
                    rtc.setLocalDescription(offerDesc);
                }, (e:any):any => { console.warn("offer failed", e); });
            }
            catch (err) {
                resolve();
            }
        });

        return internalIp;
    }


    /**
     * Get v4 public ip address of the client
     *
     * @returns {Promise<string>}
     */
    public static async getPublicIpAddressV4():Promise<string> {

        // placeholder for client's public ip
        let clientIp:string = "";

        // create new promise to wait and grab the client's ip
        await new Promise((resolve: Function, reject: Function): any => {

            // placeholder for number of attempts tried to grab the id
            let attemptsToGrabClientIp: number = 0;

            // function which goes through an attempts to find the client's ip and tries a set max amount of times
            // https://stackoverflow.com/questions/47003789/es6-promises-with-timeout-interval
            let grabClientIp: Function = (): void => {

                // increment the attempts to grab client's ip to keep track of how many attempts were
                // taken
                attemptsToGrabClientIp = attemptsToGrabClientIp + 1;

                // check to see if the max attempts is reached
                if (attemptsToGrabClientIp <= 3) {

                    // setup xml request properties
                    let xhr:XMLHttpRequest = new XMLHttpRequest();
                    let url:string = "https://www.cloudflare.com/cdn-cgi/trace";

                    // setup request handler
                    xhr.onreadystatechange = ():void => {

                        // check if the request is done or not
                        if (xhr.readyState == XMLHttpRequest.DONE) {

                            // check if the status is complete
                            if (xhr.status == 200) {

                                // if the response text is not empty, then update the client ip
                                if (xhr.responseText != "") {
                                    if (xhr.responseText.split("\n").length > 3) {
                                        if (xhr.responseText.split("\n")[2].startsWith("ip=") === true) {
                                            clientIp = xhr.responseText.split("\n")[2].replace("ip=", "");
                                        }
                                    }
                                }
                            }
                        }
                    };

                    // execute xml http request
                    xhr.open("GET", url, true);
                    xhr.send();

                    // if the client's ip was updated, resolve the promise and continue
                    if (clientIp != "") {
                        resolve();
                    }
                    // if the client's ip is not found, set a timeout to try again
                    else {
                        setTimeout(grabClientIp, 1000);
                    }
                }
                // if the max is reached, resolve the promise and and continue
                else {
                    resolve();
                }
            };

            // run the client ip grabber
            grabClientIp();
        })
        .catch(async (e:Error):Promise<void> => {
            // do nothing
        });

        return clientIp;
    }


    /**
     * Gets the timezone of client if determined, "Etc/GMT" is
     * assumed if not found
     *
     * @returns {string}
     */
    public static getTimezone():string {

        // ------- determine timezone of client
        let timezoneDetected:string;
        try {
            timezoneDetected = moment.tz.guess();
        }
        // if there was a problem with detection
        catch (e)
        {
            timezoneDetected = 'Etc/GMT'; // Assume GMT/UTC
        }

        return timezoneDetected;
    }


    /**
     * Gets the UTC offset of client if determined, default 0 is
     * assumed if not found
     *
     * @param {string} timezone
     * @returns {string}
     */
    public static getUtcOffset(timezone:string):number {

        let utcOffsetDetected:number;
        try {

            utcOffsetDetected =
                // gets utc offset in minutes
                // using this method: https://github.com/moment/moment-timezone/issues/245
                moment.tz(moment.utc(), timezone).utcOffset()
                // so must divide by 60 to get utcOffset in hours
                / 60;
            // e.g. for toronto will be -300 / 60 = -5
        }
        catch (e)
        {
            utcOffsetDetected = 0; // default to GMT/UTC
        }

        return utcOffsetDetected;
    }


    /**
     * Returns a snapshot of the useragent data of the client
     *
     * @returns {IUserAgentSnapshot}
     */
    public static getUserAgentSnapshot():IUserAgentSnapshot {

        let userAgentSnapshot:IUserAgentSnapshot;

        try {

            // gets useragent result using ua-parser-js package
            // @ts-ignore
            let userAgentParser:any = new UAParser();
            let userAgentData:IUAParser.IResult = userAgentParser.getResult();

            userAgentSnapshot = <IUserAgentSnapshot>{
                browser: userAgentData.browser,
                cpu: userAgentData.cpu,
                device: userAgentData.device,
                engine: userAgentData.engine,
                os: userAgentData.os
            };
        }
        // use empty objects in case of error
        catch (e) {
            userAgentSnapshot = <IUserAgentSnapshot>{
                browser: {},
                cpu: {},
                device: {},
                engine: {},
                os: {}
            };
        }

        // returns the ua data of the current instance
        return userAgentSnapshot;
    }

    /**
     * Returns a snapshot of the useragent data of a given UA string
     *
     * @param {string} uaString
     * @returns {IUserAgentSnapshot}
     */
    public static getUserAgentSnapshotFromUAString(uaString:string):IUserAgentSnapshot {

        let userAgentSnapshot:IUserAgentSnapshot;

        try {

            // gets useragent result using ua-parser-js package using the given ua string
            // @ts-ignore
            let userAgentParser:any = new UAParser().setUA(uaString);
            let userAgentData:IUAParser.IResult = userAgentParser.getResult();

            userAgentSnapshot = <IUserAgentSnapshot>{
                browser: userAgentData.browser,
                cpu: userAgentData.cpu,
                device: userAgentData.device,
                engine: userAgentData.engine,
                os: userAgentData.os
            };
        }
        // use empty objects in case of error
        catch (e) {
            userAgentSnapshot = <IUserAgentSnapshot>{
                browser: {},
                cpu: {},
                device: {},
                engine: {},
                os: {}
            };
        }

        // returns the ua data of the current instance
        return userAgentSnapshot;
    }

    /**
     * Returns the useragent browser data of the client
     *
     * @returns {IUserAgentBrowser}
     */
    public static getUserAgentBrowser():IUserAgentBrowser {
        return ClientEnvironment.getUAParserResultObject().browser;
    }

    /**
     * Returns the useragent cpu data of the client
     *
     * @returns {IUserAgentCPU}
     */
    public static getUserAgentCpu():IUserAgentCPU {
        return ClientEnvironment.getUAParserResultObject().cpu;
    }

    /**
     * Returns the useragent device data of the client
     *
     * @returns {IUserAgentDevice}
     */
    public static getUserAgentDevice():IUserAgentDevice {
        return ClientEnvironment.getUAParserResultObject().device;
    }

    /**
     * Returns the useragent engine data of the client
     *
     * @returns {IUserAgentEngine}
     */
    public static getUserAgentEngine():IUserAgentEngine {
        return ClientEnvironment.getUAParserResultObject().engine;
    }

    /**
     * Returns the useragent os data of the client
     *
     * @returns {IUserAgentOS}
     */
    public static getUserAgentOs():IUserAgentOS {
        return ClientEnvironment.getUAParserResultObject().os;
    }

    /**
     * Returns the useragent results data using ua-parser-js
     *
     * @returns {IUserAgentBrowser}
     */
    private static getUAParserResultObject():IUAParser.IResult {
        // @ts-ignore
        let userAgentParser:any = new UAParser();
        return userAgentParser.getResult();
    }
}

/**
 * Interface of a user agent browser details
 */
export interface IUserAgentBrowser {
    name:string|undefined;
    version:string|undefined;
    major:string|undefined;
}

/**
 * Interface of a user agent cpu details
 */
export interface IUserAgentCPU {
    architecture:string|undefined;
}

/**
 * Interface of a user agent device details
 */
export interface IUserAgentDevice {
    model: string | undefined;
    type: string | undefined;
    vendor: string | undefined;
}

/**
 * Interface of a user agent engine details
 */
export interface IUserAgentEngine {
    name:string|undefined;
    version:string|undefined;
}

/**
 * Interface of a user agent os details
 */
export interface IUserAgentOS {
    name:string|undefined;
    version:string|undefined;
}

/**
 * Interface of a user agent snapshot
 */
export interface IUserAgentSnapshot {
    browser:IUserAgentBrowser;
    cpu:IUserAgentCPU;
    device:IUserAgentDevice;
    engine:IUserAgentEngine;
    os:IUserAgentOS;
}
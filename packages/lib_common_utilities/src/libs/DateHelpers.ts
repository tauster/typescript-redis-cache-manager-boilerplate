export class DateHelpers {

    /**
     * Returns a human readable date string from a date object.
     * Formatted as DAY, MONTH DATE, YEAR
     * 
     * @param {Date} date
     * @returns {string}
     */
    public static getFormattedDateString(date:Date):string {
        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

        return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    }


    /**
     * Returns a short readable date string from a date object.
     * Formatted as YYYY/MM/DD
     * 
     * @param {Date} date
     * @returns {string}
     */
    public static getFormattedShortDateString(date:Date):string {
        return `${ date.getFullYear() }/${ date.getMonth() }/${ date.getDate() }`;
    }


    /**
     * Returns a human readable time string from a date object.
     * Formatted as HH:MM am/pm
     * 
     * @param {Date} date
     * @returns {string}
     */
    public static getFormattedTimeString(date:Date):string {
        let hours:number = date.getHours();
        let minutes:number = date.getMinutes();
        let amOrPm:string = (hours >= 12) ? 'pm' : 'am';
        hours = hours % 12;
        hours = (hours) ? hours : 12; // the hour '0' should be '12'
        let minutesStr:string = (minutes) < 10 ? `0${minutes}` : minutes.toString();
        
        return `${hours}:${minutesStr} ${amOrPm}`;
    }


    /**
     * Returns a human readable time string with seconds from a
     * date object. Formatted as HH:MM:SS am/pm
     * 
     * @param {Date} date
     * @returns {string}
     */
    public static getFormattedTimeWithSecondsString(date:Date):string {
        let hours:number = date.getHours();
        let minutes:number = date.getMinutes();
        let amOrPm:string = (hours >= 12) ? 'pm' : 'am';
        hours = hours % 12;
        hours = (hours) ? hours : 12; // the hour '0' should be '12'
        let minutesStr:string = (minutes) < 10 ? `0${minutes}` : minutes.toString();
        let secondsStr:string = (date.getSeconds()) < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`;
        
        return `${hours}:${minutesStr}:${secondsStr} ${amOrPm}`;
    }

    /**
     * Returns a human readable time string with seconds in UTC format
     * from a date object. Formatted as HH:MM:SS am/pm
     * 
     * @param {Date} date
     * @returns {string}
     */
    public static getFormattedUTCTimeWithSecondsString(date:Date):string {
        let hours:number = date.getUTCHours();
        let minutes:number = date.getUTCMinutes();
        let minutesStr:string = (minutes) < 10 ? `0${minutes}` : minutes.toString();
        let secondsStr:string = (date.getUTCSeconds()) < 10 ? `0${date.getUTCSeconds()}` : `${date.getUTCSeconds()}`;
        
        return `${hours}:${minutesStr}:${secondsStr}`;
    }


    /**
     * Returns a human readable date and time string from a date object.
     * Formatted as DAY, MONTH DATE, YEAR, HH:MM am/pm
     * 
     * @param {Date} date
     * @returns {string}
     */
    public static getFormattedDateAndTimeString(date:Date):string {
        return `${DateHelpers.getFormattedDateString(date)}, ${DateHelpers.getFormattedTimeString(date)}`;
    }


    /**
     * Gets the HH:MM:SS formatted string given seconds as a number
     * 
     * @param { number } timeSeconds
     * @returns { string }
     */
    public static getFormattedTimeHHMMSSStringFromSecondsNumber(timeSeconds:number):string {
        return new Date(timeSeconds * 1000).toISOString().substr(11, 8);
    }


    /**
     * Gets the HH:MM:SS formatted string given seconds as a number
     * 
     * @param { Date } date
     * @returns { string }
     */
    public static getFormattedShortDateTimeUTC(date:Date):string {
        return `${ DateHelpers.getFormattedShortDateString(date) } - ${ DateHelpers.getFormattedUTCTimeWithSecondsString(date) }`
    }


    /**
     * Gets the HH:MM:SS formatted string given seconds as a number
     * 
     * @param { Date } date
     * @returns { string }
     */
    public static getFormattedShortDateTimeLocalTimezone(date:Date):string {
        return `${ DateHelpers.getFormattedShortDateString(date) } - ${ DateHelpers.getFormattedTimeWithSecondsString(date) } ${ DateHelpers.getShortTimezoneName(date) }`
    }


    /**
     * Gets the local timezone name of the given date object
     * 
     * @param { Date }
     * @returns { string }
     */
    public static getFullTimezoneName(date:Date):string {
        let short:string = date.toLocaleDateString(undefined);
        let full:string = date.toLocaleDateString(undefined, { timeZoneName: 'long' });
      
        // Trying to remove date from the string in a locale-agnostic way
        let shortIndex:number = full.indexOf(short);
        if (shortIndex >= 0) {
            let trimmed:string = full.substring(0, shortIndex) + full.substring(shortIndex + short.length);
            
            // by this time `trimmed` should be the timezone's name with some punctuation -
            // trim it from both sides
            return trimmed.replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '');
      
        }
        else {
            // in some magic case when short representation of date is not present in the long one, just return the long one as a fallback, since it should contain the timezone's name
            return full;
        }
    }


    /**
     * Gets the short timezone title
     * 
     * @param { Date } date
     * @returns { string }
     */
    public static getShortTimezoneName(date:Date):string {
        return new Date().toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2];
    }
}
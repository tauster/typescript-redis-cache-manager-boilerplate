export class ValidationHelpers {

    /**
     * Checks whether string is email or not
     * 
     * @param {string} email
     * @returns {boolean}
     */
    public static isEmail(email:string):boolean {
        const emailRe:RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRe.test(email.toLowerCase());
    }
}
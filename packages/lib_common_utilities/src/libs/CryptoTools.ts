import { enc } from 'crypto-js';
import AES from 'crypto-js/aes';

export class CryptoTools {

    /**
     * Encrypts given string using AES encryption, given a key
     * 
     * @param { string } value Values to be encrypted
     * @param { string } key Key used for encryption
     * @returns { string }
     */
    public static encryptAES(value:string, key:string):string {
        return AES.encrypt(value, key).toString();
    }


    /**
     * Decrypts given string using AES decryption, given a key
     * 
     * @param { string } value Values to be encrypted
     * @param { string } key Key used for encryption
     * @returns { string }
     */
    public static decryptAES(value:string, key:string):string {
        return AES.decrypt(value, key).toString(enc.Utf8);
    }
}


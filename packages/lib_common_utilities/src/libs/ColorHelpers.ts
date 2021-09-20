import { Tools } from "./Tools";
import { IRgbColorObject } from "../types/ColorTypes";

export class ColorHelpers {

    /**
     * Converts a color hex string to an rgb color object with optional
     * alpha percentage
     * 
     * @param { string } hex
     * @param { number? } alpha
     * @returns { IRgbColorObject }
     */
    public static hexToRgb(hex:string, alpha?:number):IRgbColorObject {

        // attempt to extract the relevant rgb splices from the hex string
        const result:RegExpExecArray|null = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        // if the result isn't null, then create the rgb object and return it
        if (Tools._.isNull(result) === false) {
            return <IRgbColorObject>{
                r: parseInt(result![1], 16),
                g: parseInt(result![2], 16),
                b: parseInt(result![3], 16),
                ...((Tools._.isUndefined(alpha) === false) ? { a: alpha } : null)
            };
        }
        // otherwise return null
        else {
            return <any>null;
        }
    }


    /**
     * Mixes 2 given rgb colors by given percentage into an RgbColorObject.
     * 
     * Ported from sass implementation in C
     * https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
     * 
     * @param { IRgbColorObject } color1
     * @param { IRgbColorObject } color2
     * @param { number } amount
     * @returns { IRgbColorObject }
     */
    public static mixRgbColorsByPercentage(color1:IRgbColorObject, color2:IRgbColorObject, amount:number):IRgbColorObject {
        
        // calculate the weightings for the color mixing
        const weight1:number = amount;
        const weight2:number = 1 - amount;

        // add the alpha components to the color objects if they don't exist
        const alpha1:number = (Tools._.isUndefined(color1.a) === false) ? color1.a! : 1;
        const alpha2:number = (Tools._.isUndefined(color2.a) === false) ? color2.a! : 1;

        // calculate the rgb components
        const r:number = Math.round(weight1 * color1.r + weight2 * color2.r);
        const g:number = Math.round(weight1 * color1.g + weight2 * color2.g);
        const b:number = Math.round(weight1 * color1.b + weight2 * color2.b);

        // use the average of the alpha components
        const a:number = (alpha1 + alpha2) / 2;

        // return the combined object
        return <IRgbColorObject>{r, g, b, a};
    }
}
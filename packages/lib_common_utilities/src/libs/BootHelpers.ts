import { EEnvironmentType } from "./Environment";

export class BootHelpers {

    /**
     * Gets the boot banner for the given package, version, and 
     * runtime environment
     * 
     * @param { string } packageName
     * @param { string } version
     * @param { EEnvironmentType } runtimeEnvironment
     * @returns { string }
     */
    public static getPackageBootBanner(packageName:string, version:string, runtimeEnvironment:EEnvironmentType):string {

        let yearString:number = new Date().getFullYear();

        return ( 
            "!    _______________\n" +
            "!   /              /\n" +
            "!  /____      ____/\n" +
            "!      /     /\n" +
            "!     /     /\n" +
            "!    /     /\n" +
            "!   /_____/\n" +
            "!\n" +
            `! ${ packageName }\n` +
            `! v.${ version }_${ runtimeEnvironment }\n` +
            "! Tausif Sharif\n" +
            "!\n" +
            `! Copyright ${ yearString }\n` +
            "!\n"
        );
    }


    /**
     * Prints out the package boot banner with colorized 
     * template
     * 
     * @param { string } packageName
     * @param { string } version
     * @param { EEnvironmentType } runtimeEnvironment
     */
    public static printPackageBootBanner(packageName:string, version:string, runtimeEnvironment:EEnvironmentType):void {

        let yearString:number = new Date().getFullYear();
        
        console.log(
            "!", "\x1b[36m", " _________  ________", "\x1b[0m", "\n" +
            "!", "\x1b[36m", "|\\___   ___\\\\   ____\\", "\x1b[0m", "\n" +
            "!", "\x1b[36m", "\\|___ \\  \\_\\ \\  \\___|_", "\x1b[0m", "\n" +
            "!", "\x1b[36m", "     \\ \\  \\ \\ \_____   \\", "\x1b[0m", "\n" +
            "!", "\x1b[36m", "      \\ \\  \\ \\|____|\\  \\", "\x1b[0m", "\n" +
            "!", "\x1b[36m", "       \\ \\__\\  ____\\_\\  \\", "\x1b[0m", "\n" +
            "!", "\x1b[36m", "        \\|__| |\\_________\\", "\x1b[0m", "\n" +
            "!", "\x1b[36m", "              \\|_________|", "\x1b[0m", "\n" +
            "!\n" +
            "! ", "\x1b[32m", `${ packageName }`, "\x1b[0m", '\n' +
            "! ", "\x1b[34m", `v.${ version }_${ runtimeEnvironment }`, "\x1b[0m", '\n' +
            "! Tausif Sharif\n" +
            "!\n", +
            `! Copyright ${ yearString }\n` +
            "!\n"
        );
    }
}
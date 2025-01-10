import test from "@playwright/test";

export class MethodHelpers {

    static AddAttachLinkReport(attachedName: string, attachedInfo: string){
        test.info().annotations.push({
            type: attachedName,
            description: attachedInfo
        });
    }

    // static sleepInSeconds(miliseconds: number): Promise<void> {
    //     return new Promise(resolve => setTimeout(resolve, miliseconds * 1000));
    // }

}
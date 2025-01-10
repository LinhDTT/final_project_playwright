import{Page} from '@playwright/test';
import { promises } from 'dns';
import path from 'path';

export default class BasePage {

    protected page: Page; //page here means property

    constructor(page: Page){ //page here means input of the contructor
        this.page = page;
    }

    protected async clickToElement(locator: string){
        await this.highlightElement(locator);
        await this.page.click(locator);
    }

    protected async doubleClickToElement(locator: string){
        await this.highlightElement(locator);
        await this.page.dblclick(locator);
    }

    protected async highlightElement(locator: string){
        let originalStyle: string;
        const element = this.page.locator(locator);
        await element.evaluate(el => originalStyle = el.style.border);
        await element.evaluate(el => el.style.border); //get original style of the element
        await element.evaluate(el => el.style.border = '2px dashed red'); 
        await this.page.waitForTimeout(500);
        await element.evaluate(el => el.style.border = originalStyle); //get back to the original style after highlight
    }

    protected async rightClickToElement(locator: string){
        await this.highlightElement(locator);
        await this.page.locator(locator).click({button: 'right'});
    }
    
    protected async middleClickToElement(locator: string){
        await this.highlightElement(locator);
        await this.page.locator(locator).click({button: 'middle'});
    }

    protected async fillElement(locator: string, inputValue: string){
        await this.highlightElement(locator);
        await this.page.fill(locator, inputValue);
    }

    protected async checkToCheckBox(locator: string){
        await this.highlightElement(locator);
        await this.page.check(locator);
    }

    protected async unCheckToElement(locator: string){
        await this.highlightElement(locator);
        await this.page.uncheck(locator);
    }

    protected async hoverToElement(locator: string){
        await this.highlightElement(locator);
        await this.page.hover(locator);
    }

    protected async scrollToElement(locator:string){
        await this.page.locator(locator).scrollIntoViewIfNeeded();
    }

    protected async getPageURL(){
        return this.page.url();
    }

    protected async getElementText(locator: string){
        return this.page.locator(locator).innerText; //textContet vs innerText are different, innerText get text that visible on site only
    }

    protected async isElementChecked(locator: string){
        return this.page.isChecked(locator);
    }

    protected async isElementVisible(locator: string){
        return this.page.isVisible(locator);
    }

    protected async isElementHidden(locator: string){
        return this.page.isHidden(locator);
    }

    protected async isElementDisable(locator: string){ //Disable means cannot interact with the element, and in HTML the element has attribute disable
        return this.page.isDisabled(locator);
    }

    protected async redirectToURL(url: string){
        await this.page.goto(url);
    }

    protected async selectToDropDown(locator: string, option: string){
        await this.page.locator(locator).selectOption({label: option}); //select by text only, if want to select by option shoul remove lable
    }

    protected async getInputValue(locator: string){
        return this.page.locator(locator).inputValue;
    }

    protected async getAttributeValueOfElement(locator: string, attributeName: string){
        return this.page.locator(locator).getAttribute(attributeName);
    }

    protected async reloadPage(){
        this.page.reload();
    }

    protected async getNumberOfElements(locator: string){
        const element = await this.page.$$(locator);    //$$ get all element with the same locator
        //const element = await this.page.locator(locator).all() - another option to get all elements with the same locator
        return element.length;
    }

    protected async blurElement(locator: string){
        this.page.locator(locator).blur();
    }

    protected async uploadFile(locator: string, fileName: string){
        const pathToFile = path.resolve(__dirname, fileName);
        await this.page.locator(locator).setInputFiles(pathToFile);
    }

    protected async uploadMultipleFiles(locator: string, ...fileName: string[]){
        let filePaths: string[] = fileName.map(fileName => path.resolve(__dirname, fileName)); //map tung phan tu trong mang
        await this.page.locator(locator).setInputFiles(filePaths);
    }

    protected async scrollToPageTop(){
        await this.page.evaluate(() => window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'  //smooth scroll tu tu, instance load den luon 
        }))
    }

    protected async hideElement(locator: string){
        await this.page.locator(locator).evaluate(el => el.style.display = 'none !important'); //none vs invisibility la khac nhau
    }

    protected async redirectBack(){
        await this.page.goBack();
    }

    protected async redirectForward(){
        await this.page.goForward();
    }

    protected async getPageSource(){
        return this.page.content();
    }

    protected async clickToElementInFrame(frameLocator: string, locator: string){
        const frameElement = await this.page.frameLocator(frameLocator);
        await frameElement.locator(locator).click();

    }

    protected async FillToElementInFrame(frameLocator: string, locator: string, inputValue: string){
        const frameElement = await this.page.frameLocator(frameLocator);
        await frameElement.locator(locator).fill(inputValue);

    }

    protected async waitForElementVisible(locator: string, timeout?: number){ //common setting timeout time in config.ts
        await this.page.locator(locator).waitFor({
            state: 'visible',
            timeout: timeout
        })
    }

    protected async waitForElementPresent(locator: string, timeout?: number){ //common setting timeout time in config.ts
        await this.page.locator(locator).waitFor({
            state: 'attached',
            timeout: timeout
        })
    }

    protected async waitForElementStale(locator: string, timeout?: number){ //common setting timeout time in config.ts
        await this.page.locator(locator).waitFor({
            state: 'detached',
            timeout: timeout
        })
    }

    protected async getTextOfAllElements(locator: string): Promise<string[]>{
        const elements = await this.page.locator(locator).all();
        const textOfElements: string[] = [];

        for(let i = 0; i < elements.length; i++){
            textOfElements.push(await elements[i].innerText());
        }

        return textOfElements;
    }

    protected async waitForPageLoad(maxRetries: number = 3) {
        try {
            await this.page.waitForSelector('html', { state: 'attached' });
            await this.page.waitForLoadState('domcontentloaded');

            for (let attempt = 0; attempt < maxRetries; attempt++) {
                const pageLoadStatus = await this.page.evaluate(() => document.readyState);
    
                if (pageLoadStatus === "complete") {
                    return;
                }

                // wait for a bit
                await this.page.waitForTimeout(500);
            }
           
            console.warn('Page did not reach "complete" status within retries')
        } catch (error) {
            console.log('Error waiting for page load: ', error);
        }
    }


}
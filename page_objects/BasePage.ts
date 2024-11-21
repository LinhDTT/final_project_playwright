import{Page} from '@playwright/test';

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

}
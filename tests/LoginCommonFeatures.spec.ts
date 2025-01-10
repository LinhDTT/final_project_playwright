import { test, expect} from '@playwright/test';
import LoginPage from '../page_objects/LoginPage';
import { MethodHelpers } from '../page_objects/page_interfaces/utils/MethodHelpers';

var loginPage: LoginPage;
var pageURL: string = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

test.beforeEach(async ({page}) => {

  MethodHelpers.AddAttachLinkReport('reference link ', pageURL);

  loginPage = new LoginPage(page);

  await test.step(`Reirect to URL = ${pageURL}`, async () => {

    await loginPage.openPage(pageURL);
  });

})

test('Verify require msg display', async() =>{
  await test.step(`Click to Login button`, async () =>{
    await loginPage.clickToLoginButton();
  });

  await test.step(`Verify require msg display`, async () =>{
    
  });

})
import {browser, by, element, ExpectedConditions, logging} from 'protractor';

describe('workspace-project App', () => {

  beforeEach(() => {
    browser.get(browser.baseUrl);
  });

  it('should display a login page with a header', () => {
    const loginHeader = element(by.binding('loginEntity.login'));
    expect(element(loginHeader).isPresent);
  });

  it('should display proper title of the page', () => {
    // Fragile: the title of the webpage should be i18n and it is not trivial to
    // recover the proper i18n expected value here
    expect(browser.getTitle()).toEqual('Administrador Sitmun3');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});

const selenium = require('selenium-webdriver');
const chromeDriver = require("selenium-webdriver/chrome");
const path = require("path");

let chromePath = path.resolve("../../chrome");
let chromeDriverPath = chromePath + "/chromedriver.exe";

class Browser{
    constructor() {
    }

    getDriver(){
        return new selenium.Builder()
                           .forBrowser("chrome")
                           .setChromeService(new chromeDriver.ServiceBuilder(chromeDriverPath))
                           .setChromeOptions(new chromeDriver.Options().addArguments(`--user-data-dir=${chromeDriver}`)
                                                                       /*.addArguments('--no-sandbox')
                                                                       .addArguments('--disable-dev-shm-usage')
                                                                       .addArguments('blink-settings=imagesEnabled=false')
                                                                       .addArguments('--headless')
                                                                       .addArguments('--disable-gpu')*/
                                            )
                           .build();
    }

    byXPath(xpath){
        return selenium.By.xpath(xpath);
    }

    byTag(tag){
        return selenium.By.tagName(tag);
    }
}

module.exports = Browser;
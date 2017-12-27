import 'babel-polyfill'
import {assert} from 'chai'
import Promise from 'bluebird'
import parallel from 'mocha.parallel'
import webdriver from 'selenium-webdriver'

const By = webdriver.By
const until = webdriver.until

const kobitonServerUrl = 'https://api.kobiton.com/wd/hub'
const username = 'your Kobiton username'
const accessKey = 'your Kobiton api key'

const desiredCapabilities = [{
  sessionName:        'Automation test session on first device',
  sessionDescription: 'This is an example for Android web', 
  deviceOrientation:  'portrait',  
  captureScreenshots: true, 
  browserName:        'chrome', 
  deviceGroup:        'KOBITON'
  deviceName:         'Galaxy S5',
  platformName:       'Android'
  }, {
  sessionName:        'Automation test session on second device',
  sessionDescription: 'This is an example for Android web', 
  deviceOrientation:  'portrait',  
  captureScreenshots: true, 
  browserName:        'chrome', 
  deviceGroup:        'KOBITON', 
  deviceName:         'Nexus 5',
  platformName:       'Android'
}]

const buildDriver = (caps) => {
  return new Promise((resolve, reject) => {
    caps.username = username
    caps.accessKey = accessKey

    const driver = new webdriver.Builder()
      .usingServer(kobitonServerUrl)
      .withCapabilities(caps)
      .build()
    
    resolve(driver)
  })
}

parallel('Tests',() => {
  desiredCapabilities.forEach((caps) => {
    it(`should return the title that contains Kobiton on device ${caps.deviceName}`,(done) => {
      buildDriver(caps).then((driver) => {
        try {
          driver.get('http://www.google.com/ncr')
          driver.findElement(By.name('q')).sendKeys('Kobiton')
          driver.findElement(By.name('btnG')).click()
          driver.getTitle().then((title) => {
            assert.include(title, 'Kobiton')
          })
        } catch (error) {
          console.log(error)
        } finally {
          driver.quit().then(() => {
            done()
          })
        }
      })
    })
  })
})

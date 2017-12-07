import 'babel-polyfill'
import 'colors'
import wd from 'wd'
import {assert} from 'chai'

const username = 'nakitaxesi'
const apiKey = 'f79c3787-79f2-4759-b7e6-78c9ea4752dc'

const kobitonServerConfig = {
  protocol: 'https',
  host: 'api.kobiton.com',
  auth: `${username}:${apiKey}`
}

const desiredCaps = {
  sessionName:        'Automation test session',
  sessionDescription: 'This is an example for iOS app', 
  deviceOrientation:  'portrait',  
  captureScreenshots: true, 
  deviceGroup:        'KOBITON', 
  deviceName:         'iPhone X',
  platformName:       'iOS',
  app: 'https://s3-ap-southeast-1.amazonaws.com/kobiton-devvn/apps-test/UIKitCatalog-Test-Adhoc.ipa'
}

let driver

describe('iOS App sample', () => {

  before(async () => {
    driver = wd.promiseChainRemote(kobitonServerConfig)

    driver.on('status', (info) => {
      console.log(info.cyan)
    })
    driver.on('command', (meth, path, data) => {
      console.log(' > ' + meth.yellow, path.grey, data || '')
    })
    driver.on('http', (meth, path, data) => {
      console.log(' > ' + meth.magenta, path, (data || '').grey)
    })

    try {
      await driver.init(desiredCaps)
    }
    catch (err) {
      if (err.data) {
        console.error(`init driver: ${err.data}`)
      }
    throw err
    }
  })

  it('should get text UIKitCatalog', async () => {
    await driver.init(desiredCaps)
      .waitForElementByXPath('//UIAStaticText')
      .text().then(function(text) {
        assert.include(text, 'UIKitCatalog')
      })
  })

  after(async () => {
    if (driver != null) {
    try {
      await driver.quit()
    }
    catch (err) {
      console.error(`quit driver: ${err}`)
    }
  }
  })
})

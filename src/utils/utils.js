import * as bowser from 'bowser'

const browser = bowser.getParser(window.navigator.userAgent)

export function isIOSafariWeb() {
  return browser.getBrowserName() === 'Safari' && browser.getPlatformType() === 'mobile' && window.navigator.standalone === false
}
export function isPWAorMobile() {
  const isChromeApp = (window.matchMedia('(display-mode: standalone)').matches)
  const isIosApp = window.navigator.standalone === true
  const platformType = browser.getPlatformType()
  return platformType === 'mobile' || platformType === 'tablet' || (isChromeApp || isIosApp) ? true : false
}

export function stringfyQuery(query = {}) {
  let search = ''
  for (let k in query) {
    search += `&${k}=${query[k]}`
  }
  return search ? '?' + search.substr(1) : ''
}

export async function sleep(seconds) {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, seconds * 1000)
  })
}
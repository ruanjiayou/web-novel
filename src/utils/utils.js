import * as bowser from 'bowser'

export function isPWAorMobile() {
  const browser = bowser.getParser(window.navigator.userAgent)
  const isChromeApp = (window.matchMedia('(display-mode: standalone)').matches)
  const isIosApp = window.navigator.standalone === true
  const platformType = browser.getPlatformType()
  return platformType === 'mobile' || (isChromeApp || isIosApp) ? true : false
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
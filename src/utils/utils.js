export function isDeskTop() {
    const isChromeApp = (window.matchMedia('(display-mode: standalone)').matches)
    const isIosApp = window.navigator.standalone === true
    const isDev = process.env.NODE_ENV === 'development'
    // TODO: 根据UA判断
    const platformType = 'mobile'
    return isDev || (platformType === 'mobile' && (isChromeApp || isIosApp)) ? true : false
}

export function stringfyQuery(query = {}) {
    let search = ''
    for (let k in query) {
        search += `&${k}=${query[k]}`
    }
    return search ? '?' + search.substr(1) : ''
}
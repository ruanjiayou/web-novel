export function isDeskTop() {
    const isChromeApp = (window.matchMedia('(display-mode: standalone)').matches);
    const isIosApp = window.navigator.standalone === true;
    const isDev = process.env.NODE_ENV === 'development';
    // TODO: 根据UA判断
    const platformType = 'mobile';
    return isDev || (platformType === 'mobile' && (isChromeApp || isIosApp)) ? true : false;
}


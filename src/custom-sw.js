// See https://developers.google.com/web/tools/workbox/guides/configure-workbox
workbox.setConfig({ debug: false })
workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug)

// self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
// self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

// We need this in Webpack plugin (refer to swSrc option): https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#full_injectmanifest_config
workbox.precaching.precacheAndRoute(self.__precacheManifest)

// app-shell
workbox.routing.registerRoute('/', workbox.strategies.StaleWhileRevalidate())
workbox.routing.registerRoute('/api', workbox.strategies.networkFirst({
    networkTimeoutSeconds: 10
}))
workbox.routing.registerRoute(/https?:\/\/+(.*)\.(?:png|svg|jpg|gif)$/, new workbox.strategies.CacheFirst({
    cacheName: 'images',
    fetchOptions: {mode:'no-cors'},
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 30,
        maxAgeSeconds: 30 * 24 * 60 *60,
        purgeOnQuotaError: false,
      })
    ],
}))
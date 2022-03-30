import { precacheAndRoute, matchPrecache } from 'workbox-precaching';
import { registerRoute, setCatchHandler } from 'workbox-routing'
import { NetworkFirst, CacheFirst } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'

// registerRoute('/v1', new NetworkFirst({
//   networkTimeoutSeconds: 4
// }));

// 图片缓存
registerRoute(/https?:\/\/+(.*)\.(?:png|svg|jpg|gif|webp)$/, new CacheFirst({
  cacheName: 'images',
  fetchOptions: { mode: 'no-cors' },
  plugins: [
    new CacheableResponsePlugin({
      statuses: [200],
      headers: { 'X-Cacheable': 'true' }
    }),
    new ExpirationPlugin({
      maxEntries: 300,
      maxAgeSeconds: 30 * 24 * 60 * 60,
      purgeOnQuotaError: false,
    })
  ],
}));

// 重要的api缓存(离线显示页面)
const importanceAPI = [
  '/v1/public/boot',
  '/v1/public/channels',
]
registerRoute(({ request }) => {
  const u = new URL(request.url);
  return importanceAPI.includes(u.pathname);
}, new NetworkFirst({
  cacheName: 'bootApi',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [200],
    }),
  ]
}))


// 预缓存
precacheAndRoute(self.__WB_MANIFEST);

// Cache page navigations (html) with a Network First strategy
registerRoute(
  // Check to see if the request is a navigation to a new page
  ({ request }) => request.mode === 'navigate',
  // Use a Network First caching strategy
  new NetworkFirst({
    // Put all cached files in a cache named 'pages'
    cacheName: 'pages',
    plugins: [
      // Ensure that only requests that result in a 200 status are cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  }),
);

// Catch routing errors, like if the user is offline
setCatchHandler(async ({ event }) => {
  // Return the precached offline page if a document is being requested
  if (event.request.destination === 'document') {
    return matchPrecache('/novel/offline.html');
  }
  return Response.error();
});

// 动态缓存
// registerRoute(
//   /\/novel\/*$/,
//   new NetworkFirst({ cacheName: 'application' })
// )
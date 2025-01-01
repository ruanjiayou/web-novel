self.__WB_DISABLE_DEV_LOGS = true

import { precacheAndRoute, matchPrecache } from 'workbox-precaching';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

// registerRoute('/v1', new NetworkFirst({
//   networkTimeoutSeconds: 4
// }));

// 图片缓存
registerRoute(
  /https?:\/\/+(.*)\.(?:png|svg|jpg|gif|webp)$/,
  new CacheFirst({
    cacheName: 'images',
    fetchOptions: { mode: 'no-cors' },
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
        headers: { 'X-Cacheable': 'true' },
      }),
      new ExpirationPlugin({
        maxEntries: 300,
        maxAgeSeconds: 30 * 24 * 60 * 60,
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

// // 重要的api缓存(离线显示页面)
const importanceAPI = ['/v1/public/boot', '/v1/public/channels', '/v1/public/group-tree/book-recommend'];
registerRoute(
  ({ request }) => {
    const u = new URL(request.url);
    return importanceAPI.includes(u.pathname);
  },
  new NetworkFirst({
    cacheName: 'bootApi',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  }),
);

// 预缓存
precacheAndRoute(self.__WB_MANIFEST);

// 缓存页面
registerRoute(
  ({ request }) => request.destination === 'document',
  new StaleWhileRevalidate({
    cacheName: 'pages',
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 10 * 60,
        purgeOnQuotaError: true
      })
    ]
  })
);

// // 可以添加更多的缓存策略，例如缓存 CSS、JavaScript 或图片等
// registerRoute(
//   ({ request }) => request.destination === 'style',
//   new CacheFirst()
// );

// registerRoute(
//   ({ request }) => request.destination === 'script',
//   new CacheFirst()
// );

// // Catch routing errors, like if the user is offline
// setCatchHandler(async ({ event }) => {
//   // Return the precached offline page if a document is being requested
//   if (event.request.destination === 'document') {
//     return matchPrecache('/novel/offline.html');
//   }
//   return Response.error();
// });

// 动态缓存
// registerRoute(
//   /\/novel\/*$/,
//   new NetworkFirst({ cacheName: 'application' })
// )

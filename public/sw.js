const CACHE_NAME = 'bundacare-android-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon.svg',
    '/icon-192.png',
    '/icon-512.png',
    '/icon-maskable-512.png',
    '/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch(err => {
                console.warn('Pre-caching partial failure, caching individual assets', err);
            });
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// Network-First with Cache fallback for navigation & Cache-First for static
self.addEventListener('fetch', (event) => {
    const req = event.request;
    
    // Non-GET requests (e.g. POST to APIs) pass through
    if (req.method !== 'GET') return;

    // Skip chrome-extension requests
    if (req.url.startsWith('chrome-extension://')) return;

    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req).then((res) => {
                const resClone = res.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
                return res;
            }).catch(() => {
                return caches.match(req).then((cached) => {
                    return cached || caches.match('/');
                });
            })
        );
        return;
    }

    // Cache-First for static icons, fonts, scripts
    event.respondWith(
        caches.match(req).then((cachedResponse) => {
            if (cachedResponse) {
                // Fetch in background to update cache
                fetch(req).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => cache.put(req, networkResponse));
                    }
                }).catch(() => {});
                return cachedResponse;
            }

            return fetch(req).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, responseClone));
                }
                return networkResponse;
            }).catch(() => {
                // Fallback for images
                if (req.destination === 'image') {
                    return caches.match('/icon-192.png');
                }
            });
        })
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            if (windowClients.length > 0) {
                windowClients[0].focus();
            } else {
                clients.openWindow('/');
            }
        })
    );
});

// Polyfill for scheduling if the service worker remains active
let timeouts = [];
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SCHEDULE_REMINDERS') {
        const { reminders, checkups } = event.data.payload;
        // clear previous
        timeouts.forEach(t => clearTimeout(t));
        timeouts = [];
        
        const now = new Date().getTime();
        
        if (reminders) {
            reminders.forEach(r => {
                let delay = 0;
                if (r.type === 'once' && r.datetime) {
                    const dt = new Date(r.datetime).getTime();
                    delay = dt - now;
                } else if (r.type === 'daily' && r.time) {
                    const [h, m] = r.time.split(':').map(Number);
                    const target = new Date();
                    target.setHours(h, m, 0, 0);
                    if (target.getTime() < now) {
                        target.setDate(target.getDate() + 1);
                    }
                    delay = target.getTime() - now;
                }
                
                if (delay > 0 && delay < 86400000) { // Limit scheduling to next 24 hours
                    const timeoutId = setTimeout(() => {
                        self.registration.showNotification("BundaCare Reminder", {
                            body: `${r.title}`,
                            icon: "/icon-192.png",
                            badge: "/icon-192.png",
                            vibrate: [200, 100, 200],
                            data: r
                        });
                    }, delay);
                    timeouts.push(timeoutId);
                }
            });
        }
        
        if (checkups) {
            checkups.forEach(c => {
                const checkupTime = new Date(c.date).getTime();
                // Schedule reminder 2 hours before
                const delay = checkupTime - (2 * 60 * 60 * 1000) - now;
                if (delay > 0 && delay < 86400000) {
                    const timeoutId = setTimeout(() => {
                        self.registration.showNotification("Jadwal Check-up Kehamilan", {
                            body: `Bunda, ada jadwal check-up di ${c.clinic} dalam 2 jam.`,
                            icon: "/icon-192.png",
                            badge: "/icon-192.png",
                            vibrate: [300, 100, 300, 100, 300],
                            data: c
                        });
                    }, delay);
                    timeouts.push(timeoutId);
                }
            });
        }
    }
});

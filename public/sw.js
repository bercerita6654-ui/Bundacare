self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
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
                            icon: "/favicon.ico",
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
                            icon: "/favicon.ico",
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

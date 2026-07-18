// Custom Service Worker for handling Push Notifications
// This script is automatically imported by the main Workbox service worker.

self.addEventListener("push", (event) => {
  let data = {};

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      // Fallback if data is not JSON
      data = {
        title: "PhysioCare Update",
        body: event.data.text(),
      };
    }
  }

  const title = data.title || "PhysioCare Notification";
  const options = {
    body: data.body || "New update available from PhysioCare.",
    icon: data.icon || "/emerald-192.png",
    badge: data.badge || "/emerald-192.png",
    tag: data.tag || "physiocare-notification",
    data: {
      url: data.url || "/dashboard",
      ...data.data,
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  // Close the notification bubble
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/dashboard";

  // Resolve absolute URL for matching
  const absoluteTargetUrl = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Check if a client window matching our origin is already open
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        
        // If the window is open, focus it and redirect to target URL
        if ("focus" in client) {
          client.focus();
          if (client.navigate) {
            return client.navigate(absoluteTargetUrl);
          }
        }
      }

      // If no matching window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(absoluteTargetUrl);
      }
    })
  );
});

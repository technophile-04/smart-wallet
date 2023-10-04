declare let self: ServiceWorkerGlobalScope;

// To disable all workbox logging during development, you can set self.__WB_DISABLE_DEV_LOGS to true
// https://developers.google.com/web/tools/workbox/guides/configure-workbox#disable_logging
// @ts-expect-error
self.__WB_DISABLE_DEV_LOGS = true;

// listen to message event from window
self.addEventListener("message", event => {
  console.log(event?.data);
});

self.addEventListener("push", async event => {
  console.log(event);
  const data = event.data?.text();
  event?.waitUntil(
    self.registration.showNotification("Test Title", {
      body: data,
      icon: "/logo.svg",
    }),
  );
});

self.addEventListener("notificationclick", event => {
  event?.notification.close();
  event?.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return self.clients.openWindow("/");
    }),
  );
});

export {};

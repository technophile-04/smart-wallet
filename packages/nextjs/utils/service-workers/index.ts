export const notificationsSupported = () => {
  if (typeof window === undefined) return false;

  return "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
};

export const unregisterServiceWorkers = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map(r => r.unregister()));
};

export const subscribe = async () => {
  try {
    const swRegistration = await navigator.serviceWorker.getRegistration("/sw.js");
    const premissionResult = await window?.Notification.requestPermission();
    if (premissionResult === "denied") alert("Permission already denied, please enable notifications manually");
    if (!swRegistration) {
      throw new Error("Service worker not registered");
    }

    const options = {
      applicationServerKey: process.env.NEXT_PUBLIC_PUBLIC_KEY_VAPID ?? "",
      userVisibleOnly: true,
    };
    const subscription = await swRegistration.pushManager.subscribe(options);

    await saveSubscription(subscription);

    return subscription;
  } catch (err) {
    console.error("Inside subscribe function: ", err);
    throw new Error("Error while subscribing to push notifications");
  }
};

const saveSubscription = async (subscription: PushSubscription) => {
  const ORIGIN = window.location.origin;
  const BACKEND_URL = `${ORIGIN}/api/push/add-subscription`;

  const response = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  console.log("Sever Response", response);
  return response.json();
};

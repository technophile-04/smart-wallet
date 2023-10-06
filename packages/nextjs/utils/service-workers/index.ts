import { saveSubscription } from "../push-api-calls";
import { notification } from "../scaffold-eth";

export const notificationsSupported = () => {
  if (typeof window === undefined) return false;

  return "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
};

export const unregisterServiceWorkers = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map(r => r.unregister()));
};

export const askForPermission = async () => {
  try {
    const premissionResult = await window?.Notification.requestPermission();
    if (premissionResult === "denied") alert("Permission already denied, please enable notifications manually");
  } catch (err) {
    console.error("Inside askForPermission function: ", err);
    throw new Error(`Error while allowing for notifications`);
  }
};

export const subscribeToNotifications = async () => {
  let notificationId = null;
  try {
    notificationId = notification.loading("Waiting for serviceWorker");
    await navigator.serviceWorker.ready;
    notification.remove(notificationId);

    notificationId = notification.loading("Subscribing to notification");
    const swRegistration = await navigator.serviceWorker.getRegistration("/sw.js");
    if (!swRegistration) {
      throw new Error("Not Registered");
    }

    if (swRegistration.installing) {
      throw new Error("ServiceWorker Installing");
    }
    const options = {
      applicationServerKey: process.env.NEXT_PUBLIC_PUBLIC_KEY_VAPID ?? "",
      userVisibleOnly: true,
    };
    const subscription = await swRegistration.pushManager.subscribe(options);
    await saveSubscription(subscription);
    notification.remove(notificationId);
    notification.success("Successfully subscribed to notification");
    return subscription;
  } catch (err: any) {
    if (err instanceof Error) {
      switch (err.message) {
        case "Not Registered":
          throw new Error("Service Worker not registered, please try again later");
        case "ServiceWorker Installing":
          throw new Error("Service Worker is installing, please try again");
        default:
          throw new Error(`Error while subscribing to notifications ${err?.message}`);
      }
    }
    console.error("Inside subscribe function: ", err);
    throw new Error(`Error while subscribing to notifications`);
  } finally {
    if (notificationId) {
      notification.remove(notificationId);
    }
  }
};

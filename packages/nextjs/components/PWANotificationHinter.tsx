import { useState } from "react";
import { useIsClient } from "usehooks-ts";
import { useGlobalState } from "~~/services/store/store";
import { notification } from "~~/utils/scaffold-eth";
import { askForPermission, notificationsSupported, subscribeToNotifications } from "~~/utils/service-workers";

export const PWANotificationHinter = () => {
  const [isAskForPermissionLoading, setIsAskForPermissionLoading] = useState(false);
  const [isSubscribeLoading, setIsSubscribeLoading] = useState(false);
  const { setPushNotificationSubscription } = useGlobalState(state => state);
  const isClient = useIsClient();

  if (!isClient || !window) return null;

  if (!notificationsSupported()) {
    return (
      <button className="btn btn-primary" disabled={true}>
        Please install PWA first
      </button>
    );
  }

  if (window.Notification.permission !== "granted") {
    return (
      <button
        className="btn btn-primary"
        disabled={isAskForPermissionLoading}
        onClick={async () => {
          try {
            setIsAskForPermissionLoading(true);
            await askForPermission();
          } catch (e) {
            if (e instanceof Error) {
              notification.error(e.message);
            }
          } finally {
            setIsAskForPermissionLoading(false);
          }
        }}
      >
        {isAskForPermissionLoading ? <span className="loading loading-dots loading-xs"></span> : "Allow Notifications"}
      </button>
    );
  }

  return (
    <button
      className="btn btn-primary"
      disabled={isSubscribeLoading}
      onClick={async () => {
        setIsSubscribeLoading(true);
        try {
          const subscription = await subscribeToNotifications();
          setPushNotificationSubscription(subscription);
        } catch (e) {
          if (e instanceof Error) {
            notification.error(e.message);
          }
          setPushNotificationSubscription(null);
        } finally {
          setIsSubscribeLoading(false);
        }
      }}
    >
      {isSubscribeLoading ? <span className="loading loading-dots loading-xs"></span> : "Subscribe to notifications"}
    </button>
  );
};

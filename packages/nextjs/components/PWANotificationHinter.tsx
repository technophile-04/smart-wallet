import { useState } from "react";
import { useIsClient } from "usehooks-ts";
import { useGlobalState } from "~~/services/store/store";
import { notification } from "~~/utils/scaffold-eth";
import { notificationsSupported, subscribe } from "~~/utils/service-workers";

export const PWANotificationHinter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setPushNotificationSubscription } = useGlobalState(state => state);
  const isClient = useIsClient();

  return isClient ? (
    <button
      className="btn btn-primary"
      disabled={!notificationsSupported()}
      onClick={async () => {
        try {
          setIsLoading(true);
          const subscription = await subscribe();
          setPushNotificationSubscription(subscription);
        } catch (e) {
          if (e instanceof Error) {
            notification.error(e.message);
          }
          setPushNotificationSubscription(null);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      {isLoading ? (
        <span className="loading loading-dots loading-xs"></span>
      ) : notificationsSupported() ? (
        "Allow Notifications"
      ) : (
        "Please install PWA first"
      )}
    </button>
  ) : null;
};

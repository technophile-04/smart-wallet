import { useState } from "react";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { PWANotificationHinter } from "~~/components/PWANotificationHinter";
import { Address } from "~~/components/scaffold-eth";
import { useSmartAccount } from "~~/hooks/burnerWallet/useSmartAccount";
import { useGlobalState } from "~~/services/store/store";
import { deleteSubscription, notifyAllSubscribers } from "~~/utils/push-api-calls";
import { notification } from "~~/utils/scaffold-eth";

const Home: NextPage = () => {
  const [sendingNotication, setSendingNotifaction] = useState(false);
  const [unsubscribing, setUnsubscribing] = useState(false);
  const { pushNotificationSubscription, setPushNotificationSubscription } = useGlobalState(state => state);

  const { scaAddress } = useSmartAccount();

  const notifAll = async () => {
    setSendingNotifaction(true);
    try {
      await notifyAllSubscribers("This is test notification from Scaffold-ETH 2 PWA");
    } catch (err) {
      if (err instanceof Error) notification.error(err.message);
      console.log(err);
    } finally {
      setSendingNotifaction(false);
    }
  };

  const unsubscribeMe = async () => {
    setUnsubscribing(true);
    try {
      const swRegistration = await navigator.serviceWorker.ready;
      const subscription = await swRegistration.pushManager.getSubscription();
      if (!subscription) {
        setPushNotificationSubscription(null);
        return;
      }
      await deleteSubscription(subscription);
      await subscription?.unsubscribe();
      setPushNotificationSubscription(null);
    } catch {
      notification.error("Failed to unsubscribe");
    } finally {
      setUnsubscribing(false);
    }
  };

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 flex flex-col items-center">
          <Address address={scaAddress} />
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2 PWA 📱</span>
          </h1>
          {pushNotificationSubscription ? (
            <div className="flex flex-col gap-4">
              <button onClick={notifAll} className="btn btn-primary" disabled={sendingNotication || unsubscribing}>
                {sendingNotication ? <span className="loading loading-dots loading-xs"></span> : "Notify All"}
              </button>
              <button className="btn btn-primary" disabled={sendingNotication || unsubscribing} onClick={unsubscribeMe}>
                {unsubscribing ? <span className="loading loading-dots loading-xs"></span> : "Unsubscribe Me"}
              </button>
            </div>
          ) : (
            <PWANotificationHinter />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

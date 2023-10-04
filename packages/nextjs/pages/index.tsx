import { useState } from "react";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { PWANotificationHinter } from "~~/components/PWANotificationHinter";
import { useGlobalState } from "~~/services/store/store";
import { notification } from "~~/utils/scaffold-eth";

const Home: NextPage = () => {
  const [sendingNotication, setSendingNotifaction] = useState(false);
  const pushNotificationSubscription = useGlobalState(state => state.pushNotificationSubscription);

  const notifAll = async () => {
    setSendingNotifaction(true);
    try {
      const res = await fetch("/api/push/notify-all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "This is a test notification",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      console.log("Response", data);
    } catch (err) {
      if (err instanceof Error) notification.error(err.message);
      console.log(err);
    } finally {
      setSendingNotifaction(false);
    }
  };

  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 flex flex-col items-center">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2 PWA 📱</span>
          </h1>
          {pushNotificationSubscription ? (
            <button onClick={notifAll} className="btn btn-primary" disabled={sendingNotication}>
              {sendingNotication ? <span className="loading loading-dots loading-xs"></span> : "Notify All"}
            </button>
          ) : (
            <PWANotificationHinter />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

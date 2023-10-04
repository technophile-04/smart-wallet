import { NextApiRequest, NextApiResponse } from "next";
import webpush, { PushSubscription } from "web-push";
import { deleteSubscriptionFromDatabase, getAllSubsriptionsFromDb } from "~~/database/firebase/utils";

type Subscription = {
  _id: string;
  pushSubscription: PushSubscription;
};

const triggerPush = async (subscription: Subscription, dataToSend: string) => {
  try {
    await webpush.sendNotification(subscription.pushSubscription, dataToSend);
  } catch (err: any) {
    if (err.statusCode === 410 || err.statusCode === 404) {
      console.log("Subscription has expired or is no longer valid: ", subscription._id);
      await deleteSubscriptionFromDatabase(subscription._id);
    } else {
      console.log("Subscription is no longer valid: ", err);
      throw err;
    }
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
  }

  console.log("Req Body", req.body.message);

  if (!req.body || !req.body.message) {
    console.log("ReqBody", req.body.message);
    // Not a valid subscription.
    res.status(400);
    res.setHeader("Content-Type", "application/json");
    res.send(
      JSON.stringify({
        id: "no-endpoint",
        message: "Notify all failed, no message provided",
      }),
    );
    return;
  }

  try {
    const message = req.body.message;
    const subscriptions = await getAllSubsriptionsFromDb();

    if (subscriptions && subscriptions.length > 0) {
      await Promise.all(
        subscriptions.map(s => {
          return triggerPush(s, message);
        }),
      );
    }

    res.status(200).json({ message: `${subscriptions?.length ?? 0} messages sent!` });
  } catch (e) {
    console.log("Error :", e);
    res.status(500).json({ message: "Error while sending notifications" });
  }
}

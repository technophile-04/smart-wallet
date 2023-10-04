import { NextApiRequest, NextApiResponse } from "next";
import webpush, { PushSubscription } from "web-push";
import { saveSubscriptionToDb } from "~~/database/firebase/utils";

const PUBLIC_KEY_VAPID = process.env.NEXT_PUBLIC_PUBLIC_KEY_VAPID ?? "";
const PRIVATE_KEY_VAPID = process.env.PRIVATE_KEY_VAPID ?? "";
webpush.setVapidDetails("mailto:admin@buidlguidl.com", PUBLIC_KEY_VAPID, PRIVATE_KEY_VAPID);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
  }
  if (!req.body || !req.body.endpoint) {
    // Not a valid subscription.
    res.status(400);
    res.setHeader("Content-Type", "application/json");
    res.send(
      JSON.stringify({
        error: {
          id: "no-endpoint",
          message: "Subscription must have an endpoint.",
        },
      }),
    );
    return res;
  }
  const subscription = req.body as PushSubscription;

  try {
    await saveSubscriptionToDb(subscription);
    res.status(200).json({ message: "Subscription added." });
  } catch (e) {
    console.log("Error :", e);
    res.status(500);
    res.setHeader("Content-Type", "application/json");
    res.send(
      JSON.stringify({
        error: {
          id: "unable-to-save-subscription",
          message: "The subscription was received but we were unable to save it to our database.",
        },
      }),
    );
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { PushSubscription } from "web-push";
import { deleteSubscriptionFromDB } from "~~/database/firebase/utils";

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
    await deleteSubscriptionFromDB(subscription);
    res.status(200).json({ message: "Subscription deleted" });
  } catch (e) {
    console.log("Error :", e);
    res.status(500);
    res.setHeader("Content-Type", "application/json");
    res.send(
      JSON.stringify({
        error: {
          id: "unable-to-delete-subscription",
          message: "The subscription was received but we were unable to delete it to our database.",
        },
      }),
    );
  }
}

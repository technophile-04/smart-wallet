export const notifyAllSubscribers = async (message: string) => {
  const res = await fetch("/api/push/notify-all", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  console.log("Response", data);
};

export const checkMySubscription = async (subscription: PushSubscription) => {
  const res = await fetch("/api/push/checkIsSubscriptionPresent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  console.log("Response", data);
  return data;
};

export const deleteSubscription = async (subscription: PushSubscription) => {
  const res = await fetch("/api/push/deleteSubscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  console.log("Response", data);
  return data;
};

export const saveSubscription = async (subscription: PushSubscription) => {
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

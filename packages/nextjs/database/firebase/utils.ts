import { COLLECTION_NAME, firebaseDB } from "./config";
import { addDoc, collection, deleteDoc, getDocs } from "firebase/firestore";
import { PushSubscription } from "web-push";

type Subscription = {
  _id: string;
  pushSubscription: PushSubscription;
};

const subscriptionCollectionRef = collection(firebaseDB, COLLECTION_NAME);

export const saveSubscriptionToDb = async (subscription: PushSubscription) => {
  try {
    await addDoc(subscriptionCollectionRef, subscription);
  } catch (e) {
    console.log("Error while saving in DB :", e);
  }
};

export const getAllSubsriptionsFromDb = async () => {
  try {
    const querySnapshot = await getDocs(subscriptionCollectionRef);

    const subscriptions: Subscription[] = [];
    querySnapshot.forEach(doc => {
      subscriptions.push({ _id: doc.ref.id, pushSubscription: doc.data() as PushSubscription });
    });

    return subscriptions;
  } catch (e) {
    console.log("Error while fetching from DB :", e);
  }
};

export const deleteSubscriptionFromDatabase = async (id: string) => {
  try {
    const querySnapshot = await getDocs(subscriptionCollectionRef);
    console.log("The id is", id);

    querySnapshot.forEach(async doc => {
      if (doc.ref.id === id) {
        await deleteDoc(doc.ref);
      }
    });
  } catch (e) {
    console.log("Error while deleting from DB :", e);
  }
};

import "../config/env.js";
import connectDB from "../config/database.js";
import { PushSubscription } from "../models/pushSubscription.js";
import webpush from "web-push";

const testSend = async () => {
  try {
    await connectDB();
    
    const subscription = await PushSubscription.findOne();
    if (!subscription) {
      console.log("No subscriptions found in the database. Please subscribe from the patient window first.");
      process.exit(0);
    }
    
    console.log("Found subscription:");
    console.log("Endpoint:", subscription.endpoint);
    
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT || "mailto:admin@clinic.com";
    
    console.log("VAPID Subject:", subject);
    console.log("VAPID Public Key Loaded:", !!publicKey);
    console.log("VAPID Private Key Loaded:", !!privateKey);
    
    if (!publicKey || !privateKey) {
      console.log("VAPID Keys are missing. Check your server/.env file.");
      process.exit(1);
    }
    
    webpush.setVapidDetails(subject, publicKey, privateKey);
    
    const payload = {
      title: "Test Alert",
      body: "This is a direct command-line test notification.",
      url: "/dashboard",
      tag: "test-tag",
    };
    
    console.log("Sending push notification...");
    const response = await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
      },
      JSON.stringify(payload)
    );
    
    console.log("SUCCESS! Push service response status code:", response.statusCode);
    console.log("Headers:", response.headers);
    console.log("Body:", response.body);
  } catch (error) {
    console.error("ERROR SENDING NOTIFICATION:");
    console.error("Status Code:", error.statusCode);
    console.error("Headers:", error.headers);
    console.error("Body:", error.body);
    console.error(error.stack || error);
  } finally {
    process.exit(0);
  }
};

testSend();

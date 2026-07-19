import "../config/env.js";
import connectDB from "../config/database.js";
import { User } from "../models/user.js"; // Explicitly register User schema
import { PushSubscription } from "../models/pushSubscription.js";
import webpush from "web-push";

const testSendAll = async () => {
  try {
    await connectDB();
    
    const subscriptions = await PushSubscription.find().populate("user");
    if (subscriptions.length === 0) {
      console.log("No subscriptions found in the database.");
      process.exit(0);
    }
    
    console.log(`Found ${subscriptions.length} subscription(s) in total.`);
    
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
      title: "Diagnostic Alert",
      body: "Testing multi-device dispatch from local server.",
      url: "/dashboard",
      tag: "diagnostic-test",
    };
    
    for (let i = 0; i < subscriptions.length; i++) {
      const sub = subscriptions[i];
      const userEmail = sub.user ? sub.user.email : "Orphaned (No User)";
      console.log(`\n--- Sending to Device ${i + 1}/${subscriptions.length} (User: ${userEmail}) ---`);
      console.log("User-Agent:", sub.userAgent || "Unknown");
      console.log("Endpoint:", sub.endpoint);
      
      try {
        const response = await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.keys.p256dh,
              auth: sub.keys.auth,
            },
          },
          JSON.stringify(payload)
        );
        console.log(`SUCCESS! Status code: ${response.statusCode}`);
      } catch (error) {
        console.error("FAILED to send to this device:");
        console.error("Status Code:", error.statusCode);
        console.error("Body:", error.body || "No body");
        console.error("Message:", error.message || error);
      }
    }
  } catch (error) {
    console.error("Global Test Error:", error);
  } finally {
    process.exit(0);
  }
};

testSendAll();

//fcm.ts
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./config";

export async function getFCMToken() {
  if (!messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_VAPID_KEY,
      });
      return token;
    } else {
      console.error("تم رفض إذن الإشعارات");
      return null;
    }
  } catch (error) {
    console.error("خطأ في جلب FCM Token:", error);
    return null;
  }
}
export function setupForegroundNotifications() {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    const notificationTitle = payload.notification?.title || "إشعار جديد";
    const notificationBody = payload.notification?.body || "لديك رسالة جديدة.";
   console.log(notificationBody)
     alert(`${notificationTitle}\n${notificationBody}`)
    const originalTitle = document.title;
    document.title = `🔔 ${notificationTitle}`;
    setTimeout(() => {
      document.title = originalTitle;
    }, 5000);
  });
}

import { useEffect } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { toast } from "react-toastify";

// تهيئة Firebase

const useFirebaseNotifications = () => {
  useEffect(() => {
    const messaging = getMessaging();

    const requestPermission = async () => {
      try {
        const currentToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_VAPID_KEY,
        });
        if (currentToken) {
          console.log(" received: ");
        } else {
          console.error(
            "No token available. Request permission to generate one."
          );
        }
      } catch (err) {
        console.error("An error occurred while retrieving token.", err);
      }
    };

    onMessage(messaging, (payload) => {
      const { title, body } = payload.notification;
      toast.info(` ${title}: ${body}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    });

    requestPermission();
  }, []);

  return null;
};

export default useFirebaseNotifications;

/* eslint-disable no-undef */
//firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyANpB3y5Oj7zHMfzQvMPtIH5JCsOp7eH64",
  authDomain: "tabi-4ebab.firebaseapp.com",
  databaseURL: "https://tebbi-1fda2-default-rtdb.firebaseio.com",
  projectId: "tabi-4ebab",
  storageBucket: "tabi-4ebab.firebasestorage.app",
  messagingSenderId: "15841420156",
  appId: "1:15841420156:web:15322e26632bbf5b993af9",
  measurementId: "G-39N8YZZRNX"
};

try {
  if (!self.firebase) {
    console.error("Service Worker: Firebase global not found");
  } else {
    self.firebase.initializeApp(firebaseConfig);
  }
} catch (error) {
  console.error("Service Worker: Firebase initialization failed:", error);
}

try {
  const messaging = self.firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "/src/assets/mainLogo.svg",
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (error) {
  console.error("Service Worker: Messaging initialization failed:", error);
}

import React from "react";
import "./global.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./login/Login";
import Dashboard from "./pages/Dashboard";
import WalettDetails from "./pages/WalettDetails";
import { AuthMiddleware, GuestMiddleware } from "./middlewares/authMiddleware";
import MainLayout from "./pages/MainNaviagtion";
import Speizlization from "./components/Speizlization";
import HomeVisit from "./pages/HomeVisit";
import Walett from "./pages/Walett";
import SecondLayout from "./components/SecondLayout";
import Notification from "./components/Notification";
import Booking from "./pages/Booking";
import Refunds from "./pages/Refunds";
import BookingDetails from "./components/BookingDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddsSecialization from "./pages/AddsSecialization";
import Search from "./pages/Search";
import Reviews from "./pages/Reviews";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthMiddleware />, 
    children: [
      {
        path: "",
        element: <MainLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "home-visit", element: <HomeVisit /> },   

          {
            path: "wallet",
            children: [
              { index: true, element: <Walett /> },
              {
                path: ":doctorId",
                element: <WalettDetails />,
              },
            ],
          },
          {
            path:"search", element:<Search/>
          }
        ],
      },
      { path: "reviews", element: <Reviews /> },
      {
        path: "/specialization",
        element: <SecondLayout />,
        children: [
          { path: ":speizId", element: <Speizlization /> },
          { path: "refunds", element: <Refunds /> },

          {
            path: "booking",
            children: [
              { path: ":BookId", element: <Booking /> },
              { path: "details/:doctorId", element: <BookingDetails /> },
            ],
          },
          
        ],
      },
      {
        path: "/add-specialization",
        element: <AddsSecialization />
      },

      {
        path: "/notification",
        element: <Notification />,
      },
    ],
  },

  {
    path: "/login",
    element: <GuestMiddleware />,
    children: [{ index: true, element: <Login /> }],
  },
]);

function App() {
  return (
    <main
      className="max-w-md container mx-auto relative min-h-screen overflow-hidden "
      dir="rtl"
    >
      <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      </QueryClientProvider>

    </main>
  );
}

export default App;

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import HowItWorks from "./pages/Howitworkspage.tsx";
import SignIn from "./pages/SignIn.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ProtectedRoute from "./auth/ProtectedRoute.tsx";
import Profile from "./pages/authPages/Profile.tsx";
import DashboardLayout from "./pages/authPages/DashboardLayout.tsx";
import Market from "./pages/authPages/Market.tsx";
import Listings from "./pages/authPages/Listings.tsx";
import CreateListing from "./pages/authPages/CreateListing.tsx";
import Favourites from "./pages/authPages/Favourites.tsx";
import UpdatePassword from "./pages/UpdateComponent.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Layout
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/how-it-works",
        element: <HowItWorks />,
      },
      {
        path: "/forgotpassword",
        element: <ForgotPassword />,
      },
      {
        path: "/updatepassword",
        element: <UpdatePassword />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/market",
            element: <DashboardLayout />, // Layout
            children: [
              {
                index: true,
                element: <Market />,
              },
              {
                path: "profile",
                element: <Profile />,
              },
              {
                path: "listings",
                element: <Listings />,
              },
              {
                path: "listings/create",
                element: <CreateListing />,
              },
              {
                path: "favourites",
                element: <Favourites />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

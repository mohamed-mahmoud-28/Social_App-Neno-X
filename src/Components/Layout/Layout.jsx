import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./../NavBar/NavBar";
import Footer from "./../Footer/Footer";
import AsiadBar from "./../AsiadBar/AsiadBar";
import { useContext } from "react";
import { authContext } from "../../Context/AuthContextValue";
import { Helmet } from "react-helmet-async";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import { useNotificationPolling } from "../../Hooks/useNotificationPolling";

export default function Layout() {
  const { authToken } = useContext(authContext);
  const { pathname } = useLocation();
  useNotificationPolling(authToken);

  const titles = {
    "/": "Create your account",
    "/login": "Log in",
    "/home": "Home Feed",
    "/following-users": "Following Users",
    "/profile": "Your Profile",
    "/settings": "Settings",
    "/notifications": "Notifications",
    "/follow-suggestions": "Discover People",
  };

  const pageTitle = pathname.startsWith("/details/")
    ? "Post Details"
    : pathname.startsWith("/users/")
      ? "User Profile"
      : titles[pathname] || "Page Not Found";

  return (
    <>
      <ScrollToTop />

      <Helmet>
        <title>{pageTitle} | Neno X</title>
      </Helmet>
      
      <NavBar />

      {authToken && <AsiadBar />}

      <main
        className={`min-h-[calc(100vh-72px)] ${authToken ? "lg:ml-80" : ""
          }`}
      >
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
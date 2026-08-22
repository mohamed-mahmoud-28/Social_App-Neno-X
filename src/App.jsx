import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from './Components/Layout/Layout';
import Register from './Auth/Register/Register';
import Login from './Auth/Login/Login';
import Profile from './Components/Profile/Profile';
import Home from './Components/Home/Home';
import NotFound from './Components/NotFound/NotFound';
import { CounterContextProvider } from './Context/CounterContext';
import { AuthContextProvider } from './Context/AuthContext';
import ProtectAuth from './Components/ProtectAuth/ProtectAuth';
import ProtectRoute from './Components/ProtectRoute/ProtectRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PostDetails from './Components/PostDetails/PostDetails';
import { ToastContainer } from 'react-toastify';
import Settings from './Components/Settings/Settings';
import GetHomeFeed from './Components/GetHomeFeed/GetHomeFeed';
import { useNetworkState } from 'react-use';
import { HelmetProvider } from 'react-helmet-async';
import UserProfile from './Components/UserProfile/UserProfile';
import Notifications from './Components/Notifications/Notifications';
import DiscoverPeople from './Components/DiscoverPeople/DiscoverPeople';
import RouteError from './Components/RouteError/RouteError';

function App() {
  const network = useNetworkState();

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (failureCount, error) => !error?.response && failureCount < 1,
        refetchOnWindowFocus: false,
      },
      mutations: { retry: 0 },
    },
  }))


  const router = createBrowserRouter([
    {
      errorElement: <RouteError />,
      path: '/', element: <Layout />, children: [
        { index: true, element: <ProtectAuth><Register /></ProtectAuth> },
        { path: 'login', element: <ProtectAuth><Login /> </ProtectAuth> },
        { path: 'home', element: <ProtectRoute><Home /></ProtectRoute> },
        { path: 'following-users', element: <ProtectRoute><GetHomeFeed /></ProtectRoute> },
        { path: 'profile', element: <ProtectRoute><Profile /></ProtectRoute> },
        { path: 'users/:id', element: <ProtectRoute><UserProfile /></ProtectRoute> },
        { path: 'details/:id', element: <ProtectRoute><PostDetails /></ProtectRoute> },
        { path: 'settings', element: <ProtectRoute><Settings /></ProtectRoute> },
        { path: 'notifications', element: <ProtectRoute><Notifications /></ProtectRoute> },
        { path: 'follow-suggestions', element: <ProtectRoute><DiscoverPeople /></ProtectRoute> },
        { path: '*', element: <NotFound /> },
      ]
    }
  ])

  if (!network.online) {
    return (
      <div className="flex min-h-screen items-center justify-center ">
        <div className="text-center">
          <p className="text-3xl font-semibold text-red-500">
            You are offline 🔴
          </p>

          <p className="mt-2 text-gray-600">
            Please check your internet connection.
          </p>
        </div>
      </div>
    );
  }


  return (

    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthContextProvider>
          <CounterContextProvider>
            <RouterProvider router={router} />
            <ToastContainer />
          </CounterContextProvider>
        </AuthContextProvider>
      </HelmetProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>

  )
}

export default App

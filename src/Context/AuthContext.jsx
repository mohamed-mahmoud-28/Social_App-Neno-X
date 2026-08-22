import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { authContext } from "./AuthContextValue";


export function AuthContextProvider({ children }) {

    const [authToken, setAuthToken] = useState(() => localStorage.getItem("token"))
    const [userData, setUserData] = useState(null)

    const getUserData = useCallback(async () => {
        const { data } = await axios.get('https://route-posts.routemisr.com/users/profile-data'
            , {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        )
        setUserData(data.data.user);
    }, []);

    useEffect(() => {
        async function loadUserData() {
            try {
                await getUserData();
            } catch {
                localStorage.removeItem("token");
                setAuthToken(null);
                setUserData(null);
            }
        }

        if (authToken) {
            loadUserData();
        }
    }, [authToken, getUserData])

    useEffect(() => {
        const interceptorId = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error?.response?.status === 401) {
                    localStorage.removeItem("token");
                    setAuthToken(null);
                    setUserData(null);
                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptorId);
    }, []);

    return (
        <authContext.Provider value={{ authToken, setAuthToken, userData, setUserData, getUserData }}>
            {children}
        </authContext.Provider>
    )
}

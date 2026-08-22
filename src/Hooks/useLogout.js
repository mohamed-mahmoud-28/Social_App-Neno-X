import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../Context/AuthContextValue";

export function useLogout() {
  const navigate = useNavigate();
  const { setAuthToken, setUserData } = useContext(authContext);

  function logout() {
    localStorage.removeItem("token");
    setAuthToken(null);
    setUserData(null);
    navigate("/login");
  }

  return logout;
}

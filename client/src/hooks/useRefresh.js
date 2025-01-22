import { api } from "../utils/axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

export default function useRefresh() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const refresh = async () => {
    try {
      const response = await api.get("/api/auth/refresh", {
        withCredentials: true,
      });
      setAuth((prevState) => {
        return {
          ...prevState,
          accessToken: response.data.accessToken,
          user: response.data.user,
        };
      });
      navigate("/app/dashboard/frontend-dashboard");
      return response.data;
    } catch (error) {
      setAuth((prevState) => {
        return {
          ...prevState,
          accessToken: "",
          user: null,
        };
      });
    }
  };
  return refresh;
}

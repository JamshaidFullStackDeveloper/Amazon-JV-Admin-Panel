import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import apiClient from "../utils/apiClient"; // Import the custom Axios instance
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const token = Cookies.get("token"); // Retrieve token from cookies

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await apiClient.post("/login", { email, password });
      // console.log(response);

      const { token, data } = response.data;
      // console.log(token);
      Cookies.set("token", token, { expires: 7, secure: true, sameSite: "Strict" });
      Cookies.set("user", JSON.stringify(data), {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      fetchUser();

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data.message || "Network error. Please try again.");
    }
  };

  // Fetch authenticated user data
  const fetchUser = async () => {
    try {
      const response = await apiClient.get("/profile");
      // console.log(response);
      const userData = response?.data?.data;

      // Check role
      if (userData?.role !== "Admin") {
        logout(); // Auto-logout if not admin
        return;
      }
      setUser(userData);
    } catch (error) {
      logout();
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiClient.post("/logout");

    } catch (err) {
      // Optional: handle logout error silently
    }

    setUser(null);
    Cookies.remove("token");
    Cookies.remove("user");
  };


  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth context
export const useAuth = () => useContext(AuthContext);

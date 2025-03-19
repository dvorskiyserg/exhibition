import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      fetchUserData(parsedUser.jwt); // Оновлюємо дані користувача з бази при старті
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (jwt) => {
    try {
      const userResponse = await axios.get(
        "http://localhost:1337/api/users/me",
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );

      const fullUserData = {
        id: userResponse.data.id,
        email: userResponse.data.email,
        username: userResponse.data.username,
        fullname: userResponse.data.fullname || "",
        organization: userResponse.data.organization || "",
        website: userResponse.data.website || "",
        phone: userResponse.data.phone || "",
        description: userResponse.data.description || "",
        user_status: userResponse.data.user_status || "Кандидат",
        role: userResponse.data.role?.name.toLowerCase() || "authenticated",
        jwt,
      };

      setUser(fullUserData);
      localStorage.setItem("user", JSON.stringify(fullUserData));
    } catch (error) {
      console.error("Помилка отримання даних користувача:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier, password) => {
    try {
      const res = await axios.post("http://localhost:1337/api/auth/local", {
        identifier,
        password,
      });

      const jwt = res.data.jwt;
      await fetchUserData(jwt);
    } catch (error) {
      console.error("Помилка логіну:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

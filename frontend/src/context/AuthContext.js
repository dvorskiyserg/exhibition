import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
    }
  }, []);

  const login = async (identifier, password) => {
    try {
      const res = await axios.post("http://localhost:1337/api/auth/local", {
        identifier,
        password,
      });

      const jwt = res.data.jwt;

      // Запитуємо додаткову інформацію (роль)
      const userResponse = await axios.get(
        "http://localhost:1337/api/users/me?populate=role",
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );

      const userData = {
        jwt,
        role: userResponse.data.role?.name.toLowerCase() || "authenticated",
      };

      console.log("User після логіну:", userData);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Помилка логіну:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

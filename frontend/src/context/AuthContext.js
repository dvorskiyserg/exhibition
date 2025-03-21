import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false); // Додаємо прапорець

  useEffect(() => {
    if (!hasFetched) {
      const savedUser = localStorage.getItem("user");
      const savedJwt = localStorage.getItem("jwt");

      if (savedUser && savedJwt) {
        const parsedUser = JSON.parse(savedUser);
        fetchUserData(savedJwt);
      } else {
        setLoading(false);
      }
      setHasFetched(true); // Ставимо прапорець, щоб useEffect більше не викликався
    }
  }, [hasFetched]);

  const fetchUserData = async (jwt) => {
    if (!jwt) {
      console.error("JWT відсутній, вихід...");
      logout();
      return;
    }

    try {
      const userResponse = await axios.get(
        "http://localhost:1337/api/users/me?populate=role",
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );

      // console.log("Дані користувача:", userResponse.data);

      const role =
        userResponse.data.role && userResponse.data.role.name
          ? userResponse.data.role.name.toLowerCase()
          : "authenticated";

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
        role,
        jwt,
      };

      setUser(fullUserData);
      localStorage.setItem("user", JSON.stringify(fullUserData));
      localStorage.setItem("jwt", jwt);
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
      localStorage.setItem("jwt", jwt);
      await fetchUserData(jwt);
    } catch (error) {
      console.error("Помилка логіну:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

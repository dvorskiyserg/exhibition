import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [jwt, setJwt] = useState(() => localStorage.getItem("jwt") || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.role) return;

    console.log(
      "🔹 Перевірка ролі користувача після оновлення стану:",
      user.role
    );

    if (user.role.name === "admin") {
      console.log("✅ Редирект в /dashboard");
      navigate("/dashboard", { replace: true });
    } else {
      console.log("✅ Редирект в /profile");
      navigate("/profile", { replace: true });
    }
  }, [user, navigate]);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:1337/api/auth/local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message || "Помилка входу");
      }

      console.log("✅ Успішний вхід:", data);
      const { jwt, user } = data;

      // Отримуємо деталі користувача разом з роллю
      const userResponse = await fetch(
        `http://localhost:1337/api/users/${user.id}?populate=role`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      const fullUserData = await userResponse.json();
      console.log("🔹 Повна інформація про користувача:", fullUserData);

      if (!fullUserData.role) {
        throw new Error("❌ Помилка: роль користувача не знайдена.");
      }

      localStorage.setItem("user", JSON.stringify(fullUserData));
      localStorage.setItem("jwt", jwt);

      setUser(fullUserData);
      setJwt(jwt);
    } catch (error) {
      console.error("❌ Помилка входу:", error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    setUser(null);
    setJwt(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, jwt, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);

      if (user && user.role) {
        if (user.role.name === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/profile");
        }
      } else {
        setError("Користувача не знайдено. Зареєструйтеся.");
      }
    } catch (err) {
      setError("Неправильний логін або пароль.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-primary mb-4">Увійти</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn w-full">
          Увійти
        </button>
      </form>
      <p className="text-center mt-4">
        Ще не маєте акаунта?{" "}
        <Link to="/register" className="text-primary font-semibold">
          Зареєструватися
        </Link>
      </p>
    </div>
  );
};

export default Login;

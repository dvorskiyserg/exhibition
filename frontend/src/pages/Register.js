import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "http://localhost:1337/api/auth/local/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Реєстрація успішна! Тепер ви можете увійти.");
        setTimeout(() => navigate("/login"), 2000); // Переадресація на логін
      } else {
        setError(data.error.message || "Помилка реєстрації");
      }
    } catch (error) {
      setError("Помилка мережі, спробуйте ще раз.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-primary mb-4">Реєстрація</h1>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Ім'я користувача"
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn w-full">
          Зареєструватися
        </button>
      </form>

      <p className="text-center mt-4">
        Вже маєте акаунт?{" "}
        <Link to="/login" className="text-primary font-semibold">
          Увійти
        </Link>
      </p>
    </div>
  );
};

export default Register;

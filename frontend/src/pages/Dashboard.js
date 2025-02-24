import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Повернення на сторінку входу після виходу
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-primary mb-4">
        Панель управління
      </h1>
      <p className="text-gray-600">
        Ласкаво просимо,{" "}
        <span className="font-semibold">
          {user ? user.email : "користувач"}
        </span>
      </p>

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleLogout}
          className="btn bg-danger text-white px-4 py-2 rounded"
        >
          Вийти
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

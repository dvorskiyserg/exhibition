import { useAuth } from "../context/AuthContext";
// import SlideManager from "../components/SlideManager";

const AdminPanel = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-primary mb-4">Адмін-панель</h1>
      <p className="text-gray-600">
        Ласкаво просимо,{" "}
        <span className="font-semibold">
          {user ? user.email : "адміністратор"}
        </span>
      </p>

      <div className="mt-6 flex gap-4">
        <button className="btn">Керувати користувачами</button>
        <button className="btn">Налаштування</button>
      </div>

      {/* <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Адмін Панель</h1>
        <SlideManager />
      </div> */}
    </div>
  );
};

export default AdminPanel;

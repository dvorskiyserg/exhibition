import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-primary mb-4">Профіль</h1>
      <p className="text-gray-600">
        Ваш email:{" "}
        <span className="font-semibold">
          {user ? user.email : "користувач"}
        </span>
      </p>

      <div className="mt-6">
        <button className="btn">Редагувати профіль</button>
      </div>
    </div>
  );
};

export default Profile;

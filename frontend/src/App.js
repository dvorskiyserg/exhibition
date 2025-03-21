import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Сторінки
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contacts from "./pages/Contacts";
import Gallery from "./pages/Gallery";

// Адмін-панель
import Dashboard from "./components/admin/Dashboard";
import Users from "./components/admin/Users";
import News from "./components/admin/News";
import Slider from "./components/admin/Slider";
import Emails from "./components/admin/Emails";

// Визначаємо `basename` залежно від середовища
const basename = process.env.NODE_ENV === "production" ? "/exhibition" : "/";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router basename={basename}>
        <AuthProvider>
          <Header />
          <div className="pt-16">
            <div className="container mx-auto p-6">
              <Routes>
                {/* Публічні маршрути */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/gallery" element={<Gallery />} />

                {/* Приватні маршрути для авторизованих користувачів */}
                <Route element={<PrivateRoute />}>
                  <Route path="/profile" element={<Profile />} />
                </Route>

                {/* Приватні маршрути для адміністраторів */}
                <Route
                  path="/admin"
                  element={<PrivateRoute adminOnly={true} />}
                >
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="users" element={<Users />} />
                  <Route path="news" element={<News />} />
                  <Route path="slider" element={<Slider />} />
                  <Route path="gallery" element={<Gallery />} />
                  <Route path="emails" element={<Emails />} />
                </Route>

                {/* Редирект для некоректних URL */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
          <Footer />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

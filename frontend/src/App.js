import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import DashboardPage from "./components/admin/DashboardPage";
import UsersPage from "./components/admin/UsersPage";
import NewsPage from "./components/admin/NewsPage";
import Contacts from "./pages/Contacts";
import Gallery from "./pages/Gallery";

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
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route path="/admin/dashboard" element={<DashboardPage />} />
                <Route path="/admin/users" element={<UsersPage />} />
                <Route path="/admin/news" element={<NewsPage />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/gallery" element={<Gallery />} />
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

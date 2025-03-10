import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import Home from "./pages/Home";
import Footer from "./components/Footer";

// import { Button, Container, Header as RSHeader, Content, Footer } from "rsuite";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Header />
          <div className="pt-16">
            <div className="container mx-auto p-6 ">
              <Routes>
                <Route
                  path="/"
                  CassName="container mx-auto"
                  element={<Home />}
                />
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
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute adminOnly>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                {/* <Route
                  path="/admin"
                  element={
                    <PrivateRoute adminOnly>
                      <AdminPanel />
                    </PrivateRoute>
                  }
                /> */}
              </Routes>
            </div>
          </div>
        </AuthProvider>
      </Router>
      <Footer />
    </QueryClientProvider>
  );
}

export default App;

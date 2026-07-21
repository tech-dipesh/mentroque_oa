import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import { ProtectedRoute } from "./components/ProtectedRoute.js";
import { LandingPage } from "./pages/LandingPage.js";
import { UserLoginPage } from "./pages/UserLoginPage.js";
import { MentorLoginPage } from "./pages/MentorLoginPage.js";
import { AdminLoginPage } from "./pages/AdminLoginPage.js";
import { UserSignupPage } from "./pages/UserSignupPage.js";
import { MentorSignupPage } from "./pages/MentorSignupPage.js";
import { AdminSignupPage } from "./pages/AdminSignupPage.js";
import { UserDashboard } from "./pages/UserDashboard.js";
import { MentorDashboard } from "./pages/MentorDashboard.js";
import { AdminDashboard } from "./pages/AdminDashboard.js";

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/user" element={<UserLoginPage />} />
          <Route path="/login/mentor" element={<MentorLoginPage />} />
          <Route path="/login/admin" element={<AdminLoginPage />} />
          <Route path="/signup/user" element={<UserSignupPage />} />
          <Route path="/signup/mentor" element={<MentorSignupPage />} />
          <Route path="/signup/admin" element={<AdminSignupPage />} />

          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={["USER"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor"
            element={
              <ProtectedRoute allowedRoles={["MENTOR"]}>
                <MentorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

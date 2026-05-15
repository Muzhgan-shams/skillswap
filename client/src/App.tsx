import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route
          path="/"
          element={
            <div className="p-8 text-2xl font-bold text-blue-600">
              Home Page
            </div>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/register"
          element={<div className="p-8 text-2xl font-bold">Register Page</div>}
        />
        <Route
          path="*"
          element={
            <div className="p-8 text-2xl font-bold text-red-600">
              404 — Page Not Found
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;

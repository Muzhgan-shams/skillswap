import { Routes, Route } from "react-router-dom";

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
        <Route
          path="/login"
          element={
            <div className="p-8 text-2xl font-bold text-blue-600">
              Login Page
            </div>
          }
        />
        <Route
          path="/register"
          element={
            <div className="p-8 text-2xl font-bold text-green-600">
              Register Page
            </div>
          }
        />
        <Route
          path="*" /* the wildcard route, matches anyy URL that did not match anything above */
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
